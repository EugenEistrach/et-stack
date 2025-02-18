import { Link, useSearch } from '@tanstack/react-router';
import { CheckCircle2, MailIcon, RefreshCw } from 'lucide-react';
import { useSpinDelay } from 'spin-delay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { useEmailVerificationMutation } from '@/features/_shared/user/api/auth.api';
function ResendSuccess() {
  return <Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
					<CheckCircle2 className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Email Verification Sent
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4 text-center text-sm text-muted-foreground">
					<p>We've sent a new verification email to your address. Please check your inbox and follow the instructions to verify your email.</p>
					<p className="text-xs">If you don't see the email in your inbox, please check your spam folder.</p>
				</div>
				<div className="flex justify-center">
					<Button asChild variant="link">
						<Link to="/login">Back to Login</Link>
					</Button>
				</div>
			</CardContent>
		</Card>;
}
export function VerificationRequiredCard() {
  const {
    email
  } = useSearch({
    from: '/_auth/verify-email'
  });
  const {
    mutate: resendVerification,
    isPending,
    isSuccess: isResendVerificationSuccess
  } = useEmailVerificationMutation();
  const isResendVerificationPending = useSpinDelay(isPending);
  if (isResendVerificationSuccess) {
    return <ResendSuccess />;
  }
  return <Card className="w-full max-w-md">
			<CardHeader>
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<MailIcon className="h-6 w-6" />
				</div>
				<CardTitle className="text-center text-2xl font-bold">
					Email Verification Required
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					Please verify your email address to continue
				</p>
				<p className="text-center text-sm text-muted-foreground">
					{`We've sent a verification email to ${email}`}
				</p>
				<div className="flex justify-center gap-4">
					<LoadingButton variant="default" onClick={() => resendVerification({
          email
        })} loading={isResendVerificationPending} Icon={RefreshCw}>
						Resend Verification Email
					</LoadingButton>
				</div>
			</CardContent>
		</Card>;
}