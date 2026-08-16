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
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconLayoutColumns,
    IconPlus,
    IconSearch,
    IconX,
} from "@tabler/icons-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import {
    type Customer,
    PLAN_OPTIONS,
    STATUS_OPTIONS,
} from "@/lib/customers-data"

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

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Customer["status"] }) {
    const styles: Record<Customer["status"], string> = {
        active: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
        inactive:
            "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
        pending:
            "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
    }
    return (
        <Badge variant="outline" className={`capitalize ${styles[status]}`}>
            {status}
        </Badge>
    )
}

// ─── Plan badge ───────────────────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: Customer["plan"] }) {
    const styles: Record<Customer["plan"], string> = {
        free: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
        pro: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
        enterprise:
            "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400",
    }
    return (
        <Badge variant="outline" className={`capitalize ${styles[plan]}`}>
            {plan}
        </Badge>
    )
}

// ─── Column definitions ───────────────────────────────────────────────────────
const columns = columnHelper.columns([
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
        cell: () => (
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
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    }),
])

// ─── Faceted filter component ─────────────────────────────────────────────────
type FacetedFilterOption = { label: string; value: string }

function FacetedFilter({
    label,
    options,
    selected,
    onSelectionChange,
}: {
    label: string
    options: FacetedFilterOption[]
    selected: string[]
    onSelectionChange: (values: string[]) => void
}) {
    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onSelectionChange(selected.filter((v) => v !== value))
        } else {
            onSelectionChange([...selected, value])
        }
    }

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed" />
                }
            >
                <IconPlus className="size-3.5" />
                {label}
                {selected.length > 0 && (
                    <>
                        <Separator orientation="vertical" className="mx-0.5 h-4" />
                        <span className="flex items-center gap-1">
                            {selected.length > 1 ? (
                                <Badge variant="secondary" className="rounded-sm px-1 text-xs font-normal">
                                    {selected.length} selected
                                </Badge>
                            ) : (
                                options
                                    .filter((o) => selected.includes(o.value))
                                    .map((o) => (
                                        <Badge
                                            key={o.value}
                                            variant="secondary"
                                            className="rounded-sm px-1 text-xs font-normal"
                                        >
                                            {o.label}
                                        </Badge>
                                    ))
                            )}
                        </span>
                    </>
                )}
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-44 p-0"
            >
                <div className="border-b px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </div>
                <div className="p-1">
                    {options.map((option) => {
                        const checked = selected.includes(option.value)
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => toggle(option.value)}
                                className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm capitalize transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                            >
                                <div
                                    className={`flex size-4 shrink-0 items-center justify-center rounded-sm border ${
                                        checked
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-input"
                                    }`}
                                >
                                    {checked && (
                                        <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                {option.label}
                            </button>
                        )
                    })}
                </div>
                {selected.length > 0 && (
                    <>
                        <div className="border-t p-1">
                            <button
                                type="button"
                                onClick={() => onSelectionChange([])}
                                className="flex w-full cursor-default items-center justify-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
                            >
                                Clear filters
                            </button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CustomerDataTable({ data }: { data: Customer[] }) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<ColumnVisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [search, setSearch] = React.useState("")

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
        // Global search via name/email/country column filter override
        filterFns: {},
    })

    // ── Derived filtered rows (search + column filters applied together) ───────
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

    // ── Paginated view from filteredRows ──────────────────────────────────────
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

    return (
        <div className="flex flex-col gap-4">
            {/* ── Toolbar ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: search + faceted filters */}
                <div className="flex flex-wrap items-center gap-2">
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

                    {/* Status faceted filter */}
                    <FacetedFilter
                        label="Status"
                        options={STATUS_OPTIONS}
                        selected={getFacetValues("status")}
                        onSelectionChange={(v) => setFacetFilter("status", v)}
                    />

                    {/* Plan faceted filter */}
                    <FacetedFilter
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
                </div>

                {/* Right: column visibility */}
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8" />}>
                            <IconLayoutColumns className="size-4" />
                            <span className="hidden lg:inline">Columns</span>
                            <IconChevronDown className="size-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuGroup>
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (col) =>
                                            typeof col.accessorFn !== "undefined" && col.getCanHide()
                                    )
                                    .map((col) => (
                                        <DropdownMenuCheckboxItem
                                            key={col.id}
                                            className="capitalize"
                                            checked={col.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                col.toggleVisibility(!!value)
                                            }
                                        >
                                            {col.id === "totalSpend"
                                                ? "Total Spend"
                                                : col.id === "joinedAt"
                                                  ? "Joined"
                                                  : col.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {pagedRows.length ? (
                            pagedRows.map((row) => (
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex items-center justify-between px-1">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {filteredRows.filter((r) => r.getIsSelected()).length} of{" "}
                    {filteredRows.length} row(s) selected.
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={`${pageSize}`}
                            onValueChange={(value) => {
                                setPagination({ pageIndex: 0, pageSize: Number(value) })
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 50].map((ps) => (
                                    <SelectItem key={ps} value={`${ps}`}>
                                        {ps}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {pageIndex + 1} of {pageCount}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
                            disabled={pageIndex === 0}
                        >
                            <span className="sr-only">Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
                            disabled={pageIndex === 0}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
                            disabled={pageIndex >= pageCount - 1}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => setPagination((p) => ({ ...p, pageIndex: pageCount - 1 }))}
                            disabled={pageIndex >= pageCount - 1}
                        >
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
