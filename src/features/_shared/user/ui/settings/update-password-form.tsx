import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { LoadingButton } from '@/components/ui/loading-button'
import PasswordInput from '@/components/ui/password-input'
import { usePasswordUpdateMutation } from '@/features/_shared/user/api/auth.api'

const updatePasswordSchema = z.object({
	currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
	newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

export function UpdatePasswordForm() {
	const form = useForm({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
		},
	})
	const passwordUpdateMutation = usePasswordUpdateMutation()
	const isPending = useSpinDelay(passwordUpdateMutation.isPending)

	function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
		passwordUpdateMutation.mutate(values)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>
					Update your existing password to a new one
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id="update-password-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<PasswordInput {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
					form="update-password-form"
					disabled={form.formState.isValidating || isPending}
					loading={isPending}
					Icon={Save}
				>
					Save Changes
				</LoadingButton>
			</CardFooter>
		</Card>
	)
}
