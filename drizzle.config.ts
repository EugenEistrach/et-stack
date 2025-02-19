import { env } from '@/lib/server/env.server'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'sqlite',
	out: './src/drizzle/migrations',
	schema: ['./src/drizzle/schemas/_exports.ts'],
	dbCredentials: {
		url: env.LOCAL_DATABASE_PATH,
	},
	breakpoints: true,
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true,
})
