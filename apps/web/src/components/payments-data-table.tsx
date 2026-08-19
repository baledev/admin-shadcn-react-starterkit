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
  IconSearch,
  IconEye,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import {
  DataTable,
  DataTableFacetedFilter,
} from "@workspace/ui/components/data-table"
import {
  type Payment,
  PAYMENT_DIRECTION_META,
  PAYMENT_STATUS_META,
  PAYMENT_DIRECTION_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/payments-data"
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

const columnHelper = createColumnHelper<typeof features, Payment>()

function buildColumns(onViewDetail: (payment: Payment) => void) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: "No. Payment",
      cell: ({ row }) => (
        <button
          type="button"
          className="text-primary hover:underline font-semibold font-mono text-sm"
          onClick={() => onViewDetail(row.original)}
        >
          {row.original.id}
        </button>
      ),
      enableHiding: false,
    }),
    columnHelper.accessor("date", {
      header: "Tanggal",
      cell: ({ row }) => (
        <span className="font-mono text-sm tabular-nums">{row.original.date}</span>
      ),
    }),
    columnHelper.accessor("partnerName", {
      header: "Mitra Bisnis / Partner",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.partnerName}</span>
      ),
    }),
    columnHelper.accessor("accountName", {
      header: "Akun Kas/Bank",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{row.original.accountName}</span>
          <span className="font-mono text-muted-foreground">{row.original.accountCode}</span>
        </div>
      ),
    }),
    columnHelper.accessor("reference", {
      header: "Referensi",
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {row.original.reference || "-"}
        </span>
      ),
    }),
    columnHelper.accessor("direction", {
      header: "Tipe Aliran",
      cell: ({ row }) => {
        const dirMeta = PAYMENT_DIRECTION_META[row.original.direction]
        return (
          <Badge variant="outline" className={`ring-1 ${dirMeta.chip}`}>
            {dirMeta.label}
          </Badge>
        )
      },
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.direction)
      },
    }),
    columnHelper.accessor("amount", {
      header: () => <div className="text-right">Nominal</div>,
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className={`text-right font-mono text-sm tabular-nums font-semibold ${p.direction === "outgoing" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
            {p.direction === "outgoing" ? "-" : ""}
            {formatRupiah(p.amount)}
          </div>
        )
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const statusMeta = PAYMENT_STATUS_META[row.original.status]
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
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onViewDetail(row.original)}
            title="Lihat Detail"
          >
            <IconEye className="size-4" />
          </Button>
        </div>
      ),
    }),
  ])
}

const COLUMN_LABELS: Record<string, string> = {
  id: "No. Payment",
  date: "Tanggal",
  partnerName: "Partner",
  accountName: "Akun",
  reference: "Referensi",
  direction: "Aliran",
  amount: "Nominal",
  status: "Status",
}

interface PaymentsDataTableProps {
  data: Payment[]
  onViewDetail: (payment: Payment) => void
}

export function PaymentsDataTable({
  data,
  onViewDetail,
}: PaymentsDataTableProps) {
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
        row.original.partnerName.toLowerCase().includes(q) ||
        (row.original.reference && row.original.reference.toLowerCase().includes(q)) ||
        (row.original.note && row.original.note.toLowerCase().includes(q))
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
      emptyMessage="Tidak ada transaksi pembayaran ditemukan."
      toolbar={
        <>
          <div className="relative">
            <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari ID payment, mitra, referensi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPagination((p) => ({ ...p, pageIndex: 0 }))
              }}
              className="h-8 w-64 pl-8"
            />
          </div>

          <DataTableFacetedFilter
            label="Aliran Dana"
            options={PAYMENT_DIRECTION_OPTIONS}
            selected={getFacetValues("direction")}
            onSelectionChange={(v) => setFacetFilter("direction", v)}
          />

          <DataTableFacetedFilter
            label="Status"
            options={PAYMENT_STATUS_OPTIONS}
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
