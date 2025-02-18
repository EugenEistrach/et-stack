import { zodResolver } from '@hookform/resolvers/zod'
import { useSearch } from '@tanstack/react-router'
import { CircleArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSpinDelay } from 'spin-delay'
import { z } from 'zod'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { useAuth } from '@/features/_shared/user/api/auth.api'
import { useCompleteOnboardingMutation } from '@/features/_shared/user/api/onboarding.api'

const onboardingFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	favoriteColor: z.string().min(1, 'Favorite color is required'),
	redirectTo: z.string().optional(),
})

export function OnboardingForm() {
	const auth = useAuth()
	const { redirectTo } = useSearch({
		from: '/_auth/onboarding',
	})
	const form = useForm({
		resolver: zodResolver(onboardingFormSchema),
		defaultValues: {
			name: auth.user.name,
			favoriteColor: '',
			redirectTo,
		},
	})
	const completeOnboardingMutation = useCompleteOnboardingMutation()
	const isPending = useSpinDelay(completeOnboardingMutation.isPending)
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-center text-2xl font-bold">
					Welcome Onboard!
				</CardTitle>
				<CardDescription className="text-center">
					Let's get to know you better
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) => {
						void completeOnboardingMutation.mutateAsync({
							data: values,
						})
					})}
					className="space-y-8"
				>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>What's your name?</FormLabel>
									<FormControl>
										<Input placeholder="Enter your name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="favoriteColor"
							render={({ field }) => (
								<FormItem>
									<FormLabel>What's your favorite color?</FormLabel>
									<FormControl>
										<Input placeholder="Enter your favorite color" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<CardFooter>
							<LoadingButton
								type="submit"
								className="w-full"
								loading={isPending}
								Icon={CircleArrowRight}
								iconPosition="right"
							>
								Complete Onboarding
							</LoadingButton>
						</CardFooter>
					</CardContent>
				</form>
			</Form>
		</Card>
	)
}
