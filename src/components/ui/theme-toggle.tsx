'use client'

import { subscribeToSchemeChange } from '@epic-web/client-hints/color-scheme'

import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import z from 'zod'

import { themeCookie } from '@/lib/server/session.server'
import { cn } from '@/lib/utils'

const $setTheme = createServerFn({ method: 'POST' })
	.validator(
		z.object({
			theme: z.union([z.literal('light'), z.literal('dark'), z.undefined()]),
		}),
	)
	.handler(async ({ data: { theme } }) => {
		themeCookie.set(theme)
	})

export function ThemeToggle({ className }: { className?: string }) {
	const router = useRouter()

	useEffect(() => subscribeToSchemeChange(() => router.invalidate()), [router])

	const setTheme = async (theme: 'light' | 'dark' | undefined) => {
		await $setTheme({ data: { theme } })
		await router.invalidate()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={cn(className)}>
					<Sun className="h-4 w-4" />
					<Moon className="absolute h-4 w-4" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme(undefined)}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
