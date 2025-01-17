import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { schema } from './schemas/schema'
import { env } from '@/lib/server/env.server'

const disableEmbeddedDb = process.env['DISABLE_EMBEDDED_DB'] === 'true'

let client =
	env.TURSO_DATABASE_URL && env.TURSO_AUTH_TOKEN
		? disableEmbeddedDb
			? createClient({
					url: env.TURSO_AUTH_TOKEN,
					syncUrl: env.TURSO_DATABASE_URL,
				})
			: createClient({
					url: `file:${env.LOCAL_DATABASE_PATH}`,
					authToken: env.TURSO_AUTH_TOKEN,
					syncUrl: env.TURSO_DATABASE_URL,
					syncInterval: 60,
				})
		: createClient({
				url: `file:${env.LOCAL_DATABASE_PATH}`,
			})

export const db = drizzle(client, { schema })
