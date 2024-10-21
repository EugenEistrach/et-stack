import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
	beforeLoad: () => {
		return {
			crumb: 'Settings',
		}
	},
	component: () => <Outlet />,
})
