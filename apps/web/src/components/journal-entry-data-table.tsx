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
import { IconSearch, IconEye, IconBan, IconX } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import {
  DataTable,
  DataTableFacetedFilter,
} from "@workspace/ui/components/data-table"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
  type JournalEntry,
  JOURNAL_TYPE_META,
  ENTRY_STATUS_META,
  JOURNAL_TYPE_OPTIONS,
  ENTRY_STATUS_OPTIONS,
} from "@/lib/journal-entries-data"
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

const columnHelper = createColumnHelper<typeof features, JournalEntry>()

function buildColumns(
  onViewDetail: (entry: JournalEntry) => void,
  onRequestCancel: (entry: JournalEntry) => void
) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: "ID Jurnal",
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
    columnHelper.accessor("date", {
      header: "Tanggal",
      cell: ({ row }) => (
        <span className="font-mono text-sm tabular-nums">
          {row.original.date}
        </span>
      ),
    }),
    columnHelper.accessor("reference", {
      header: "Referensi",
      cell: ({ row }) => (
        <span className="block max-w-[150px] truncate font-medium">
          {row.original.reference || (
            <span className="text-muted-foreground/50 italic">-</span>
          )}
        </span>
      ),
    }),
    columnHelper.accessor("note", {
      header: "Keterangan / Catatan",
      cell: ({ row }) => (
        <span
          className="block max-w-[250px] truncate"
          title={row.original.note}
        >
          {row.original.note}
        </span>
      ),
    }),
    columnHelper.accessor("type", {
      header: "Jurnal",
      cell: ({ row }) => {
        const typeMeta = JOURNAL_TYPE_META[row.original.type]
        return (
          <Badge
            variant="secondary"
            className={`${typeMeta.color} font-medium`}
          >
            {typeMeta.label}
          </Badge>
        )
      },
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.type)
      },
    }),
    columnHelper.accessor("totalDebit", {
      header: () => <div className="text-right">Total Debit/Kredit</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm font-semibold tabular-nums">
          {formatRupiah(row.original.totalDebit)}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const statusMeta = ENTRY_STATUS_META[row.original.status]
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
        const entry = row.original
        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onViewDetail(entry)}
              aria-label="Lihat detail"
            >
              <IconEye className="size-4" />
            </Button>
            {entry.status === "posted" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:bg-destructive/15"
                onClick={() => onRequestCancel(entry)}
                aria-label="Batalkan jurnal"
              >
                <IconBan className="size-4" />
              </Button>
            )}
          </div>
        )
      },
    }),
  ])
}

const COLUMN_LABELS: Record<string, string> = {
  id: "ID Jurnal",
  date: "Tanggal",
  reference: "Referensi",
  note: "Catatan",
  type: "Tipe",
  totalDebit: "Total",
  status: "Status",
}

interface JournalEntryDataTableProps {
  data: JournalEntry[]
  onViewDetail: (entry: JournalEntry) => void
  onCancelEntry: (entry: JournalEntry) => void
}

export function JournalEntryDataTable({
  data,
  onViewDetail,
  onCancelEntry,
}: JournalEntryDataTableProps) {
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
  const [pendingCancel, setPendingCancel] = React.useState<JournalEntry | null>(
    null
  )

  const columns = React.useMemo(
    () => buildColumns(onViewDetail, setPendingCancel),
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
        (row.original.reference &&
          row.original.reference.toLowerCase().includes(q)) ||
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
    <>
      <DataTable
        table={table}
        rows={pagedRows}
        columnCount={columns.length}
        columnLabels={COLUMN_LABELS}
        emptyMessage="Tidak ada transaksi jurnal ditemukan."
        toolbar={
          <>
            <div className="relative">
              <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari ID, referensi, catatan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPagination((p) => ({ ...p, pageIndex: 0 }))
                }}
                className="h-8 w-64 pl-8"
              />
            </div>

            <DataTableFacetedFilter
              label="Tipe Jurnal"
              options={JOURNAL_TYPE_OPTIONS}
              selected={getFacetValues("type")}
              onSelectionChange={(v) => setFacetFilter("type", v)}
            />

            <DataTableFacetedFilter
              label="Status"
              options={ENTRY_STATUS_OPTIONS}
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
      <ConfirmDialog
        open={pendingCancel !== null}
        onOpenChange={(open) => {
          if (!open) setPendingCancel(null)
        }}
        title="Batalkan Jurnal Transaksi?"
        description={
          <>
            Jurnal{" "}
            <span className="font-medium text-foreground">
              {pendingCancel?.id}
            </span>{" "}
            akan dibatalkan. Tindakan ini akan membuat status jurnal menjadi
            Batal.
          </>
        }
        confirmLabel="Batalkan"
        onConfirm={() => {
          if (pendingCancel) onCancelEntry(pendingCancel)
          setPendingCancel(null)
        }}
      />
    </>
  )
}
