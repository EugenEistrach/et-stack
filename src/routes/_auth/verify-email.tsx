import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { VerificationRequiredCard } from '@/features/_shared/user/ui/auth/verification-required-card'

export const Route = createFileRoute('/_auth/verify-email')({
	validateSearch: z.object({
		email: z.string().email('Invalid email format'),
	}),
	component: VerificationRequiredCard,
})
