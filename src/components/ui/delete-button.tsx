import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Loader2, X } from 'lucide-react'
import * as React from 'react'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface DeleteButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	onConfirm: () => void | Promise<void>
	isLoading?: boolean
}

export function DeleteButton({
	onConfirm,
	isLoading,
	className,
	...props
}: DeleteButtonProps) {
	const [isPending, startTransition] = React.useTransition()
	const [showConfirm, setShowConfirm] = React.useState(false)
	const [isGroupHovered, setIsGroupHovered] = React.useState(false)
	const timeoutRef = React.useRef<number | undefined>(undefined)
	const buttonRef = React.useRef<HTMLButtonElement>(null)

	// Reset confirmation state after delay
	const resetConfirmation = React.useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		timeoutRef.current = window.setTimeout(() => {
			setShowConfirm(false)
		}, 3000) // Reset after 3 seconds
	}, [])

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent event bubbling
		e.preventDefault()

		if (!showConfirm) {
			setShowConfirm(true)
			resetConfirmation()
			return
		}

		// Clear timeout since we're confirming
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		startTransition(() => {
			void onConfirm()
		})
	}

	// Track when the parent group is hovered
	React.useEffect(() => {
		const button = buttonRef.current
		if (!button) return

		const parent = button.closest('.group')
		if (!parent) return

		const handleMouseEnter = () => setIsGroupHovered(true)
		const handleMouseLeave = () => {
			setIsGroupHovered(false)
			setShowConfirm(false) // Also reset confirm state when group is no longer hovered
		}

		parent.addEventListener('mouseenter', handleMouseEnter)
		parent.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			parent.removeEventListener('mouseenter', handleMouseEnter)
			parent.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [])

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip open={showConfirm && isGroupHovered}>
				<TooltipTrigger asChild>
					<button
						ref={buttonRef}
						type="button"
						className={cn(
							'text-muted-foreground hover:bg-background/20 inline-flex h-5 w-5 items-center justify-center rounded-sm p-0.5 opacity-0 outline-hidden transition-all group-hover:opacity-100 focus-visible:opacity-100',
							showConfirm && 'text-destructive hover:text-destructive',
							className,
						)}
						onClick={handleClick}
						disabled={isLoading || isPending}
						{...props}
					>
						{isLoading || isPending ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : (
							<X className="h-3 w-3" />
						)}
					</button>
				</TooltipTrigger>

				<TooltipContent
					side="right"
					align="center"
					className="animate-in fade-in-0 zoom-in-95 flex"
				>
					<p className="text-xs">Click again to confirm</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
