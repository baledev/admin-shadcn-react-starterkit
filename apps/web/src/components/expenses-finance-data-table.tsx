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
import { IconSearch, IconEye, IconX } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import {
  DataTable,
  DataTableFacetedFilter,
} from "@workspace/ui/components/data-table"
import {
  type Expense,
  EXPENSE_STATUS_META,
  EXPENSE_CATEGORY_META,
  EXPENSE_STATUS_OPTIONS,
  EXPENSE_CATEGORY_OPTIONS,
} from "@/lib/expenses-finance-data"
import { formatRupiah } from "@/lib/accounts-data"

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

const columnHelper = createColumnHelper<typeof features, Expense>()

function buildColumns(
  onViewDetail: (expense: Expense) => void,
  onApproveExpense?: (expense: Expense) => void,
  onReimburseExpense?: (expense: Expense) => void
) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: "ID Klaim",
      cell: ({ row }) => (
        <button
          type="button"
          className="font-mono text-sm font-semibold text-primary hover:underline"
          onClick={() => onViewDetail(row.original)}
        >
          {row.original.id}
        </button>
      ),
      enableHiding: false,
    }),
    columnHelper.accessor("employeeName", {
      header: "Karyawan",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {row.original.employeeName}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.employeeEmail}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Kategori",
      cell: ({ row }) => {
        const catMeta = EXPENSE_CATEGORY_META[row.original.category]
        return (
          <span className="text-xs font-semibold text-foreground/80">
            {catMeta.label}
          </span>
        )
      },
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.category)
      },
    }),
    columnHelper.accessor("date", {
      header: "Tanggal",
      cell: ({ row }) => (
        <span className="font-mono text-sm tabular-nums">
          {row.original.date}
        </span>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Keterangan",
      cell: ({ row }) => (
        <span
          className="block max-w-[200px] truncate"
          title={row.original.description}
        >
          {row.original.description}
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: () => <div className="text-right">Jumlah</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm font-semibold tabular-nums">
          {formatRupiah(row.original.amount)}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const statusMeta = EXPENSE_STATUS_META[row.original.status]
        return (
          <Badge variant="outline" className={`ring-1 ${statusMeta.chip}`}>
            {statusMeta.label}
          </Badge>
        )
      },
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.status)
      },
    }),
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const exp = row.original
        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onViewDetail(exp)}
              title="Lihat Detail"
            >
              <IconEye className="size-4" />
            </Button>
            {exp.status === "submitted" && onApproveExpense && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-violet-200 text-xs font-semibold text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300"
                onClick={() => onApproveExpense(exp)}
              >
                Setujui
              </Button>
            )}
            {exp.status === "approved" && onReimburseExpense && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-emerald-200 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
                onClick={() => onReimburseExpense(exp)}
              >
                Bayar
              </Button>
            )}
          </div>
        )
      },
    }),
  ])
}

const COLUMN_LABELS: Record<string, string> = {
  id: "ID Klaim",
  employeeName: "Karyawan",
  category: "Kategori",
  date: "Tanggal",
  description: "Keterangan",
  amount: "Jumlah",
  status: "Status",
}

interface ExpensesFinanceDataTableProps {
  data: Expense[]
  onViewDetail: (expense: Expense) => void
  onApproveExpense?: (expense: Expense) => void
  onReimburseExpense?: (expense: Expense) => void
}

export function ExpensesFinanceDataTable({
  data,
  onViewDetail,
  onApproveExpense,
  onReimburseExpense,
}: ExpensesFinanceDataTableProps) {
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

  const columns = React.useMemo(
    () => buildColumns(onViewDetail, onApproveExpense, onReimburseExpense),
    [onViewDetail, onApproveExpense, onReimburseExpense]
  )

  const table = useTable({
    features,
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: false,
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
        row.original.id.toLowerCase().includes(q) ||
        row.original.employeeName.toLowerCase().includes(q) ||
        row.original.description.toLowerCase().includes(q)
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

  return (
    <DataTable
      table={table}
      rows={pagedRows}
      columnCount={columns.length}
      columnLabels={COLUMN_LABELS}
      emptyMessage="Tidak ada klaim expense ditemukan."
      toolbar={
        <>
          <div className="relative">
            <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari ID expense, karyawan, keterangan..."
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
            options={EXPENSE_STATUS_OPTIONS}
            selected={getFacetValues("status")}
            onSelectionChange={(v) => setFacetFilter("status", v)}
          />

          <DataTableFacetedFilter
            label="Kategori"
            options={EXPENSE_CATEGORY_OPTIONS}
            selected={getFacetValues("category")}
            onSelectionChange={(v) => setFacetFilter("category", v)}
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
        selectedCount: 0,
        totalCount: filteredRows.length,
        onPageChange: (index) =>
          setPagination((p) => ({ ...p, pageIndex: index })),
        onPageSizeChange: (size) =>
          setPagination({ pageIndex: 0, pageSize: size }),
      }}
    />
  )
}
