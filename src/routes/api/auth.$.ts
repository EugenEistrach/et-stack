import { authServer } from '@/features/_shared/user/domain/auth.server'
import { createAPIFileRoute } from '@tanstack/start/api'

export const APIRoute = createAPIFileRoute('/api/auth/$')({
	GET: async ({ request }) => {
		return authServer.handler(request)
	},
	POST: async ({ request }) => {
		return authServer.handler(request)
	},
})
