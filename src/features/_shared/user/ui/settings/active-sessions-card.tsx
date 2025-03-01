import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	activeSessionsQueryOptions,
	useSessionRevokeMutation,
} from '@/features/_shared/user/api/auth.api'
import { useQuery } from '@tanstack/react-query'
import { XCircle } from 'lucide-react'
import { useSpinDelay } from 'spin-delay'
import { UAParser } from 'ua-parser-js'
function parseUserAgent(userAgent: string | null | undefined) {
	if (!userAgent) {
		return {
			browser: 'Device',
			device: 'Device',
			raw: 'Device',
		}
	}
	const parser = new UAParser(userAgent)
	const browser = parser.getBrowser()
	const os = parser.getOS()
	const device = parser.getDevice()
	const deviceInfo =
		device.vendor || device.model
			? `${device.vendor || ''} ${device.model || ''}`.trim()
			: os.name
	return {
		browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
		device: deviceInfo || 'Unknown Device',
		raw: userAgent,
	}
}
function SessionRowSkeleton() {
	return (
		<TableRow>
			<TableCell>
				<div className="space-y-2">
					<Skeleton className="h-4 w-[200px]" />
					<Skeleton className="h-3 w-[160px]" />
				</div>
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-[120px]" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-[180px]" />
			</TableCell>
			<TableCell className="text-right">
				<Skeleton className="ml-auto h-8 w-8" />
			</TableCell>
		</TableRow>
	)
}
export function ActiveSessionsCard() {
	const { data: sessions, isLoading } = useQuery(activeSessionsQueryOptions())
	const sessionRevokeMutation = useSessionRevokeMutation()
	const isPending = useSpinDelay(sessionRevokeMutation.isPending)
	return (
		<Card>
			<CardHeader>
				<CardTitle>Active Sessions</CardTitle>
				<CardDescription>
					Manage your active sessions across different devices and browsers
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Device</TableHead>
							<TableHead>IP Address</TableHead>
							<TableHead>Last Active</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<>
								<SessionRowSkeleton />
							</>
						) : (
							sessions?.map((session) => {
								const userAgentInfo = parseUserAgent(session.userAgent)
								return (
									<TableRow key={session.token}>
										<TableCell>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger className="text-left">
														<div>
															<div className="font-medium">
																{userAgentInfo.browser}
															</div>
															<div className="text-sm text-muted-foreground">
																{userAgentInfo.device}
															</div>
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-xs break-all">
															{userAgentInfo.raw}
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>
										<TableCell>{session.ipAddress || '-'}</TableCell>
										<TableCell>
											{new Date(session.updatedAt).toLocaleString()}
										</TableCell>
										<TableCell className="text-right">
											<TooltipProvider>
												<Tooltip delayDuration={50}>
													<TooltipTrigger asChild>
														<LoadingButton
															variant="ghost"
															size="icon"
															className="text-destructive"
															onClick={() =>
																sessionRevokeMutation.mutate({
																	token: session.token,
																})
															}
															disabled={isPending}
															loading={
																isPending &&
																sessionRevokeMutation.variables?.token ===
																	session.token
															}
															Icon={XCircle}
														/>
													</TooltipTrigger>
													<TooltipContent>Revoke Session</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>
									</TableRow>
								)
							})
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
