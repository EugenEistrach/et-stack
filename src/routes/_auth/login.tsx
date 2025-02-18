import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginForm } from '@/features/_shared/user/ui/auth/login-form'

export const Route = createFileRoute('/_auth/login')({
	validateSearch: z.object({
		redirectTo: z.string().optional(),
	}),
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: LoginForm,
})
