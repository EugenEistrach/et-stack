import { cuid } from '@/lib/utils'
import { sql } from 'drizzle-orm'
import { customType, text } from 'drizzle-orm/sqlite-core'

export const dateString = customType<{
	data: string
	driverData: number
}>({
	dataType() {
		return 'integer'
	},
	toDriver(value: string): number {
		return new Date(value).getTime()
	},
	fromDriver(value: number): string {
		return new Date(value).toISOString()
	},
})

export const dateTableFields = {
	createdAt: dateString().notNull().default(sql`(strftime('%s', 'now'))`),
	updatedAt: dateString()
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
		.$onUpdate(() => new Date().toISOString()),
}

export const textId = () =>
	text('id')
		.primaryKey()
		.$defaultFn(() => cuid())
