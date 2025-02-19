'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface DatePickerProps {
	date?: Date
	onSelect?: (date: Date | undefined) => void
	className?: string
}

export function DatePicker({ date, onSelect, className }: DatePickerProps) {
	const [open, setOpen] = React.useState(false)

	const handleSelect = (selectedDate: Date | undefined) => {
		onSelect?.(selectedDate)
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: shadcn has his reasons
					role="combobox"
					aria-expanded={open}
					tabIndex={0}
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, 'PPP') : 'Pick a date'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleSelect}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
