'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { X } from 'lucide-react'
import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'

type Option = {
	label: string
	value: string
}

interface ComboboxProps {
	value: string[]
	onChange: (value: string[]) => void
	onSearch?: (search: string) => void
	options: Option[]
	creatable?: boolean
	className?: string
}

export function Combobox({
	value,
	onChange,
	onSearch,
	options,
	creatable = false,
	className,
}: ComboboxProps) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [open, setOpen] = React.useState(false)
	const [inputValue, setInputValue] = React.useState('')

	const handleUnselect = (item: string) => {
		onChange(value.filter((i) => i !== item))
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current
		if (input) {
			if (e.key === 'Delete' || e.key === 'Backspace') {
				if (input.value === '' && value.length > 0) {
					handleUnselect(value[value.length - 1] as string)
				}
			}
			if (e.key === 'Enter' && creatable && inputValue) {
				e.preventDefault()
				if (!value.includes(inputValue)) {
					onChange([...value, inputValue])
					setInputValue('')
				}
			}
		}
	}

	const handleSelect = (item: string) => {
		setInputValue('')
		if (!value.includes(item)) {
			onChange([...value, item])
		}
	}

	return (
		<Command
			onKeyDown={handleKeyDown}
			className={cn('overflow-visible bg-transparent', className)}
		>
			<div className="group border-input ring-offset-background focus-within:ring-ring rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
				<div className="flex flex-wrap gap-1">
					{value.map((item) => (
						<Badge
							key={item}
							variant="secondary"
							className="hover:bg-secondary rounded"
						>
							{item}
							<button
								className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-hidden focus:ring-2 focus:ring-offset-2"
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleUnselect(item)
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault()
									e.stopPropagation()
								}}
								onClick={() => handleUnselect(item)}
							>
								<X className="text-muted-foreground hover:text-foreground h-3 w-3" />
							</button>
						</Badge>
					))}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={(value) => {
							setInputValue(value)
							onSearch?.(value)
						}}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder="Select items..."
						className="placeholder:text-muted-foreground flex-1 bg-transparent outline-hidden"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{open && (
					<div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-hidden">
						<CommandGroup className="h-full overflow-auto">
							{options.map((option) => (
								<CommandItem
									key={option.value}
									onSelect={() => handleSelect(option.value)}
								>
									{option.label}
								</CommandItem>
							))}
							{creatable &&
								inputValue &&
								!options.some((opt) => opt.value === inputValue) && (
									<CommandItem onSelect={() => handleSelect(inputValue)}>
										Create "{inputValue}"
									</CommandItem>
								)}
						</CommandGroup>
					</div>
				)}
			</div>
		</Command>
	)
}
