import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

export default function PasswordInput({
	className,
	wrapperClassName,
	...props
}: Omit<React.ComponentProps<'input'>, 'type'> & {
	wrapperClassName?: string
}) {
	const [isVisible, setIsVisible] = React.useState<boolean>(false)

	const toggleVisibility = () => setIsVisible((prevState) => !prevState)

	return (
		<div className={cn('relative', wrapperClassName)}>
			<Input
				className={cn(className, 'pe-9')}
				type={isVisible ? 'text' : 'password'}
				{...props}
			/>
			<button
				className="text-muted-foreground/80 hover:text-foreground focus-visible:outline-ring/70 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors focus:z-10 focus-visible:outline-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
				type="button"
				onClick={toggleVisibility}
				aria-label={isVisible ? 'Hide password' : 'Show password'}
				aria-pressed={isVisible}
				aria-controls="password"
			>
				{isVisible ? (
					<EyeOff size={16} strokeWidth={2} aria-hidden="true" />
				) : (
					<Eye size={16} strokeWidth={2} aria-hidden="true" />
				)}
			</button>
		</div>
	)
}
