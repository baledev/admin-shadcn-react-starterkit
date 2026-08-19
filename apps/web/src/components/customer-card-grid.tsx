import * as React from "react"
import {
  IconDotsVertical,
  IconPencil,
  IconSearch,
  IconTrash,
  IconUsers,
  IconX,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import { DataTableFacetedFilter } from "@workspace/ui/components/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { PlanBadge, StatusBadge } from "@/components/customer-badges"
import {
  CUSTOMERS_PAGE_SIZE,
  filterCustomers,
  getCustomersPage,
  PLAN_OPTIONS,
  STATUS_OPTIONS,
  type Customer,
} from "@/lib/customers-data"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatJoinedAt(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CustomerCardProps {
  customer: Customer
  onEdit: (customer: Customer) => void
  onRequestDelete: (customer: Customer) => void
}

function CustomerCard({
  customer,
  onEdit,
  onRequestDelete,
}: CustomerCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate">{customer.name}</CardTitle>
            <p className="truncate text-sm text-muted-foreground">
              {customer.email}
            </p>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Actions for ${customer.name}`}
                  className="size-8 text-muted-foreground data-[state=open]:bg-muted"
                />
              }
            >
              <IconDotsVertical className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                <IconPencil className="mr-2 size-4" aria-hidden="true" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onRequestDelete(customer)}
              >
                <IconTrash className="mr-2 size-4" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={customer.status} />
          <PlanBadge plan={customer.plan} />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Country</dt>
            <dd className="truncate">{customer.country}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Phone</dt>
            <dd className="truncate tabular-nums">{customer.phone || "—"}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Joined</dt>
            <dd className="truncate tabular-nums">
              {formatJoinedAt(customer.joinedAt)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Total Spend</dt>
            <dd className="truncate font-medium tabular-nums">
              {currencyFormatter.format(customer.totalSpend)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
interface CustomerCardGridProps {
  data: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerCardGrid({
  data,
  onEdit,
  onDelete,
}: CustomerCardGridProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [planFilter, setPlanFilter] = React.useState<string[]>([])
  const [pendingDelete, setPendingDelete] = React.useState<Customer | null>(
    null
  )

  // Cursor of the last loaded page — `null` means "only the first page".
  const [cursor, setCursor] = React.useState<string | null>(null)
  const [isExhausted, setIsExhausted] = React.useState(false)

  const filtered = React.useMemo(
    () =>
      filterCustomers(data, {
        search,
        status: statusFilter,
        plan: planFilter,
      }),
    [data, search, statusFilter, planFilter]
  )

  // Derived from `filtered` (not stored) so local add/edit/delete stay in sync.
  const visible = React.useMemo(() => {
    if (isExhausted) return filtered
    if (cursor === null) {
      return getCustomersPage(filtered, { limit: CUSTOMERS_PAGE_SIZE }).items
    }
    const index = filtered.findIndex((c) => String(c.id) === cursor)
    if (index === -1) {
      return getCustomersPage(filtered, { limit: CUSTOMERS_PAGE_SIZE }).items
    }
    return filtered.slice(0, index + 1)
  }, [filtered, cursor, isExhausted])

  const hasMore = visible.length < filtered.length

  // Any query change restarts pagination from the first page.
  function resetCursor() {
    setCursor(null)
    setIsExhausted(false)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    resetCursor()
  }

  function handleStatusChange(values: string[]) {
    setStatusFilter(values)
    resetCursor()
  }

  function handlePlanChange(values: string[]) {
    setPlanFilter(values)
    resetCursor()
  }

  function handleLoadMore() {
    const page = getCustomersPage(filtered, {
      cursor:
        visible.length > 0 ? String(visible[visible.length - 1]!.id) : null,
      limit: CUSTOMERS_PAGE_SIZE,
    })
    if (page.nextCursor) {
      setCursor(page.nextCursor)
    } else {
      setIsExhausted(true)
    }
  }

  const hasActiveFilters =
    search.trim() !== "" || statusFilter.length > 0 || planFilter.length > 0

  function resetAllFilters() {
    setSearch("")
    setStatusFilter([])
    setPlanFilter([])
    resetCursor()
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-8 w-64 pl-8"
            />
          </div>

          <DataTableFacetedFilter
            label="Status"
            options={STATUS_OPTIONS}
            selected={statusFilter}
            onSelectionChange={handleStatusChange}
          />
          <DataTableFacetedFilter
            label="Plan"
            options={PLAN_OPTIONS}
            selected={planFilter}
            onSelectionChange={handlePlanChange}
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
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
            <IconUsers
              className="size-12 text-muted-foreground/50"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium">No customers found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {visible.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={onEdit}
                onRequestDelete={setPendingDelete}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            {hasMore && (
              <Button variant="outline" onClick={handleLoadMore}>
                Load more
              </Button>
            )}
            <p className="text-sm text-muted-foreground tabular-nums">
              Showing {visible.length} of {filtered.length} customers
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Delete customer?"
        description={
          <>
            <span className="font-medium text-foreground">
              {pendingDelete?.name}
            </span>{" "}
            and their account history will be permanently removed. This action
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
