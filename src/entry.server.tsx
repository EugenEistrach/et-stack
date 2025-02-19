/// <reference types="vinxi/types/server" />

import { getRouterManifest } from '@tanstack/start/router-manifest'
import {
	createStartHandler,
	defaultStreamHandler,
} from '@tanstack/start/server'
import { migrate } from 'drizzle-orm/libsql/migrator'

import { env } from '@/lib/server/env.server'
import { db } from './drizzle/db'
import { createRouter } from './router'

import { logger } from '@/lib/server/logger.server'

import '@/lib/server/middleware.server'

if (env.MOCKS) {
	logger.info('Loading mock data for development')
	await import('./tests/mocks/setupMsw')
}

// migrate db
try {
	logger.info('Starting database migration')
	await migrate(db, {
		migrationsFolder: './src/drizzle/migrations',
	})

	logger.info('Database migration completed successfully')
} catch (err) {
	logger.error({ operation: 'dbMigration', err }, 'Database migration failed')
	throw err
}

const handler = createStartHandler({
	createRouter,
	getRouterManifest,
})(defaultStreamHandler)

logger.info('Server handler initialized successfully')

export default handler
