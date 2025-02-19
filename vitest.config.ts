import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['./src/**/*.test.{ts,tsx}'],
		setupFiles: ['./src/tests/setup/setup-test-env.ts'],
		globalSetup: ['./src/tests/setup/global-setup.ts'],
		restoreMocks: true,
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			all: true,
			enabled: true,
			exclude: [
				'node_modules/',
				'src/tests/',
				'src/*.{ts,tsx}',
				'src/components/',
				'src/email/',
				'src/routes',
				'src/trigger',
				'**/*.test.ts',
				'**/*.spec.ts',
				'**/templates/**',
				// We test ui via e2e playwright tests
				'**/ui/**',
				'**/*.client.{ts,tsx}',
				'**/*.api.{ts,tsx}',
				'**/client/**',
				'**/hooks/**',
				'**/drizzle/**',
			],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
})
