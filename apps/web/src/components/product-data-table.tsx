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

import { Badge } from "@workspace/ui/components/badge"
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
  type Product,
  CATEGORY_META,
  CATEGORY_OPTIONS,
  STOCK_STATUS_META,
  STOCK_STATUS_OPTIONS,
} from "@/lib/products-data"

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

const columnHelper = createColumnHelper<typeof features, Product>()

// ─── Stock badge ──────────────────────────────────────────────────────────────

function StockBadge({ status }: { status: Product["stockStatus"] }) {
  const meta = STOCK_STATUS_META[status]
  return (
    <Badge variant="outline" className={`ring-1 ${meta.chip}`}>
      {meta.label}
    </Badge>
  )
}

// ─── Product thumbnail ────────────────────────────────────────────────────────

function ProductThumb({ imageUrl, name }: { imageUrl?: string; name: string }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="size-9 rounded-md object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
    )
  }
  return (
    <div className="flex size-9 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

// ─── Column definitions ───────────────────────────────────────────────────────

function buildColumns(
  onEdit: (product: Product) => void,
  onRequestDelete: (product: Product) => void
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
    columnHelper.display({
      id: "product",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <ProductThumb
            imageUrl={row.original.imageUrl}
            name={row.original.name}
          />
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {row.original.sku}
            </span>
          </div>
        </div>
      ),
      enableHiding: false,
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {CATEGORY_META[row.original.category].label}
        </span>
      ),
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.category)
      },
    }),
    columnHelper.accessor("price", {
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm tabular-nums">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.price)}
        </div>
      ),
    }),
    columnHelper.accessor("stock", {
      header: () => <div className="text-right">Stock</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{row.original.stock}</div>
      ),
    }),
    columnHelper.accessor("stockStatus", {
      header: "Stock Status",
      cell: ({ row }) => <StockBadge status={row.original.stockStatus} />,
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.stockStatus)
      },
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
          <DropdownMenuContent align="end" className="w-40">
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
  product: "Product",
  category: "Category",
  price: "Price",
  stock: "Stock",
  stockStatus: "Stock Status",
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductDataTableProps {
  data: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductDataTable({
  data,
  onEdit,
  onDelete,
}: ProductDataTableProps) {
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
  const [pendingDelete, setPendingDelete] = React.useState<Product | null>(null)

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
        row.original.name.toLowerCase().includes(q) ||
        row.original.sku.toLowerCase().includes(q)
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
        emptyMessage="No products found."
        toolbar={
          <>
            {/* Global search */}
            <div className="relative">
              <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
              label="Category"
              options={CATEGORY_OPTIONS}
              selected={getFacetValues("category")}
              onSelectionChange={(v) => setFacetFilter("category", v)}
            />
            <DataTableFacetedFilter
              label="Stock Status"
              options={STOCK_STATUS_OPTIONS}
              selected={getFacetValues("stockStatus")}
              onSelectionChange={(v) => setFacetFilter("stockStatus", v)}
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
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Delete product?"
        description={
          <>
            <span className="font-medium text-foreground">
              {pendingDelete?.name}
            </span>{" "}
            will be permanently removed. This action cannot be undone.
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
