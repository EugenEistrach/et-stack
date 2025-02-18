import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import { FilePond, registerPlugin } from 'react-filepond'

registerPlugin(FilePondPluginFileValidateSize)

interface FileUploadProps {
	name: string
	onChange?: (fileId: string | null) => void
	className?: string
	maxFileSize?: string
	allowMultiple?: boolean
}

export function FileUpload({
	name,
	onChange,
	className,
	maxFileSize = '2MB',
	allowMultiple = false,
}: FileUploadProps) {
	return (
		<div className={className}>
			<FilePond
				name={name}
				allowMultiple={allowMultiple}
				maxFileSize={maxFileSize}
				server="/api/upload"
				credits={false}
				className="w-96"
				onprocessfile={(error, file) => {
					if (!error && file.serverId) {
						onChange?.(file.serverId)
					}
				}}
				onremovefile={() => onChange?.(null)}
				labelIdle="Drop files here or click to select"
			/>
		</div>
	)
}
