import { ClockIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/features/_shared/user/api/auth.api'

export function ApprovalRequiredCard() {
	const { user } = useAuth()
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
					<ClockIcon className="h-6 w-6 text-yellow-600" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Approval Required
				</CardTitle>
				<CardDescription className="text-center">
					Your account is pending administrator approval
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4 text-center">
				<p className="text-sm text-muted-foreground">
					{`Hello ${user.name || user.email}! Your account has been created successfully, but requires administrator approval before you can access the application. Please check back later or contact your administrator.`}
				</p>
				<div className="flex justify-center gap-4">
					<Button variant="outline" onClick={() => window.location.reload()}>
						<RefreshCwIcon className="mr-2 h-4 w-4" />
						Check Again
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
