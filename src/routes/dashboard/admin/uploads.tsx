import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/dashboard/admin/uploads')({
  loader: () => ({
    crumb: "Uploads"
  }),
  component: UploadsPage
});
function UploadsPage() {
  return <div className="mx-auto max-w-2xl">
			<h2 className="mb-4 text-2xl font-bold">File Upload</h2>

		</div>;
}