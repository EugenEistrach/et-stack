import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NavLink } from '@/components/ui/nav-link'
import { Separator } from '@/components/ui/separator'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { $logout, useAuth } from '@/features/_shared/user/api/auth.api'
import { AdminOnly } from '@/features/_shared/user/ui/admin-only'
import { sidebarOpenCookie } from '@/lib/server/session.server'
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import {
	Box,
	ChevronsUpDown,
	HomeIcon,
	LogOut,
	Settings,
	UploadIcon,
	UsersIcon,
} from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
const $getSidebarState = createServerFn({
	method: 'GET',
}).handler(async () => {
	return sidebarOpenCookie.get() ?? true
})
const $setSidebarState = createServerFn({
	method: 'POST',
})
	.validator(
		z.object({
			state: z.boolean(),
		}),
	)
	.handler(async ({ data: { state } }) => {
		sidebarOpenCookie.set(state)
	})
export const Route = createFileRoute('/dashboard')({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: location.pathname,
				},
			})
		}
		if (!context.auth.user.hasAccess) {
			throw redirect({
				to: '/approval-needed',
			})
		}
		const [sidebarOpen] = await Promise.all([$getSidebarState()])
		if (!context.auth.user.onboardingInfo) {
			throw redirect({
				to: '/onboarding',
				search: {
					redirectTo: location.pathname,
				},
			})
		}
		return {
			defaultSidebarOpen: sidebarOpen,
		}
	},
	loader: async ({ context }) => {
		return {
			defaultSidebarOpen: context.defaultSidebarOpen,
		}
	},
	component: DashboardLayout,
})
export default function DashboardLayout() {
	const { defaultSidebarOpen } = Route.useLoaderData()
	const [sidebarOpen, _setSidebarOpen] = useState(defaultSidebarOpen)
	const setSidebarOpen = async (state: boolean) => {
		_setSidebarOpen(state)
		await $setSidebarState({
			data: {
				state,
			},
		})
	}
	return (
		<SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Box className="size-4 transition-all group-hover:scale-110" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">et-stack</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Main</SidebarGroupLabel>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip="Dashboard" asChild>
									<NavLink
										to="/dashboard"
										activeOptions={{
											exact: true,
										}}
									>
										<HomeIcon />
										<span>Dashboard</span>
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
					<AdminOnly>
						<SidebarGroup>
							<SidebarGroupLabel>Admin</SidebarGroupLabel>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Users" asChild>
										<NavLink to="/dashboard/admin/users">
											<UsersIcon />
											<span>Users</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip="Uploads" asChild>
										<NavLink to="/dashboard/admin/uploads">
											<UploadIcon />
											<span>Uploads</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroup>
					</AdminOnly>
				</SidebarContent>
				<SidebarFooter>
					<UserMenu />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumbs />
					</div>
				</header>
				<main className="flex flex-1 flex-col p-4 sm:p-6">
					<Outlet />
				</main>
				<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
					<p className="text-xs text-muted-foreground">
						{`© ${new Date().getFullYear()} ${'Company Name'}. All rights reserved.`}
					</p>
					<nav className="mr-4 flex items-center gap-4 sm:ml-auto sm:mr-6 sm:gap-6">
						<Link to="/" className="text-xs underline-offset-4 hover:underline">
							Home
						</Link>
						<Link
							className="text-xs underline-offset-4 hover:underline"
							to="/terms"
						>
							Terms of Service
						</Link>
						<Link
							className="text-xs underline-offset-4 hover:underline"
							to="/privacy"
						>
							Privacy Policy
						</Link>
					</nav>
					<ThemeToggle />
				</footer>
			</SidebarInset>
		</SidebarProvider>
	)
}
function UserMenu() {
	const { isMobile } = useSidebar()
	const { user } = useAuth()
	const name = user.name || user.email.split('@')[0] || ''
	const email = user.email
	const image = user.image ?? ''
	const shortName = name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
	const logout = useServerFn($logout)
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							data-testid="user-menu-trigger"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={image} alt={name} />
								<AvatarFallback className="rounded-lg">
									{shortName}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{name}</span>
								<span className="truncate text-xs">{email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={image} alt={name} />
									<AvatarFallback className="rounded-lg">
										{shortName}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{name}</span>
									<span className="truncate text-xs">{email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link to="/dashboard/settings">
									<Settings />
									Settings
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								void logout()
							}}
						>
							<LogOut />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
