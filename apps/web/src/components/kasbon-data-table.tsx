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
  IconWallet,
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
  type Kasbon,
  KASBON_STATUS_META,
  KASBON_STATUS_OPTIONS,
} from "@/lib/kasbon-data"
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

const columnHelper = createColumnHelper<typeof features, Kasbon>()

function buildColumns(
  onViewDetail: (kasbon: Kasbon) => void,
  onRecordRepayment?: (kasbon: Kasbon) => void
) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: "ID Kasbon",
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
    columnHelper.accessor("employeeName", {
      header: "Karyawan",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.employeeName}</span>
          <span className="text-xs text-muted-foreground">{row.original.employeeEmail}</span>
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: "Tanggal",
      cell: ({ row }) => (
        <span className="font-mono text-sm tabular-nums">{row.original.date}</span>
      ),
    }),
    columnHelper.accessor("purpose", {
      header: "Tujuan / Keperluan",
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate block" title={row.original.purpose}>
          {row.original.purpose}
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: () => <div className="text-right">Plafon Kasbon</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm tabular-nums">
          {formatRupiah(row.original.amount)}
        </div>
      ),
    }),
    columnHelper.accessor("remainingAmount", {
      header: () => <div className="text-right">Sisa Tagihan</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm tabular-nums font-semibold text-amber-600 dark:text-amber-400">
          {formatRupiah(row.original.remainingAmount)}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const statusMeta = KASBON_STATUS_META[row.original.status]
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
        const k = row.original
        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onViewDetail(k)}
              title="Lihat Detail"
            >
              <IconEye className="size-4" />
            </Button>
            {k.status === "active" && k.remainingAmount > 0 && onRecordRepayment && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
                onClick={() => onRecordRepayment(k)}
                title="Bayar Cicilan"
              >
                <IconWallet className="size-3" />
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
  id: "ID Kasbon",
  employeeName: "Karyawan",
  date: "Tanggal",
  purpose: "Tujuan",
  amount: "Plafon",
  remainingAmount: "Sisa Tagihan",
  status: "Status",
}

interface KasbonDataTableProps {
  data: Kasbon[]
  onViewDetail: (kasbon: Kasbon) => void
  onRecordRepayment?: (kasbon: Kasbon) => void
}

export function KasbonDataTable({
  data,
  onViewDetail,
  onRecordRepayment,
}: KasbonDataTableProps) {
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
    () => buildColumns(onViewDetail, onRecordRepayment),
    [onViewDetail, onRecordRepayment]
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
        row.original.purpose.toLowerCase().includes(q)
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
      emptyMessage="Tidak ada data kasbon ditemukan."
      toolbar={
        <>
          <div className="relative">
            <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari ID kasbon, nama karyawan..."
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
            options={KASBON_STATUS_OPTIONS}
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
