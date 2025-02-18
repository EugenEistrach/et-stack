import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { CirclePlus, DatabaseZap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'
import { GithubIcon } from '@/components/icons/github-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import PasswordInput, { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import {
	useEmailSignUpMutation,
	useSocialSignInMutation,
	EmailNotAvailableError,
} from '@/features/_shared/user/api/auth.api'

const registerFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

export function RegisterForm() {
	const form = useForm({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})
	const { mutate: signUp, isPending: isEmailSignUpPending } =
		useEmailSignUpMutation()
	const { mutate: signInWithSocial, isPending: isSocialSignInPending } =
		useSocialSignInMutation()

	function onSubmit(values: { name: string; email: string; password: string }) {
		void signUp(values, {
			onSuccess: ([expectedError]) => {
				if (expectedError === EmailNotAvailableError) {
					form.setError('email', {
						type: EmailNotAvailableError,
					})
				}
			},
		})
	}
	const isAnySignInPending = useSpinDelay(
		isEmailSignUpPending || isSocialSignInPending,
	)
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex flex-col items-center justify-center gap-2">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<DatabaseZap />
					</div>
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Create an Account
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-center text-sm">
					<span className="text-muted-foreground">
						{'Already have an account?'}{' '}
					</span>
					<Link
						to="/login"
						className="font-medium text-primary hover:underline"
					>
						Sign in
					</Link>
				</div>
				<LoadingButton
					variant="outline"
					className="w-full"
					loading={isAnySignInPending}
					Icon={GithubIcon}
					onClick={async () => {
						signInWithSocial({
							provider: 'github',
							callbackURL: '/dashboard',
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
							<span className="bg-card px-2 text-muted-foreground">
								Or create an account with email
							</span>
						</div>
					</div>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						noValidate
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter your full name" {...field} />
									</FormControl>
									<FormMessage>This field is required</FormMessage>
								</FormItem>
							)}
						/>
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
										{fieldState.error?.type === EmailNotAvailableError
											? 'This email is already in use'
											: 'Please enter a valid email address'}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder="Create a password" {...field} />
									</FormControl>
									<FormMessage>
										{`Must be at least ${8} characters`}
									</FormMessage>
								</FormItem>
							)}
						/>
						<div className="pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isAnySignInPending}
								Icon={CirclePlus}
								iconPosition="right"
							>
								<span className="flex items-center">Create Account</span>
							</LoadingButton>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
