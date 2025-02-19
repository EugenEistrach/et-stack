import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'
import { OnboardingInfoTable } from '@/drizzle/schemas/onboarding-schema'
import { env } from '@/lib/server/env.server'
import { eq } from 'drizzle-orm'

export async function getOnboardingInfo(userId: string) {
	return (
		(await db
			.select()
			.from(OnboardingInfoTable)
			.where(eq(OnboardingInfoTable.userId, userId))
			.get()) || null
	)
}

export function completeOnboarding({
	userId,
	favoriteColor,
	name,
}: {
	userId: string
	favoriteColor: string
	name: string
}) {
	return db.transaction(async (tx) => {
		const user = await tx
			.select({
				email: UserTable.email,
			})
			.from(UserTable)
			.where(eq(UserTable.id, userId))
			.get()

		if (!user) {
			throw new Error('User not found')
		}

		await tx
			.update(UserTable)
			.set({
				name,
				role: env.ADMIN_USER_EMAILS?.includes(user?.email ?? '')
					? 'admin'
					: 'user',
			})
			.where(eq(UserTable.id, userId))
			.run()

		await tx
			.insert(OnboardingInfoTable)
			.values({
				userId,
				favoriteColor,
			})
			.run()
	})
}
