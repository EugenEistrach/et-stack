import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import PasswordInput from '@/components/ui/password-input'
import { usePasswordSetRequestMutation } from '@/features/_shared/user/api/auth.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'

const setPasswordSchema = z.object({
	newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

export function SetPasswordForm() {
	const form = useForm({
		resolver: zodResolver(setPasswordSchema),
		defaultValues: {
			newPassword: '',
		},
	})
	const passwordSetMutation = usePasswordSetRequestMutation()
	const isPending = useSpinDelay(passwordSetMutation.isPending)

	function onSubmit(values: z.infer<typeof setPasswordSchema>) {
		passwordSetMutation.mutate(values)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create Password</CardTitle>
				<CardDescription>
					Set up a password to protect your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id="set-password-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<PasswordInput {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="bg-muted/50 flex justify-end pt-6">
				<LoadingButton
					type="submit"
					form="set-password-form"
					disabled={form.formState.isValidating || isPending}
					loading={isPending}
					Icon={Save}
				>
					Set Password
				</LoadingButton>
			</CardFooter>
		</Card>
	)
}
