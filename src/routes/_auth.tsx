import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
	component: AuthLayout,
})

function AuthLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex flex-1 items-center justify-center bg-linear-to-br from-primary/20 to-secondary/20">
				<Outlet />
			</main>
			<footer className="absolute bottom-0 right-0 p-4">
				<div className="flex items-center gap-2">
					<ThemeToggle />
				</div>
			</footer>
		</div>
	)
}
