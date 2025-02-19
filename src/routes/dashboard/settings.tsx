import { Outlet, createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard/settings')({
	loader: () => {
		return {
			crumb: 'Settings',
		}
	},
	component: () => <Outlet />,
})
