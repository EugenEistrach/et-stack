import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from '@tanstack/start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	vite: {
		define: {
			'process.env.MOCKS': JSON.stringify(process.env.MOCKS),
			'process.env.CI': JSON.stringify(process.env.CI),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		},
		plugins: [
			viteTsConfigPaths({
				projects: ['./tsconfig.json'],
				// biome-ignore lint/suspicious/noExplicitAny: vite plugin type compatibility
			}) as any,
			tailwindcss(),
		],
	},
	server: {
		preset: 'node-server',
		esbuild: {
			options: {
				target: 'ES2022',
			},
		},
	},
	routers: {
		ssr: {
			entry: './src/entry.server.tsx',
		},
		client: {
			entry: './src/entry.client.tsx',
		},
		api: {
			entry: './src/entry.api.ts',
		},
	},
	tsr: {
		appDirectory: './src/',
		routesDirectory: './src/routes/',
		generatedRouteTree: './src/routeTree.gen.ts',
	},
})
