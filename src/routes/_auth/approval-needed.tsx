import { ApprovalRequiredCard } from '@/features/_shared/user/ui/auth/approval-required-card'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/approval-needed')({
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
			})
		}

		if (context.auth.user.hasAccess) {
			throw redirect({
				to: '/dashboard',
			})
		}
	},
	component: ApprovalRequiredCard,
})
