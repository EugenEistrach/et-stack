import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { toast } from 'sonner'
import { z } from 'zod'
import { requireAuthSession } from '@/features/_shared/user/domain/auth.server'
import { updateName } from '@/features/_shared/user/domain/settings.server'

export const useUpdateNameMutation = () => {
	const router = useRouter()
	return useMutation({
		mutationFn: (data: { name: string }) => $updateName({ data }),
		onSuccess: async () => {
			await router.invalidate()
			toast.success('Profile updated successfully')
		},
	})
}

const $updateName = createServerFn({
	method: 'POST',
})
	.validator(
		z.object({
			name: z.string().min(1, 'Name is required'),
		}),
	)
	.handler(async ({ data: { name } }) => {
		const { user } = await requireAuthSession()
		await updateName(user.id, name)
		return {
			success: true,
		}
	})
