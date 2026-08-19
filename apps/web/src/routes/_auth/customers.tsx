import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"

import { CustomerCardGrid } from "@/components/customer-card-grid"
import { CustomerDataTable } from "@/components/customer-data-table"
import { PageHeader } from "@/components/page-header"
import { toIsoDate } from "@/lib/date-utils"
import {
  type Customer,
  customersData,
  PLAN_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/customers-data"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { IconLayoutGrid, IconList, IconPlus } from "@tabler/icons-react"

type CustomersView = "grid" | "table"

export const Route = createFileRoute("/_auth/customers")({
  component: CustomersPage,
  validateSearch: (
    search: Record<string, unknown>
  ): { view: CustomersView } => ({
    view: search.view === "table" ? "table" : "grid",
  }),
})

// ─── Form state ───────────────────────────────────────────────────────────────

type CustomerFormState = {
  name: string
  email: string
  phone: string
  country: string
  status: Customer["status"]
  plan: Customer["plan"]
  totalSpend: string
}

const EMPTY_FORM: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  status: "active",
  plan: "free",
  totalSpend: "0",
}

function customerToForm(customer: Customer): CustomerFormState {
  return {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    country: customer.country,
    status: customer.status,
    plan: customer.plan,
    totalSpend: String(customer.totalSpend),
  }
}

function CustomersPage() {
  const { view } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [customers, setCustomers] = React.useState<Customer[]>(customersData)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(
    null
  )
  const [form, setForm] = React.useState<CustomerFormState>(EMPTY_FORM)

  function handleAdd() {
    setEditingCustomer(null)
    setForm(EMPTY_FORM)
    setSheetOpen(true)
  }

  const handleEdit = React.useCallback((customer: Customer) => {
    setEditingCustomer(customer)
    setForm(customerToForm(customer))
    setSheetOpen(true)
  }, [])

  const handleDelete = React.useCallback((customer: Customer) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
  }, [])

  function setView(next: CustomersView) {
    navigate({ search: { view: next }, replace: true })
  }

  function handleField<K extends keyof CustomerFormState>(
    key: K,
    value: CustomerFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()

    const values = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: form.country.trim(),
      status: form.status,
      plan: form.plan,
      totalSpend: Number(form.totalSpend) || 0,
    }

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...values } : c))
      )
    } else {
      setCustomers((prev) => [
        {
          id: prev.reduce((max, c) => Math.max(max, c.id), 0) + 1,
          joinedAt: toIsoDate(new Date()),
          ...values,
        },
        ...prev,
      ])
    }

    setSheetOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Customers"
            description="Manage your customer accounts and subscriptions."
          >
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5">
                <Button
                  variant={view === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                >
                  <IconLayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={view === "table" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setView("table")}
                  aria-label="Table view"
                >
                  <IconList className="size-4" />
                </Button>
              </div>
              <Button size="sm" onClick={handleAdd}>
                <IconPlus className="size-4" aria-hidden="true" />
                Add Customer
              </Button>
            </div>
          </PageHeader>
          {view === "grid" ? (
            <CustomerCardGrid
              data={customers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <CustomerDataTable
              data={customers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <CustomerFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isEditing={editingCustomer !== null}
        form={form}
        onField={handleField}
        onSave={handleSave}
      />
    </div>
  )
}

// ─── Add / Edit sheet ─────────────────────────────────────────────────────────

interface CustomerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  form: CustomerFormState
  onField: <K extends keyof CustomerFormState>(
    key: K,
    value: CustomerFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

function CustomerFormSheet({
  open,
  onOpenChange,
  isEditing,
  form,
  onField,
  onSave,
}: CustomerFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Customer" : "Add Customer"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the customer's details below."
              : "Fill in the details below to add a new customer."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-name">Full Name</Label>
              <Input
                id="customer-name"
                placeholder="Alice Johnson"
                value={form.name}
                onChange={(e) => onField("name", e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="alice@example.com"
                value={form.email}
                onChange={(e) => onField("email", e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-phone">Phone</Label>
              <Input
                id="customer-phone"
                type="tel"
                placeholder="+1 555-0100"
                value={form.phone}
                onChange={(e) => onField("phone", e.target.value)}
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-country">Country</Label>
              <Input
                id="customer-country"
                placeholder="United States"
                value={form.country}
                onChange={(e) => onField("country", e.target.value)}
              />
            </div>

            {/* Status + Plan side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customer-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    onField("status", v as Customer["status"])
                  }
                >
                  <SelectTrigger id="customer-status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="customer-plan">Plan</Label>
                <Select
                  value={form.plan}
                  onValueChange={(v) => onField("plan", v as Customer["plan"])}
                >
                  <SelectTrigger id="customer-plan" className="w-full">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Total Spend */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-total-spend">Total Spend (USD)</Label>
              <Input
                id="customer-total-spend"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.totalSpend}
                onChange={(e) => onField("totalSpend", e.target.value)}
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Save Customer"}
            </Button>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Cancel
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
