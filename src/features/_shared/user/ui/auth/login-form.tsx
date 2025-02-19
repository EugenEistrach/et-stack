import { GithubIcon } from '@/components/icons/github-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import PasswordInput from '@/components/ui/password-input'
import {
	useEmailSignInMutation,
	useSocialSignInMutation,
} from '@/features/_shared/user/api/auth.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { DatabaseZap, LockKeyholeOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'

const loginFormSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
})

export function LoginForm() {
	const form = useForm({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})
	const navigate = useNavigate()
	const { redirectTo } = useSearch({
		from: '/_auth/login',
	})
	const { mutate: signIn, isPending: isEmailSignInPending } =
		useEmailSignInMutation()
	const { mutate: signInWithSocial, isPending: isSocialSignInPending } =
		useSocialSignInMutation()
	function onSubmit(values: { email: string; password: string }) {
		void signIn(values, {
			onSuccess: ([expectedError]) => {
				if (expectedError === 'verification_required') {
					void navigate({
						to: '/verify-email',
						search: {
							email: values.email,
						},
					})
				}
			},
			onError: () => {
				form.setError('email', {
					type: 'manual',
					message: 'Invalid email or password',
				})
				form.setError('password', {
					type: 'manual',
					message: 'Invalid email or password',
				})
			},
		})
	}
	const isAnySignInPending = useSpinDelay(
		isEmailSignInPending || isSocialSignInPending,
	)
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
					<DatabaseZap />
				</div>
				<CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-center text-sm">
					<span className="text-muted-foreground">
						{"Don't have an account?"}{' '}
					</span>
					<Link
						to="/register"
						className="text-primary font-medium hover:underline"
					>
						Create Account
					</Link>
				</div>
				<LoadingButton
					variant="outline"
					className="w-full"
					loading={isSocialSignInPending}
					Icon={GithubIcon}
					onClick={async () => {
						signInWithSocial({
							provider: 'github',
							callbackURL: redirectTo ?? '/dashboard',
						})
					}}
				>
					<span className="flex items-center">GitHub</span>
				</LoadingButton>
				<Form {...form}>
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-card text-muted-foreground px-2">
								Or login with email and password
							</span>
						</div>
					</div>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Enter your email"
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{fieldState.error?.type === 'manual'
											? fieldState.error.message
											: 'This field is required'}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field, fieldState }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel>Password</FormLabel>
										<Link
											to="/reset-password"
											className="text-primary text-sm font-medium hover:underline"
										>
											Forgot password?
										</Link>
									</div>
									<FormControl>
										<PasswordInput
											placeholder="Enter your password"
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{fieldState.error?.type === 'manual'
											? fieldState.error.message
											: 'This field is required'}
									</FormMessage>
								</FormItem>
							)}
						/>
						<div className="space-y-4 pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isAnySignInPending}
								Icon={LockKeyholeOpen}
								iconPosition="right"
							>
								Login with Password
							</LoadingButton>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
