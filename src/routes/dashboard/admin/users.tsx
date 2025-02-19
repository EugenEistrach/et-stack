import { UsersList } from '@/features/admin/ui/users-list'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/admin/users')({
	loader: async () => {
		return {
			crumb: 'Users',
		}
	},
	component: UsersList,
})
