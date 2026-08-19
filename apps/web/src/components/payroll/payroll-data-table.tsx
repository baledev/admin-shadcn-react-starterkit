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
  IconEye,
  IconCheck,
  IconBan,
  IconSearch,
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
import { TableCell, TableRow } from "@workspace/ui/components/table"
import {
  DataTable,
  DataTableFacetedFilter,
} from "@workspace/ui/components/data-table"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { ROLE_META } from "@/lib/team-data"
import {
  formatRupiah,
  STATUS_META,
  STATUS_OPTIONS,
  type EmployeePayrollSummary,
} from "@/lib/payroll-data"

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

const columnHelper = createColumnHelper<
  typeof features,
  EmployeePayrollSummary
>()

function buildColumns(
  onViewDetails: (summary: EmployeePayrollSummary) => void,
  onMarkPaid: (summary: EmployeePayrollSummary) => void,
  onRequestCancel: (summary: EmployeePayrollSummary) => void
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
    columnHelper.accessor("employeeName", {
      header: "Employee",
      cell: ({ row }) => {
        const initials = row.original.employeeName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
        const roleInfo = ROLE_META[row.original.role]

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={row.original.avatarUrl}
                alt={row.original.employeeName}
              />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {row.original.employeeName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {roleInfo?.label || row.original.role}
              </span>
            </div>
          </div>
        )
      },
      enableHiding: false,
    }),
    columnHelper.accessor("workDays", {
      header: "Days Worked",
      cell: ({ row }) => (
        <span className="font-medium text-foreground tabular-nums">
          {row.original.workDays} days
        </span>
      ),
    }),
    columnHelper.accessor("regularHours", {
      header: "Reg. Hours",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {row.original.regularHours} hrs
        </span>
      ),
    }),
    columnHelper.accessor("overtimeHours", {
      header: "OT Hours",
      cell: ({ row }) => (
        <span
          className={`text-xs tabular-nums ${row.original.overtimeHours > 0 ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
        >
          {row.original.overtimeHours > 0
            ? `+${row.original.overtimeHours}`
            : "0"}{" "}
          hrs
        </span>
      ),
    }),
    columnHelper.accessor("baseSalary", {
      header: "Base Salary",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatRupiah(row.original.baseSalary)}
        </span>
      ),
    }),
    columnHelper.accessor("overtimePay", {
      header: "OT Pay",
      cell: ({ row }) => (
        <span
          className={`text-xs tabular-nums ${row.original.overtimePay > 0 ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
        >
          {row.original.overtimePay > 0
            ? `+${formatRupiah(row.original.overtimePay)}`
            : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("deductions", {
      header: "Deductions",
      cell: ({ row }) => (
        <span
          className={`text-xs tabular-nums ${row.original.deductions > 0 ? "font-medium text-destructive" : "text-muted-foreground"}`}
        >
          {row.original.deductions > 0
            ? `-${formatRupiah(row.original.deductions)}`
            : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("netPay", {
      header: () => <div className="text-right">Net Salary</div>,
      cell: ({ row }) => (
        <div className="text-right text-sm font-semibold text-foreground tabular-nums">
          {formatRupiah(row.original.netPay)}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const meta = STATUS_META[row.original.status]
        return (
          <Badge variant="outline" className={`px-2 py-0.5 ${meta.chip}`}>
            {meta.label}
          </Badge>
        )
      },
      filterFn: (row, columnId, filterValue) => {
        if (
          !filterValue ||
          (Array.isArray(filterValue) && filterValue.length === 0)
        ) {
          return true
        }
        const val = row.getValue(columnId) as string
        if (Array.isArray(filterValue)) {
          return filterValue.includes(val)
        }
        return filterValue === val
      },
    }),
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original
        const isProcessable =
          item.status === "draft" || item.status === "processing"
        const isCancellable = item.status !== "cancelled"

        return (
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onViewDetails(item)}>
                <IconEye className="mr-2 size-4" aria-hidden="true" />
                View Details
              </DropdownMenuItem>

              {isProcessable && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onMarkPaid(item)}>
                    <IconCheck
                      className="mr-2 size-4 text-emerald-600"
                      aria-hidden="true"
                    />
                    Mark as Paid
                  </DropdownMenuItem>
                </>
              )}

              {isCancellable && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onRequestCancel(item)}
                  >
                    <IconBan className="mr-2 size-4" aria-hidden="true" />
                    Cancel Payroll
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }),
  ])
}

const COLUMN_LABELS: Record<string, string> = {
  employeeName: "Employee",
  workDays: "Days Worked",
  regularHours: "Regular Hours",
  overtimeHours: "Overtime Hours",
  baseSalary: "Base Salary",
  overtimePay: "Overtime Pay",
  deductions: "Deductions",
  netPay: "Net Salary",
  status: "Status",
}

interface PayrollDataTableProps {
  data: EmployeePayrollSummary[]
  onViewDetails: (summary: EmployeePayrollSummary) => void
  onMarkPaid: (summary: EmployeePayrollSummary) => void
  onCancel: (summary: EmployeePayrollSummary) => void
}

export function PayrollDataTable({
  data,
  onViewDetails,
  onMarkPaid,
  onCancel,
}: PayrollDataTableProps) {
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
  const [pendingCancel, setPendingCancel] =
    React.useState<EmployeePayrollSummary | null>(null)
  const [pendingMarkPaid, setPendingMarkPaid] =
    React.useState<EmployeePayrollSummary | null>(null)

  const columns = React.useMemo(
    () => buildColumns(onViewDetails, setPendingMarkPaid, setPendingCancel),
    [onViewDetails]
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
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  })

  const columnFilteredRows = table.getFilteredRowModel().rows

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return columnFilteredRows
    return columnFilteredRows.filter(
      (row) =>
        row.original.employeeName.toLowerCase().includes(q) ||
        row.original.role.toLowerCase().includes(q)
    )
  }, [search, columnFilteredRows])

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
        emptyMessage="No payroll summaries found."
        toolbar={
          <>
            <div className="relative">
              <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPagination((p) => ({ ...p, pageIndex: 0 }))
                }}
                className="h-8 w-64 pl-8"
              />
            </div>

            <DataTableFacetedFilter
              label="Status"
              options={STATUS_OPTIONS}
              selected={getFacetValues("status")}
              onSelectionChange={(v) => setFacetFilter("status", v)}
            />

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
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
        open={pendingCancel !== null}
        onOpenChange={(open) => {
          if (!open) setPendingCancel(null)
        }}
        title="Cancel payroll summary?"
        description={
          <>
            Payroll calculations for{" "}
            <span className="font-medium text-foreground">
              {pendingCancel?.employeeName}
            </span>{" "}
            for period{" "}
            <span className="font-semibold">{pendingCancel?.period}</span> will
            be cancelled. This action cannot be undone.
          </>
        }
        confirmLabel="Cancel Payroll"
        variant="destructive"
        onConfirm={() => {
          if (pendingCancel) onCancel(pendingCancel)
          setPendingCancel(null)
        }}
      />

      <ConfirmDialog
        open={pendingMarkPaid !== null}
        onOpenChange={(open) => {
          if (!open) setPendingMarkPaid(null)
        }}
        title="Mark payroll as paid?"
        variant="default"
        description={
          <>
            Payroll for{" "}
            <span className="font-medium text-foreground">
              {pendingMarkPaid?.employeeName}
            </span>{" "}
            for period{" "}
            <span className="font-semibold">{pendingMarkPaid?.period}</span>{" "}
            will be marked as Paid. This action cannot be undone.
          </>
        }
        confirmLabel="Mark as Paid"
        onConfirm={() => {
          if (pendingMarkPaid) onMarkPaid(pendingMarkPaid)
          setPendingMarkPaid(null)
        }}
      />
    </>
  )
}
