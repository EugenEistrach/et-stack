import * as authSchema from './auth-schema'
import * as filesSchema from './files-schema'
import * as onboardingSchema from './onboarding-schema'

export const schema = {
	user: authSchema.UserTable,
	session: authSchema.SessionTable,
	account: authSchema.AccountTable,
	verification: authSchema.VerificationTable,
	organization: authSchema.OrganizationTable,
	member: authSchema.MemberTable,
	invitation: authSchema.InvitationTable,

	onboardingInfo: onboardingSchema.OnboardingInfoTable,
	file: filesSchema.FileTable,
} as const
