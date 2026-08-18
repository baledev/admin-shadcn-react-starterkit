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
import { IconSearch, IconX } from "@tabler/icons-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import {
  DataTable,
  DataTableFacetedFilter,
} from "@workspace/ui/components/data-table"
import {
  type Invoice,
  STATUS_META,
  STATUS_OPTIONS,
} from "@/lib/invoices-data"

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

const columnHelper = createColumnHelper<typeof features, Invoice>()

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Invoice["status"] }) {
  const meta = STATUS_META[status]
  return (
    <Badge variant="outline" className={`ring-1 ${meta.chip}`}>
      {meta.label}
    </Badge>
  )
}

// ─── Currency formatter ───────────────────────────────────────────────────────

const fmtCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

// ─── Column definitions ───────────────────────────────────────────────────────

function buildColumns(onViewDetail: (invoice: Invoice) => void) {
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
            onClick={(event) => event.stopPropagation()}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("id", {
      header: "Invoice",
      cell: ({ row }) => (
        <button
          type="button"
          className="font-mono text-sm font-medium text-primary hover:underline"
          onClick={() => onViewDetail(row.original)}
        >
          {row.original.id}
        </button>
      ),
      enableHiding: false,
    }),
    columnHelper.accessor("customerName", {
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.customerName}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.customerEmail}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("issuedAt", {
      header: "Issue Date",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {row.original.issuedAt}
        </span>
      ),
    }),
    columnHelper.accessor("dueAt", {
      header: "Due Date",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {row.original.dueAt}
        </span>
      ),
    }),
    columnHelper.accessor("total", {
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm tabular-nums">
          {fmtCurrency.format(row.original.total)}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.status)
      },
    }),
  ])
}

const COLUMN_LABELS: Record<string, string> = {
  id: "Invoice",
  customerName: "Customer",
  issuedAt: "Issue Date",
  dueAt: "Due Date",
  total: "Amount",
  status: "Status",
}

// ─── Main component ───────────────────────────────────────────────────────────

interface InvoiceDataTableProps {
  data: Invoice[]
  onViewDetail: (invoice: Invoice) => void
}

export function InvoiceDataTable({ data, onViewDetail }: InvoiceDataTableProps) {
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

  const columns = React.useMemo(
    () => buildColumns(onViewDetail),
    [onViewDetail]
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

  // ── Derived: column-filtered rows, then global search ────────────────────
  const columnFilteredRows = table.getFilteredRowModel().rows

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return columnFilteredRows
    return columnFilteredRows.filter(
      (row) =>
        row.original.id.toLowerCase().includes(q) ||
        row.original.customerName.toLowerCase().includes(q) ||
        row.original.customerEmail.toLowerCase().includes(q)
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
    <DataTable
      table={table}
      rows={pagedRows}
      columnCount={columns.length}
      columnLabels={COLUMN_LABELS}
      emptyMessage="No invoices found."
      toolbar={
        <>
          {/* Global search */}
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPagination((p) => ({ ...p, pageIndex: 0 }))
              }}
              className="h-8 w-64 pl-8"
            />
          </div>

          {/* Faceted filter */}
          <DataTableFacetedFilter
            label="Status"
            options={STATUS_OPTIONS}
            selected={getFacetValues("status")}
            onSelectionChange={(v) => setFacetFilter("status", v)}
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
          className="cursor-pointer"
          onClick={() => onViewDetail(row.original)}
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
  )
}
