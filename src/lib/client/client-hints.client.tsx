import { themeCookie } from '@/lib/server/session.server'
import { getHintUtils } from '@epic-web/client-hints'
import { clientHint as colorSchemeHint } from '@epic-web/client-hints/color-scheme'
import { clientHint as timeZoneHint } from '@epic-web/client-hints/time-zone'
import { createServerFn } from '@tanstack/start'
import { getWebRequest } from '@tanstack/start/server'

const hintsUtils = getHintUtils({
	timeZone: timeZoneHint,
	colorScheme: colorSchemeHint,
})

const { getHints } = hintsUtils

export const $getHintsAndPrefs = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest()

		const selectedTheme = themeCookie.get()

		return {
			hints: getHints(request),
			theme: selectedTheme,
		}
	},
)

export function ClientHintChecker() {
	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: this is needed as we have to inject a client side script
			dangerouslySetInnerHTML={{
				__html: hintsUtils.getClientHintCheckScript(),
			}}
		/>
	)
}
