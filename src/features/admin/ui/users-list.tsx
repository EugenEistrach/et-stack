import { DataTable } from '@/components/data-table'
import { authClient } from '@/features/_shared/user/api/auth.api'
import { UserActions } from '@/features/admin/ui/user-actions'
import { UserRoleSwitch } from '@/features/admin/ui/user-role-switch'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import type { UserWithRole } from 'better-auth/plugins'
const columns: ColumnDef<UserWithRole>[] = [
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'role',
		header: 'Admin',
		cell: ({ row }) => <UserRoleSwitch user={row.original} />,
	},
	{
		accessorKey: 'banned',
		header: 'Banned',
		cell: ({ row }) => <span>{row.original.banned ? 'Yes' : 'No'}</span>,
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => (
			<span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => <UserActions user={row.original} />,
	},
]
export const listUsersQueryOptions = () =>
	queryOptions({
		queryKey: ['users'],
		queryFn: () =>
			authClient.admin.listUsers({
				query: {
					limit: 100,
					offset: 0,
					sortBy: 'email',
				},
			}),
	})
export function UsersList() {
	const { data, isLoading, isError } = useQuery(listUsersQueryOptions())
	if (isLoading) return <div>Loading...</div>
	if (isError) return <div>An error occurred. Please try again.</div>
	return (
		<div>
			<DataTable columns={columns} data={data?.data?.users || []} />
		</div>
	)
}
