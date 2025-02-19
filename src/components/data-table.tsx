import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Table as UITable,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
	type ColumnDef,
	type Table,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	rowClassName?: (row: { original: TData }) => string
}
function PaginationControl<TData>({ table }: { table: Table<TData> }) {
	const currentPage = table.getState().pagination.pageIndex
	const totalPages = table.getPageCount()
	if (totalPages <= 1) return null
	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded-md border border-transparent',
					'hover:border-border hover:bg-accent',
					'disabled:pointer-events-none disabled:opacity-50',
				)}
			>
				<span className="sr-only">Previous</span>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<Select
				value={currentPage.toString()}
				onValueChange={(value) => {
					table.setPageIndex(Number(value))
				}}
			>
				<SelectTrigger className="h-8 w-[70px]">
					<SelectValue>{currentPage + 1}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{Array.from(
						{
							length: totalPages,
						},
						(_, i) => (
							<SelectItem key={`page-${i + 1}`} value={i.toString()}>
								{`Page ${(i + 1).toString()}`}
							</SelectItem>
						),
					)}
				</SelectContent>
			</Select>

			<div className="text-muted-foreground text-sm">{`of ${totalPages.toString()}`}</div>

			<button
				type="button"
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded-md border border-transparent',
					'hover:border-border hover:bg-accent',
					'disabled:pointer-events-none disabled:opacity-50',
				)}
			>
				<span className="sr-only">Next</span>
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	)
}
export function DataTable<TData, TValue>({
	columns,
	data,
	rowClassName,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 50,
			},
		},
	})
	const { pageSize, pageIndex } = table.getState().pagination
	return (
		<div>
			<div className="rounded-md border">
				<UITable>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className={rowClassName?.(row)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</UITable>
			</div>
			<div className="flex items-center justify-between py-4">
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<div className="flex items-center gap-1">
						<span>Entries per page</span>
						<Select
							value={pageSize.toString()}
							onValueChange={(value) => {
								table.setPageSize(Number(value))
							}}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue placeholder={pageSize.toString()} />
							</SelectTrigger>
							<SelectContent side="top">
								{[25, 50, 100, 200].map((size) => (
									<SelectItem key={size} value={size.toString()}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						{`${(pageIndex * pageSize + 1).toString()} to ${Math.min((pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length).toString()} of ${table.getFilteredRowModel().rows.length.toString()} entries`}
					</div>
				</div>
				<PaginationControl table={table} />
			</div>
		</div>
	)
}
