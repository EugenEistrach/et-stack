import { Link } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function VerificationSuccessCard() {
  return <Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
					<CheckCircle2 className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Email Verified Successfully
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<p className="text-center text-sm text-muted-foreground">
					Your email has been verified successfully. You can now log in to your account.
				</p>
				<div className="flex justify-center">
					<Button asChild>
						<Link to="/login">Go to Login</Link>
					</Button>
				</div>
			</CardContent>
		</Card>;
}