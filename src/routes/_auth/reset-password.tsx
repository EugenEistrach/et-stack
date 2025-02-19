import { ResetPasswordForm } from '@/features/_shared/user/ui/auth/reset-password-form'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/reset-password')({
	validateSearch: z.object({
		token: z.string().optional(),
	}),
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: ResetPasswordForm,
})
