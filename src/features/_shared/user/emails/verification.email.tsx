import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components'
interface VerificationEmailProps {
	verificationLink: string
	userEmail?: string
}
const main = {
	backgroundColor: '#ffffff',
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}
const container = {
	margin: '0 auto',
	padding: '32px 16px',
	maxWidth: '42.5rem',
}
const heading = {
	fontSize: '24px',
	fontWeight: '600',
	textAlign: 'center' as const,
	margin: '16px 0',
	color: '#18181B',
}
const text = {
	fontSize: '16px',
	lineHeight: '24px',
	color: '#4B5563',
	margin: '16px 0',
}
const button = {
	backgroundColor: 'hsl(222.2 47.4% 11.2%)',
	borderRadius: '6px',
	color: '#fff',
	fontSize: '16px',
	fontWeight: '500',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'inline-block',
	padding: '12px 24px',
}
const anchor = {
	color: '#2563EB',
	textDecoration: 'underline',
}
const footer = {
	fontSize: '12px',
	color: '#9CA3AF',
	textAlign: 'center' as const,
	margin: '16px 0',
}
export const VerificationEmail = ({
	verificationLink,
	userEmail,
}: VerificationEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Verify Your Email</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>Email Verification</Heading>
					<Text style={text}>
						{userEmail
							? `Please verify your email address for ${userEmail}.`
							: 'Please verify your email address.'}{' '}
						Click the button below to verify your email address.
					</Text>
					<Section
						style={{
							textAlign: 'center',
							margin: '32px 0',
						}}
					>
						<Button style={button} href={verificationLink}>
							Verify Email
						</Button>
					</Section>
					<Text
						style={{
							...text,
							fontSize: '14px',
						}}
					>
						If you did not create an account, please ignore this email.
					</Text>
					<Hr
						style={{
							margin: '16px 0',
							border: 'none',
							borderTop: '1px solid #E5E7EB',
						}}
					/>
					<Text style={footer}>
						{'Or copy and paste this URL into your browser:'}{' '}
						<Link style={anchor} href={verificationLink}>
							{verificationLink}
						</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	)
}
