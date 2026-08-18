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
  IconSearch,
  IconShield,
  IconTrash,
  IconUserX,
  IconX,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
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
import {
  type TeamMember,
  type TeamRole,
  ROLE_META,
  ROLE_OPTIONS,
  STATUS_META,
  STATUS_OPTIONS,
} from "@/lib/team-data"

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

const columnHelper = createColumnHelper<typeof features, TeamMember>()

// ─── Helper formatters ────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "Yesterday"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ─── Column definitions ───────────────────────────────────────────────────────

function buildColumns(
  onChangeRole: (member: TeamMember, newRole: TeamRole) => void,
  onToggleStatus: (member: TeamMember) => void,
  onRemove: (member: TeamMember) => void
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
      id: "member",
      header: "Member",
      cell: ({ row }) => {
        const initials = getInitials(row.original.name)
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage
                src={row.original.avatarUrl}
                alt={row.original.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {row.original.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        )
      },
      enableHiding: false,
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: ({ row }) => {
        const meta = ROLE_META[row.original.role]
        return (
          <Badge variant="outline" className={`w-fit font-medium ${meta.chip}`}>
            {meta.label}
          </Badge>
        )
      },
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.role)
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const meta = STATUS_META[row.original.status]
        return (
          <Badge variant="outline" className={`ring-1 ${meta.chip}`}>
            {meta.label}
          </Badge>
        )
      },
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true
        return filterValue.includes(row.original.status)
      },
    }),
    columnHelper.accessor("lastActiveAt", {
      header: "Last Active",
      cell: ({ row }) => {
        if (row.original.status === "deactivated") {
          return <span className="text-xs text-muted-foreground/50">Offline</span>
        }
        return (
          <span className="text-sm text-muted-foreground">
            {formatRelativeTime(row.original.lastActiveAt)}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const isOwner = row.original.role === "owner"
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                disabled={isOwner}
                onClick={() => {
                  const roles: TeamRole[] = ["admin", "member", "viewer"]
                  const currIdx = roles.indexOf(row.original.role as TeamRole)
                  const nextRole = roles[(currIdx + 1) % roles.length]
                  onChangeRole(row.original, nextRole)
                }}
              >
                <IconShield className="mr-2 size-4" aria-hidden="true" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isOwner}
                onClick={() => onToggleStatus(row.original)}
              >
                <IconUserX className="mr-2 size-4" aria-hidden="true" />
                {row.original.status === "deactivated"
                  ? "Reactivate"
                  : "Deactivate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isOwner}
                onClick={() => onRemove(row.original)}
              >
                <IconTrash className="mr-2 size-4" aria-hidden="true" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }),
  ])
}

const COLUMN_LABELS: Record<string, string> = {
  member: "Member",
  role: "Role",
  status: "Status",
  lastActiveAt: "Last Active",
}

// ─── Main component ───────────────────────────────────────────────────────────

interface TeamDataTableProps {
  data: TeamMember[]
  onChangeRole: (member: TeamMember, newRole: TeamRole) => void
  onToggleStatus: (member: TeamMember) => void
  onRemove: (member: TeamMember) => void
}

export function TeamDataTable({
  data,
  onChangeRole,
  onToggleStatus,
  onRemove,
}: TeamDataTableProps) {
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
    () => buildColumns(onChangeRole, onToggleStatus, onRemove),
    [onChangeRole, onToggleStatus, onRemove]
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
        row.original.name.toLowerCase().includes(q) ||
        row.original.email.toLowerCase().includes(q)
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
      emptyMessage="No team members found."
      toolbar={
        <>
          {/* Global search */}
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
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
            label="Role"
            options={ROLE_OPTIONS}
            selected={getFacetValues("role")}
            onSelectionChange={(v) => setFacetFilter("role", v)}
          />
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
