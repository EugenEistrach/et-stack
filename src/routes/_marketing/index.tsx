import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useOptionalAuth } from '@/features/_shared/user/api/auth.api'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check } from 'lucide-react'
export const Route = createFileRoute('/_marketing/')({
	component: LandingPage,
})
function LandingPage() {
	const auth = useOptionalAuth()
	return (
		<>
			<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
								Boost Your Productivity
							</h1>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								Streamline your workflow with our powerful tools
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user ? 'Go to App' : 'Get Started'}
								</Link>
							</Button>
							<Button variant="outline">Learn More</Button>
						</div>
					</div>
				</div>
			</section>
			<section
				id="features"
				className="w-full bg-secondary py-12 text-secondary-foreground md:py-24 lg:py-32"
			>
				<div className="container px-4 md:px-6">
					<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
						Features
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card>
							<CardHeader>
								<CardTitle>Tanstack Ecosystem</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Leverage Tanstack Start, Router, and Query for a seamless
									development experience
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Modern UI</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Beautiful, responsive designs with Shadcn UI and Tailwind CSS,
									including Light & Dark mode
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Advanced Authentication</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									SSO with GitHub and Discord, RBAC, and simple onboarding flow
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Robust Data Management</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									SQLite database with Drizzle ORM for efficient data handling
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Background Processing</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Cron jobs & background tasks with BullMQ for enhanced
									performance
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
						Pricing
					</h2>
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>Starter</CardTitle>
								<CardDescription>Perfect for small projects</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">$9/month</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Up to 5 users
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Basic analytics
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										24/7 support
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">Choose Plan</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>Pro</CardTitle>
								<CardDescription>For growing businesses</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">$29/month</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Up to 20 users
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Advanced analytics
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Priority support
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Custom integrations
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">Choose Plan</Button>
							</CardFooter>
						</Card>
						<Card className="flex flex-col">
							<CardHeader>
								<CardTitle>Enterprise</CardTitle>
								<CardDescription>For large-scale operations</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-4xl font-bold">Custom pricing</p>
								<ul className="mt-4 space-y-2">
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Unlimited users
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Full analytics suite
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										24/7 premium support
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Custom development
									</li>
									<li className="flex items-center">
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Dedicated account manager
									</li>
								</ul>
							</CardContent>
							<CardFooter>
								<Button className="w-full">Choose Plan</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</section>
			<section className="w-full bg-secondary py-12 text-secondary-foreground md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Ready to get started?
							</h2>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								Sign up now and boost your productivity
							</p>
						</div>
						<div className="space-x-4">
							<Button asChild>
								<Link to={auth?.user ? '/dashboard' : '/login'}>
									{auth?.user ? 'Go to App' : 'Get Started'}
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
