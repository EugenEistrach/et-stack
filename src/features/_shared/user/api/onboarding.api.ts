import { useMutation } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { z } from 'zod'
import { requireAuthSession } from '@/features/_shared/user/domain/auth.server'
import { completeOnboarding } from '@/features/_shared/user/domain/onboarding.server'

export const useCompleteOnboardingMutation = () => {
	return useMutation({
		mutationFn: useServerFn($completeOnboarding),
	})
}

const $completeOnboarding = createServerFn({ method: 'POST' })
	.validator(
		z.object({
			name: z.string().min(1, 'Name is required'),
			favoriteColor: z.string().min(1, 'Favorite color is required'),
			redirectTo: z.string().optional(),
		}),
	)
	.handler(async ({ data: { name, favoriteColor, redirectTo } }) => {
		const { user } = await requireAuthSession()

		await completeOnboarding({
			userId: user.id,
			name,
			favoriteColor,
		})

		throw redirect({
			to: redirectTo || '/dashboard',
		})
	})
