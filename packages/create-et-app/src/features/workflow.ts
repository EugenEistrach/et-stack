import path from 'path'
import fs from 'fs-extra'
import { type FeatureContext } from './index.js'

export async function transformWorkflow(ctx: FeatureContext) {
	// Read the base workflow file from the root project
	const baseWorkflowPath = path.join(
		process.cwd(),
		'.github/workflows/deploy.yml',
	)
	let workflowContent = await fs.readFile(baseWorkflowPath, 'utf8')

	// Remove deploy job if fly is not selected
	if (!ctx.selectedFeatures.includes('fly')) {
		workflowContent = removeJobFromWorkflow(workflowContent, 'deploy')
		// Update needs array in other jobs
		workflowContent = workflowContent.replace(
			/needs: \[.*?deploy.*?\]/g,
			(match) => {
				const needs = match
					.slice(8, -1)
					.split(',')
					.map((s) => s.trim())
				const filteredNeeds = needs.filter((need) => need !== 'deploy')
				return filteredNeeds.length
					? `needs: [${filteredNeeds.join(', ')}]`
					: ''
			},
		)
	}

	// Remove trigger job if trigger is not selected
	if (!ctx.selectedFeatures.includes('trigger')) {
		workflowContent = removeJobFromWorkflow(workflowContent, 'deploy-trigger')
		// Update needs array in other jobs
		workflowContent = workflowContent.replace(
			/needs: \[.*?deploy-trigger.*?\]/g,
			(match) => {
				const needs = match
					.slice(8, -1)
					.split(',')
					.map((s) => s.trim())
				const filteredNeeds = needs.filter((need) => need !== 'deploy-trigger')
				return filteredNeeds.length
					? `needs: [${filteredNeeds.join(', ')}]`
					: ''
			},
		)
	}

	return workflowContent
}

function removeJobFromWorkflow(content: string, jobName: string): string {
	// Match the job and its entire content, including nested blocks
	const jobRegex = new RegExp(
		`\\s+${jobName}:\\s*\\n(\\s+[^\\n]*\\n)*(\\s+steps:[^]*?(?=\\n\\s*\\w+:|$))`,
		'g',
	)
	return content.replace(jobRegex, '')
}
