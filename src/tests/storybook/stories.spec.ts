import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { test, expect } from '@playwright/test'

interface StorybookStory {
	id: string
	title: string
	name: string
	type: 'story' | 'docs'
	parameters?: {
		noScreenshot?: boolean
		// Add parameters for controlling animations
		disableAnimations?: boolean
		waitForLoadingState?: boolean
	}
}

interface StorybookIndex {
	v: number
	entries: Record<string, StorybookStory>
}

// Get platform-specific suffix for screenshots
const getPlatformSuffix = () => {
	switch (process.platform) {
		case 'linux':
			return 'linux'
		case 'darwin':
			return 'darwin'
		case 'win32':
			return 'windows'
		default:
			return process.platform
	}
}

// Build Storybook if needed before any tests run
test.beforeAll(async () => {
	const indexPath = path.join(process.cwd(), 'storybook-static', 'index.json')

	// Only build if needed and not in CI (CI should already have built it)
	if (!process.env['CI']) {
		const needsBuild = (() => {
			try {
				if (!fs.existsSync(indexPath)) {
					console.log('Storybook build not found, building...')
					return true
				}

				const buildTime = fs.statSync(indexPath).mtimeMs
				const command =
					process.platform === 'win32'
						? `dir /s /b src\\**\\*.stories.tsx`
						: `find src -name "*.stories.tsx"`

				const storyFiles = execSync(command, { encoding: 'utf-8' })
					.split('\n')
					.filter(Boolean)

				const hasNewerFiles = storyFiles.some((file) => {
					const fileTime = fs.statSync(file).mtimeMs
					return fileTime > buildTime
				})

				if (hasNewerFiles) {
					console.log('Story files have changed, rebuilding...')
					return true
				}

				return false
			} catch (error) {
				console.log('Error checking build status, rebuilding:', error)
				return true
			}
		})()

		if (needsBuild) {
			execSync('bun run build-storybook', { stdio: 'inherit' })
		}
	}
})

// Read the Storybook index and generate tests
const indexPath = path.join(process.cwd(), 'storybook-static', 'index.json')
if (fs.existsSync(indexPath)) {
	const indexContent = fs.readFileSync(indexPath, 'utf-8')
	const { entries } = JSON.parse(indexContent) as StorybookIndex

	// Filter to only get actual stories (no docs pages)
	// Filter to only get actual stories (no docs pages)
	const stories = Object.values(entries).filter(
		(story) => story.type === 'story',
	)

	// Create a test for each story
	for (const story of stories) {
		const { id, title, name, parameters } = story

		// Skip stories that set noScreenshot = true
		if (parameters?.noScreenshot) continue

		test(`${title} - ${name}`, async ({ page }) => {
			const storybookUrl =
				process.env['STORYBOOK_URL'] || 'http://localhost:6006'

			// Disable CSS animations if requested by the story
			if (parameters?.disableAnimations) {
				await page.addStyleTag({
					content: `
					*, *::before, *::after {
						animation-duration: 0s !important;
						animation-delay: 0s !important;
						transition-duration: 0s !important;
						transition-delay: 0s !important;
					}
				`,
				})
			}

			// Navigate to the story with retry logic
			await page.goto(`${storybookUrl}/iframe.html?id=${id}&viewMode=story`, {
				timeout: 30000,
				waitUntil: 'networkidle',
			})

			// Wait for the story to be fully rendered
			await page.waitForSelector('#storybook-root:not(.sb-loading)', {
				timeout: 30000,
			})

			// For components with loading states, ensure they're stable
			if (parameters?.waitForLoadingState) {
				await page.waitForTimeout(1000)
			}

			// Platform-specific screenshot name
			const screenshotName = `${title}-${name}-storybook-${getPlatformSuffix()}.png`

			// Capture screenshot for visual regression
			await expect(page).toHaveScreenshot(screenshotName, {
				threshold: 0.2,
				animations: 'disabled',
				timeout: parameters?.waitForLoadingState ? 10000 : 5000,
				fullPage: false,
				scale: 'device',
			})
		})
	}
}
