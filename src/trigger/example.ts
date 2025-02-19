import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'
import { logger, schemaTask } from '@trigger.dev/sdk/v3'
import { z } from 'zod'

const taskSchema = z.object({
	email: z.string(),
	name: z.string(),
})

export const exaxpleTask = schemaTask({
	id: 'example-task-create-user',
	maxDuration: 300,
	schema: taskSchema,
	run: async (payload) => {
		try {
			const newUser = await db
				.insert(UserTable)
				.values({
					id: crypto.randomUUID(),
					name: payload.name,
					email: payload.email,
					emailVerified: false,
				})
				.returning()

			logger.log('New user created', { newUser })
		} catch (err) {
			logger.error('Error creating user', { err })
		}
	},
})
