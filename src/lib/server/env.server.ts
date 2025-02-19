import { z } from 'zod'

// Schema definition
export const environmentSchema = z.object({
	CI: z
		.string()
		.min(1)
		.transform((val) => val === 'true')
		.optional(),
	MOCKS: z
		.string()
		.min(1)
		.transform((val) => val === 'true')
		.optional(),
	NODE_ENV: z.string().min(1).optional(),
	APPLICATION_URL: z.string().min(1),
	TURSO_DATABASE_URL: z.string().optional(),
	TURSO_AUTH_TOKEN: z.string().optional(),
	LOCAL_DATABASE_PATH: z.string().default('db.sqlite'),
	GITHUB_CLIENT_ID: z.string().min(1).optional(),
	GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
	SESSION_SECRET: z.string().min(1),
	RESEND_API_KEY: z.string().min(1).optional(),
	EMAIL_FROM: z.string().min(1).optional(),
	ADMIN_USER_EMAILS: z
		.string()
		.min(1)
		.transform((val) => val.split(',').map((s) => s.trim()))
		.pipe(z.array(z.string().email()))
		.optional(),
	API_KEY: z.string().min(1).optional(),
	ENABLE_ADMIN_APPROVAL: z
		.string()
		.min(1)
		.transform((val) => val === 'true')
		.optional(),
	LOG_LEVEL: z.string().min(1).default('info'),
})

// Type inference
export type Env = z.infer<typeof environmentSchema>

const parseEnv = () => {
	const result = environmentSchema.safeParse(process.env)

	if (!result.success) {
		throw new Error(
			`🚨 Invalid environment variables.\n ${result.error.toString()}`,
		)
	}

	return result.data
}

// Cache for parsed env
let parsedEnv: Env | null = null

export const env = new Proxy({} as Env, {
	get(_target, prop) {
		if (typeof window !== 'undefined') {
			throw new Error(
				'❌ Attempted to access server-side environment variable on the client',
			)
		}

		// Lazy parse env if not already parsed
		if (!parsedEnv) {
			parsedEnv = parseEnv()
		}

		return Reflect.get(parsedEnv, prop)
	},
})
