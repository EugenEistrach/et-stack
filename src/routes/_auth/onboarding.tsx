import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { OnboardingForm } from '@/features/_shared/user/ui/auth/onboarding-form.fullstack'

export const Route = createFileRoute('/_auth/onboarding')({
	validateSearch: z.object({
		redirectTo: z.string().optional(),
	}),
	beforeLoad: async ({ context, search }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: search.redirectTo,
				},
			})
		}

		if (!context.auth.user.hasAccess) {
			throw redirect({
				to: '/approval-needed',
			})
		}

		if (context.auth.user.onboardingInfo) {
			throw redirect({
				to: search.redirectTo || '/dashboard',
			})
		}
	},
	component: OnboardingForm,
})
