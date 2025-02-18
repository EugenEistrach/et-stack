import { type QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router'
import filePondCss from 'filepond/dist/filepond.min.css?url'
import * as React from 'react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { $getSession } from '@/features/_shared/user/api/auth.api'
import {
	$getHintsAndPrefs,
	ClientHintChecker,
} from '@/lib/client/client-hints.client'

import { ThemeProvider } from '@/lib/client/theme.client'
import { TimezoneContext } from '@/lib/client/timezone.client'
import appCss from '@/styles/globals.css?url'

const TanStackRouterDevtools =
	process.env['NODE_ENV'] === 'production'
		? () => null // Render nothing in production
		: React.lazy(() =>
				// Lazy load in development
				import('@tanstack/router-devtools').then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			)

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	beforeLoad: async () => {
		const [auth, hintsAndPrefs] = await Promise.all([
			$getSession(),
			$getHintsAndPrefs(),
		])
		const { hints, theme: selectedTheme } = hintsAndPrefs
		if (!auth) {
			return {
				auth: null,
				hints,
				theme: selectedTheme ?? hints.colorScheme,
			}
		}
		return {
			auth,
			hints,
			theme: selectedTheme ?? hints.colorScheme,
		}
	},
	loader: async ({ context }) => {
		return {
			auth: context.auth,
			hints: context.hints,
			theme: context.theme,
		}
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'et-stack',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
			{
				rel: 'stylesheet',
				href: filePondCss,
			},
			{
				rel: 'icon',
				type: 'image/x-icon',
				href: '/favicon.ico',
			},
			{
				rel: 'icon',
				type: 'image/svg+xml',
				href: '/favicon.svg',
			},

			// {
			// 	rel: 'preload',
			// 	href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap',
			// 	as: 'style',
			// },
			// {
			// 	rel: 'stylesheet',
			// 	href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap',
			// },
		],
	}),
	component: RootComponent,
})
function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}
function RootDocument({ children }: { children: React.ReactNode }) {
	const { hints, theme } = Route.useLoaderData()

	return (
		<html className="font-sans">
			<head>
				<HeadContent />
			</head>
			<body className={theme}>
				<ClientHintChecker />
				<ThemeProvider theme={theme}>
					<TimezoneContext.Provider value={hints.timeZone}>
						<TooltipProvider>
							<div>{children}</div>
							<Toaster />
						</TooltipProvider>
					</TimezoneContext.Provider>
				</ThemeProvider>
				<TanStackRouterDevtools position="bottom-right" />
				<ReactQueryDevtools buttonPosition="bottom-right" />
				<Scripts />
			</body>
		</html>
	)
}
