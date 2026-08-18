import * as React from "react"
import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    FlexRender,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table"
import {
    IconDotsVertical,
    IconPencil,
    IconSearch,
    IconTrash,
    IconX,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import {
    TableCell,
    TableRow,
} from "@workspace/ui/components/table"
import {
    DataTable,
    DataTableFacetedFilter,
} from "@workspace/ui/components/data-table"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
    type Customer,
    PLAN_OPTIONS,
    STATUS_OPTIONS,
} from "@/lib/customers-data"
import { PlanBadge, StatusBadge } from "@/components/customer-badges"

// ─── Table features (tree-shaken) ────────────────────────────────────────────
const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Customer>()

// ─── Column definitions ───────────────────────────────────────────────────────
function buildColumns(
    onEdit: (customer: Customer) => void,
    onRequestDelete: (customer: Customer) => void
) {
    return columnHelper.columns([
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={
                            !table.getIsAllPageRowsSelected() &&
                            table.getIsSomePageRowsSelected()
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        }),
        columnHelper.accessor("name", {
            header: "Name",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.name}</div>
            ),
            enableHiding: false,
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.email}</span>
            ),
        }),
        columnHelper.accessor("phone", {
            header: "Phone",
            cell: ({ row }) => (
                <span className="text-muted-foreground">{row.original.phone}</span>
            ),
        }),
        columnHelper.accessor("country", {
            header: "Country",
            cell: ({ row }) => row.original.country,
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
            filterFn: (row, _columnId, filterValue: string[]) => {
                if (!filterValue?.length) return true
                return filterValue.includes(row.original.status)
            },
        }),
        columnHelper.accessor("plan", {
            header: "Plan",
            cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
            filterFn: (row, _columnId, filterValue: string[]) => {
                if (!filterValue?.length) return true
                return filterValue.includes(row.original.plan)
            },
        }),
        columnHelper.accessor("joinedAt", {
            header: "Joined",
            cell: ({ row }) =>
                new Date(row.original.joinedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
        }),
        columnHelper.accessor("totalSpend", {
            header: () => <div className="text-right">Total Spend</div>,
            cell: ({ row }) => (
                <div className="text-right font-mono text-sm">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(row.original.totalSpend)}
                </div>
            ),
        }),
        columnHelper.display({
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                                size="icon"
                            />
                        }
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>
                            <IconPencil className="mr-2 size-4" aria-hidden="true" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onRequestDelete(row.original)}
                        >
                            <IconTrash className="mr-2 size-4" aria-hidden="true" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }),
    ])
}

const COLUMN_LABELS: Record<string, string> = {
    totalSpend: "Total Spend",
    joinedAt: "Joined",
    phone: "Phone",
    country: "Country",
    status: "Status",
    plan: "Plan",
    email: "Email",
}

// ─── Main component ───────────────────────────────────────────────────────────
interface CustomerDataTableProps {
    data: Customer[]
    onEdit: (customer: Customer) => void
    onDelete: (customer: Customer) => void
}

export function CustomerDataTable({
    data,
    onEdit,
    onDelete,
}: CustomerDataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<ColumnVisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [search, setSearch] = React.useState("")
    const [pendingDelete, setPendingDelete] = React.useState<Customer | null>(
        null
    )

    const columns = React.useMemo(
        () => buildColumns(onEdit, setPendingDelete),
        [onEdit]
    )

    const table = useTable({
        features,
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
    })

    // ── Derived: column-filtered rows, then global search ────────────────────
    const columnFilteredRows = table.getFilteredRowModel().rows

    const filteredRows = React.useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return columnFilteredRows
        return columnFilteredRows.filter(
            (row) =>
                row.original.name.toLowerCase().includes(q) ||
                row.original.email.toLowerCase().includes(q) ||
                row.original.country.toLowerCase().includes(q)
        )
    }, [search, columnFilteredRows])

    // ── Paginated slice ───────────────────────────────────────────────────────
    const { pageIndex, pageSize } = pagination
    const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
    const pagedRows = filteredRows.slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize
    )

    const hasActiveFilters = search.trim() !== "" || columnFilters.length > 0

    function resetAllFilters() {
        setSearch("")
        setColumnFilters([])
        setPagination((p) => ({ ...p, pageIndex: 0 }))
    }

    function getFacetValues(columnId: string): string[] {
        const filterValue = columnFilters.find((f) => f.id === columnId)?.value
        return Array.isArray(filterValue) ? (filterValue as string[]) : []
    }

    function setFacetFilter(columnId: string, values: string[]) {
        setColumnFilters((prev) => {
            const without = prev.filter((f) => f.id !== columnId)
            if (values.length === 0) return without
            return [...without, { id: columnId, value: values }]
        })
        setPagination((p) => ({ ...p, pageIndex: 0 }))
    }

    const selectedCount = filteredRows.filter((r) => r.getIsSelected()).length

    return (
        <>
            <DataTable
                table={table}
                rows={pagedRows}
                columnCount={columns.length}
                columnLabels={COLUMN_LABELS}
                emptyMessage="No customers found."
                toolbar={
                    <>
                        {/* Global search */}
                        <div className="relative">
                            <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPagination((p) => ({ ...p, pageIndex: 0 }))
                                }}
                                className="h-8 w-64 pl-8"
                            />
                        </div>

                        {/* Faceted filters */}
                        <DataTableFacetedFilter
                            label="Status"
                            options={STATUS_OPTIONS}
                            selected={getFacetValues("status")}
                            onSelectionChange={(v) => setFacetFilter("status", v)}
                        />
                        <DataTableFacetedFilter
                            label="Plan"
                            options={PLAN_OPTIONS}
                            selected={getFacetValues("plan")}
                            onSelectionChange={(v) => setFacetFilter("plan", v)}
                        />

                        {/* Reset */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-muted-foreground"
                                onClick={resetAllFilters}
                            >
                                Reset
                                <IconX className="ml-1 size-3.5" />
                            </Button>
                        )}
                    </>
                }
                renderRow={(row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                <FlexRender cell={cell} />
                            </TableCell>
                        ))}
                    </TableRow>
                )}
                pagination={{
                    pageIndex,
                    pageCount,
                    pageSize,
                    selectedCount,
                    totalCount: filteredRows.length,
                    onPageChange: (index) =>
                        setPagination((p) => ({ ...p, pageIndex: index })),
                    onPageSizeChange: (size) =>
                        setPagination({ pageIndex: 0, pageSize: size }),
                }}
            />
            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingDelete(null)
                }}
                title="Delete customer?"
                description={
                    <>
                        <span className="font-medium text-foreground">
                            {pendingDelete?.name}
                        </span>{" "}
                        and their account history will be permanently removed.
                        This action cannot be undone.
                    </>
                }
                confirmLabel="Delete"
                onConfirm={() => {
                    if (pendingDelete) onDelete(pendingDelete)
                    setPendingDelete(null)
                }}
            />
        </>
    )
}
