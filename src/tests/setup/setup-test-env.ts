import './db-setup'
import { vi, afterEach, beforeEach, type MockInstance } from 'vitest'

import { server } from '@/tests/mocks/setupMsw'

const mockDb = vi.hoisted(async () => {
	const mod = await import('./test-db.js')
	return { db: mod.testDb }
})

vi.mock('@/drizzle/db', () => mockDb)

vi.mock('@/lib/server/env.server', async (importOriginal) => {
	const mod =
		// eslint-disable-next-line @typescript-eslint/consistent-type-imports
		(await importOriginal()) as typeof import('@/lib/server/env.server')

	// Get all keys from the schema shape
	const envKeys = Object.keys(mod.environmentSchema.shape)

	// Create initial mock object with all current values
	const initialMock = envKeys.reduce(
		(acc, key) => {
			acc[key] = mod.env[key as keyof typeof mod.env]
			return acc
		},
		{} as Record<string, any>,
	)

	return {
		...mod,
		env: initialMock,
	}
})

vi.mock('@/lib/server/auth.server', async (importOriginal) => ({
	...(await importOriginal()),
	requireAuthSession: vi.fn(),
}))

afterEach(() => server.resetHandlers())

export let consoleError: MockInstance<(typeof console)['error']>

beforeEach(() => {
	const originalConsoleError = console.error
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(
		(...args: Parameters<typeof console.error>) => {
			originalConsoleError(...args)
			throw new Error(
				'Console error was called. Call consoleError.mockImplementation(() => {}) if this is expected.',
			)
		},
	)
})
