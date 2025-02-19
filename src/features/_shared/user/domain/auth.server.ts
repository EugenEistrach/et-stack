import { db } from '@/drizzle/db'
import { AccountTable, UserTable } from '@/drizzle/schemas/auth-schema'
import type { OnboardingInfoTable } from '@/drizzle/schemas/onboarding-schema'
import { getOnboardingInfo } from '@/features/_shared/user/domain/onboarding.server'
import { ForgotPasswordEmail } from '@/features/_shared/user/emails/forgot-password.email'
import { VerificationEmail } from '@/features/_shared/user/emails/verification.email'
import { sendEmail } from '@/lib/server/email.server'
import { env } from '@/lib/server/env.server'
import { redirect } from '@tanstack/react-router'
import { getWebRequest } from '@tanstack/start/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { and, eq } from 'drizzle-orm'

export type OnboardingInfo = typeof OnboardingInfoTable.$inferSelect
const github =
	env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
		? {
				clientId: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
			}
		: undefined
export const authServer = betterAuth({
	baseURL: env.APPLICATION_URL,
	secret: env.SESSION_SECRET,
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		maxPasswordLength: 128,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Reset your password',
				react: ForgotPasswordEmail({
					resetLink: url,
					userEmail: user.email,
				}),
			})
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Verify Your Email',
				react: VerificationEmail({
					verificationLink: url.replace(
						'callbackURL=/',
						'callbackURL=/verification-success',
					),
					userEmail: user.email,
				}),
			})
		},
	},
	socialProviders: {
		...(github && {
			github,
		}),
	},
	plugins: [admin(), organization()],
	user: {
		additionalFields: {
			hasAccess: {
				type: 'boolean',
				default: false,
			},
		},
	},
})
export const getSession = async () => {
	try {
		const request = getWebRequest()
		if (!request) {
			throw new Error('Request not found')
		}
		const session = await authServer.api.getSession({
			headers: request.headers,
		})
		if (!session || !session.user) {
			return null
		}
		const hasAccess = env.ENABLE_ADMIN_APPROVAL
			? session.user.role === 'admin' || session.user.hasAccess
			: true
		const onboardingInfo = await getOnboardingInfo(session.user.id)
		const hasPassword = await userHasPassword(session.user.id)
		return {
			...session,
			user: {
				...session.user,
				hasAccess,
				onboardingInfo,
				hasPassword,
			},
		}
	} catch (error) {
		console.error(error)
		return null
	}
}
export const requireAuthSession = async (server = authServer) => {
	const request = getWebRequest()
	if (!request) {
		throw new Error('Request not found')
	}
	const auth = await server.api.getSession({
		headers: request.headers,
	})
	const redirectToPath = new URL(request.url).pathname
	if (!auth) {
		throw redirect({
			to: '/login',
			search: {
				redirectTo: redirectToPath,
			},
		})
	}
	return auth
}
export const requireAdminSession = async (server = authServer) => {
	const auth = await requireAuthSession(server)
	if (auth.user.role !== 'admin') {
		throw new Error('Unauthorized')
	}
}
export async function requireApiKey(request: Request) {
	if (!env.API_KEY) {
		throw new Error('API key not set')
	}
	const apiKey = request.headers.get('Authorization')
	if (!apiKey) {
		throw new Error('Unauthorized')
	}
	if (apiKey !== env.API_KEY) {
		throw new Error('Unauthorized')
	}
}
export const requireAuthSessionApi = async (server = authServer) => {
	const request = getWebRequest()
	if (!request) {
		throw new Error('Request not found')
	}
	const auth = await server.api.getSession({
		headers: request.headers,
	})
	if (!auth) {
		throw new Response('Unauthorized', {
			status: 401,
		})
	}
	return auth
}
export async function isEmailAvailable(email: string) {
	const user = await db.query.user.findFirst({
		where: eq(UserTable.email, email),
	})
	return !user
}
export async function userHasPassword(userId: string) {
	const account = await db.query.account.findFirst({
		where: and(
			eq(AccountTable.userId, userId),
			eq(AccountTable.providerId, 'credential'),
		),
	})
	return !!account
}
export async function setUserPassword({
	newPassword,
}: {
	newPassword: string
}) {
	const request = getWebRequest()
	if (!request) {
		throw new Error('Request not found')
	}
	const auth = await requireAuthSessionApi(authServer)
	const hasPassword = await userHasPassword(auth.user.id)
	if (hasPassword) {
		throw new Error('User already has a password. Can not set a new one.')
	}
	return authServer.api.setPassword({
		headers: request.headers,
		body: {
			newPassword,
		},
	})
}
