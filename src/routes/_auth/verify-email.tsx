import { VerificationRequiredCard } from '@/features/_shared/user/ui/auth/verification-required-card'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/verify-email')({
	validateSearch: z.object({
		email: z.string().email('Invalid email format'),
	}),
	component: VerificationRequiredCard,
})
