import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { useAuth } from '@/features/_shared/user/api/auth.api'
import { useUpdateNameMutation } from '@/features/_shared/user/api/settings.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'

const personalInfoSchema = z.object({
	name: z.string().min(1, 'Name is required'),
})

export function PersonalInformationForm() {
	const { user } = useAuth()
	const form = useForm({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			name: user.name || '',
		},
	})
	const updateNameMutation = useUpdateNameMutation()
	const isPending = useSpinDelay(updateNameMutation.isPending)

	function onSubmit({ name }: { name: string }) {
		updateNameMutation.mutate({
			name,
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
				<CardDescription>
					Manage your profile details and public information
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id="personal-information-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="space-y-1">
							<FormLabel>Avatar</FormLabel>
							<div className="flex items-center gap-4">
								<Avatar className="h-9 w-9">
									<AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
									<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
								</Avatar>
								{/* TODO: Add avatar upload */}
								{/* <LoadingButton variant="outline" size="sm" loading={false}>
         			{m.proud_neat_swan_float()}
         		</LoadingButton> */}
							</div>
						</div>
						<div className="space-y-1">
							<FormLabel>Email</FormLabel>
							<Input value={user.email} disabled />
						</div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>What's your name?</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-end bg-muted/50 pt-6">
				<LoadingButton
					form="personal-information-form"
					type="submit"
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
