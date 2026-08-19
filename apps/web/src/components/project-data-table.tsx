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
  IconPencil,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@workspace/ui/components/avatar"
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
import { Progress } from "@workspace/ui/components/progress"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import {
  DataTable,
  DataTableFacetedFilter,
} from "@workspace/ui/components/data-table"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
  type Project,
  PRIORITY_META,
  PRIORITY_OPTIONS,
  STATUS_META,
  STATUS_OPTIONS,
} from "@/lib/projects-data"
import { formatMonthDayYear } from "@/lib/date-utils"

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

const columnHelper = createColumnHelper<typeof features, Project>()

// ─── Sub-renderers ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Project["status"] }) {
  const meta = STATUS_META[status]
  return (
    <Badge variant="outline" className={`ring-1 ${meta.chip}`}>
      {meta.label}
    </Badge>
  )
}

function PriorityBadge({ priority }: { priority: Project["priority"] }) {
  const meta = PRIORITY_META[priority]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${meta.chip}`}
    >
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`w-0.5 rounded-full ${
              i < meta.bars ? "bg-current" : "bg-current/25"
            }`}
            style={{ height: `${4 + i * 2}px` }}
          />
        ))}
      </span>
      {meta.label}
    </span>
  )
}

function PicAvatars({ pic }: { pic: Project["pic"] }) {
  if (pic.length === 0) return <span className="text-muted-foreground">—</span>
  return (
    <AvatarGroup>
      {pic.map((p) => (
        <Avatar key={p.initials} size="sm">
          <AvatarFallback>{p.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  )
}

// ─── Column definitions ───────────────────────────────────────────────────────

function buildColumns(
  onViewDetail: (project: Project) => void,
  onEdit: (project: Project) => void,
  onRequestDelete: (project: Project) => void
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
            onClick={(event) => event.stopPropagation()}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("code", {
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.original.code}
        </span>
      ),
      enableHiding: false,
    }),
    columnHelper.display({
      id: "name",
      header: "Project",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.region}
          </span>
        </div>
      ),
      enableHiding: false,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.status)
      },
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.priority)
      },
    }),
    columnHelper.display({
      id: "pic",
      header: "PIC",
      cell: ({ row }) => <PicAvatars pic={row.original.pic} />,
      enableSorting: false,
    }),
    columnHelper.accessor("dueDate", {
      header: "Due Date",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatMonthDayYear(new Date(row.original.dueDate))}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.estimate}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("timelineHealth", {
      header: () => <div className="w-28">Progress</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.timelineHealth} className="w-20" />
          <span className="text-xs text-muted-foreground tabular-nums">
            {row.original.timelineHealth}%
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "tasks",
      header: "Tasks",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {row.original.tasksClosed}/{row.original.tasksTotal}
        </span>
      ),
      enableSorting: false,
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
                onClick={(event) => event.stopPropagation()}
                aria-label="Open project actions"
              />
            }
          >
            <IconDotsVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation()
                onViewDetail(row.original)
              }}
            >
              <IconEye className="mr-2 size-4" aria-hidden="true" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation()
                onEdit(row.original)
              }}
            >
              <IconPencil className="mr-2 size-4" aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={(event) => {
                event.stopPropagation()
                onRequestDelete(row.original)
              }}
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
  code: "Code",
  name: "Project",
  status: "Status",
  priority: "Priority",
  pic: "PIC",
  dueDate: "Due Date",
  timelineHealth: "Progress",
  tasks: "Tasks",
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProjectDataTableProps {
  data: Project[]
  onViewDetail: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectDataTable({
  data,
  onViewDetail,
  onEdit,
  onDelete,
}: ProjectDataTableProps) {
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
  const [pendingDelete, setPendingDelete] = React.useState<Project | null>(null)

  const columns = React.useMemo(
    () => buildColumns(onViewDetail, onEdit, setPendingDelete),
    [onViewDetail, onEdit]
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
        row.original.name.toLowerCase().includes(q) ||
        row.original.code.toLowerCase().includes(q) ||
        row.original.region.toLowerCase().includes(q)
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
        emptyMessage="No projects found."
        toolbar={
          <>
            <div className="relative">
              <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
            <DataTableFacetedFilter
              label="Priority"
              options={PRIORITY_OPTIONS}
              selected={getFacetValues("priority")}
              onSelectionChange={(v) => setFacetFilter("priority", v)}
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
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Delete this project?"
        description={
          <>
            {" "}
            <span className="font-medium text-foreground">
              {pendingDelete?.name}
            </span>{" "}
            ({pendingDelete?.code}) will be permanently removed. This action
            cannot be undone.
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
