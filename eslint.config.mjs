import { default as defaultConfig } from '@epic-web/config/eslint'
import * as tanstackQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import gitignore from 'eslint-config-flat-gitignore'
import pluginBoundaries from 'eslint-plugin-boundaries'
import reactPlugin from 'eslint-plugin-react'

export default [
	...defaultConfig,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['**/stories/**/*', '**/*.stories.tsx'],
	},
	gitignore(),
	...pluginRouter.configs['flat/recommended'],
	{
		name: '@tanstack/query',
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'@tanstack/query': {
				rules: tanstackQuery.default.rules,
			},
		},
		rules: tanstackQuery.default.configs.recommended.rules,
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			react: reactPlugin,
		},
		rules: {
			'react/jsx-curly-brace-presence': [
				'error',
				{ props: 'never', children: 'never' },
			],
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			boundaries: pluginBoundaries,
		},
		settings: {
			'boundaries/include': ['src/**/*'],
			'boundaries/elements': [
				{
					mode: 'file',
					type: 'test-file',
					pattern: ['**/*.test.{js,jsx,ts,tsx}'],
				},
				{
					mode: 'full',
					type: 'core',
					pattern: [
						'src/entry.client.tsx',
						'src/entry.server.tsx',
						'src/router.tsx',
					],
				},
				{
					mode: 'full',
					type: 'shared',
					pattern: [
						'src/components/**/*',
						'src/data/**/*',
						'src/drizzle/**/*',
						'src/hooks/**/*',
						'src/lib/**/*',
						'src/styles/**/*',
						'src/features/_shared/**/*',
					],
				},
				{
					mode: 'full',
					type: 'feature',
					capture: ['featureName'],
					pattern: ['src/features/*/**/*'],
				},
				{
					mode: 'full',
					type: 'routes',
					capture: ['_', 'fileName'],
					pattern: ['src/routes/**/*'],
				},
				{
					mode: 'full',
					type: 'neverImport',
					pattern: ['src/*'],
				},
				{
					mode: 'full',
					type: 'trigger',
					pattern: ['src/trigger/**/*'],
				},
				{
					mode: 'full',
					type: 'tests',
					pattern: ['src/tests/**/*'],
				},
				{
					mode: 'full',
					type: 'stories',
					pattern: ['src/stories/**/*'],
				},
			],
		},
		rules: {
			'boundaries/no-unknown': 'error',
			'boundaries/no-unknown-files': 'error',
			'boundaries/element-types': [
				'error',
				{
					default: 'disallow',
					rules: [
						{
							from: ['trigger'],
							allow: ['trigger'],
						},
						{
							from: ['core'],
							allow: ['*'],
						},
						{
							from: ['shared'],
							allow: ['shared'],
						},
						{
							from: ['feature'],
							allow: [
								'shared',
								['feature', { featureName: '${from.featureName}' }],
							],
						},
						{
							from: ['routes', 'neverImport', 'trigger'],
							allow: ['shared', 'feature'],
						},
						{
							from: ['routes'],
							allow: [['routes', { fileName: '*.css' }]],
						},
						{
							from: ['tests'],
							allow: ['*'],
						},
						{
							from: ['stories'],
							allow: ['*'],
						},
						{
							from: ['test-file'],
							allow: ['*'],
						},
					],
				},
			],
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		settings: {
			'import/resolver': {
				typescript: {},
			},
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				project: true,
			},
		},
		rules: {
			'@typescript-eslint/await-thenable': 'error',
			'no-return-await': 'error',
		},
	},
]
