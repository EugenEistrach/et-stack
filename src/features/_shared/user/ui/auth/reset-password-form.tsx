import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearch } from '@tanstack/react-router'
import { CheckCircle2, DatabaseZap, KeyRound, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import PasswordInput from '@/components/ui/password-input'
import {
	usePasswordResetMutation,
	usePasswordResetRequestMutation,
} from '@/features/_shared/user/api/auth.api'

function ResetPasswordSuccess() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
					<CheckCircle2 className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Check Your Email
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="text-muted-foreground space-y-4 text-center text-sm">
					<p>
						We've sent password reset instructions to your email address. Please
						check your inbox and follow the instructions to reset your password.
					</p>
					<p className="text-xs">
						If you don't see the email, please check your spam folder.
					</p>
				</div>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">Return to Login</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

const resetPasswordSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
})

const newPasswordSchema = z.object({
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

function NewPasswordForm({ token }: { token: string }) {
	const form = useForm({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: '',
		},
	})
	const {
		mutate: resetPassword,
		isPending,
		isSuccess: isResetPasswordSuccess,
	} = usePasswordResetMutation()
	const isResetPasswordPending = useSpinDelay(isPending)
	async function onSubmit(values: { password: string }) {
		resetPassword({
			token,
			password: values.password,
		})
	}
	if (isResetPasswordSuccess) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
						<CheckCircle2 className="h-6 w-6" />
					</div>
					<CardTitle className="text-center text-2xl font-bold">
						Password Reset Successful
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-muted-foreground text-center text-sm">
						Your password has been successfully reset. You can now log in with
						your new password.
					</p>
					<div className="flex justify-center">
						<Button asChild>
							<Link to="/login">Go to Login</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		)
	}
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
					<KeyRound className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Create New Password
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-muted-foreground text-center text-sm">
					Please enter your new password below.
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder="Create a password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isResetPasswordPending}
								Icon={Send}
							>
								Reset Password
							</LoadingButton>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

export function ResetPasswordForm() {
	const search = useSearch({
		from: '/_auth/reset-password',
	})
	const form = useForm({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	})
	const {
		mutate: requestPasswordReset,
		isPending,
		isSuccess: isRequestPasswordResetSuccess,
	} = usePasswordResetRequestMutation()
	const isRequestPasswordResetPending = useSpinDelay(isPending)
	async function onSubmit(values: { email: string }) {
		requestPasswordReset(values)
	}
	if (search.token) {
		return <NewPasswordForm token={search.token} />
	}
	if (isRequestPasswordResetSuccess) {
		return <ResetPasswordSuccess />
	}
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
					<DatabaseZap className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Reset Password
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-muted-foreground text-center text-sm">
					Enter your email address and we'll send you instructions to reset your
					password.
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Enter your email"
											{...field}
										/>
									</FormControl>
									<FormMessage>Please enter a valid email address</FormMessage>
								</FormItem>
							)}
						/>
						<div className="pt-4">
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isRequestPasswordResetPending}
								Icon={KeyRound}
							>
								Send Reset Instructions
							</LoadingButton>
						</div>
					</form>
				</Form>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">Back to Login</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
