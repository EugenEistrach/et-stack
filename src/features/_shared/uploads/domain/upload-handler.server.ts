import { AcceptedFileTypes } from '@/features/_shared/uploads/constants'
import { SQLiteFileStorage } from '@/features/_shared/uploads/domain/file-storage.server'
import type { authServer } from '@/features/_shared/user/domain/auth.server'
import { logger } from '@/lib/server/logger.server'
import { type FileUpload, parseFormData } from '@mjackson/form-data-parser'

type Auth = Awaited<ReturnType<typeof authServer.api.getSession>>

export async function handleFileUpload(
	request: Request,
	auth: NonNullable<Auth>,
) {
	const storage = new SQLiteFileStorage(auth.user.id)

	try {
		let key: string | undefined

		await parseFormData(request, async (fileUpload: FileUpload) => {
			key = storage.generateKey()
			const file = new File([await fileUpload.arrayBuffer()], fileUpload.name, {
				type: fileUpload.type,
				lastModified: Date.now(),
			})

			if (!AcceptedFileTypes.includes(file.type)) {
				throw new Error('File type not accepted')
			}

			await storage.set(key, file)
			return file
		})

		if (!key) {
			throw new Error('No file uploaded')
		}

		return key
	} catch (err) {
		logger.error(
			{ err, operation: 'handleFileUpload' },
			'Failed to handle file upload',
		)

		throw err
	}
}

export async function handleFileDelete(
	fileId: string,
	auth: NonNullable<Auth>,
) {
	const storage = new SQLiteFileStorage(auth.user.id)

	try {
		await storage.remove(fileId)
	} catch (err) {
		logger.error(
			{ err, operation: 'handleFileDelete', fileId },
			'Failed to delete file',
		)

		throw err
	}
}
