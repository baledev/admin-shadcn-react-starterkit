import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconFileText,
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconDownload,
} from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import { InvoiceDataTable } from "@/components/invoice-data-table"
import {
  type Invoice,
  computeInvoiceStats,
  initialInvoices,
  STATUS_META,
} from "@/lib/invoices-data"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"

export const Route = createFileRoute("/_auth/invoices")({
  component: InvoicesPage,
})

// ─── Stat cards ───────────────────────────────────────────────────────────────

function InvoiceStatCards({ invoices }: { invoices: Invoice[] }) {
  const { totalInvoiced, paid, outstanding, overdue } =
    computeInvoiceStats(invoices)

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n)

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Invoiced</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmt(totalInvoiced)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileText className="size-3.5" aria-hidden="true" />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across all invoices
          </div>
          <div className="text-muted-foreground">
            {invoices.length} invoices generated
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Paid</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmt(paid)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCheck className="size-3.5" aria-hidden="true" />
              Settled
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue collected
          </div>
          <div className="text-muted-foreground">
            {invoices.filter((i) => i.status === "paid").length} paid invoices
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Outstanding</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmt(outstanding)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3.5" aria-hidden="true" />
              Awaiting Payment
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sent & draft invoices
          </div>
          <div className="text-muted-foreground">
            {invoices.filter((i) => i.status === "sent" || i.status === "draft").length} unpaid invoices
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overdue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmt(overdue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconAlertTriangle className="size-3.5 text-destructive" aria-hidden="true" />
              Past Due
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-destructive">
            Requires attention
          </div>
          <div className="text-muted-foreground">
            {invoices.filter((i) => i.status === "overdue").length} overdue invoices
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────

function InvoiceDetailSheet({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!invoice) return null

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n)

  const meta = STATUS_META[invoice.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-mono">
            {invoice.id}
          </SheetTitle>
          <SheetDescription>
            Created on {invoice.issuedAt}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Status & Actions */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="outline" className={`ring-1 ${meta.chip}`}>
              {meta.label}
            </Badge>
          </div>

          <Separator />

          {/* Customer Details */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Customer</h4>
            <div className="text-sm bg-muted/50 rounded-lg p-3">
              <p className="font-medium text-foreground">{invoice.customerName}</p>
              <p className="text-muted-foreground text-xs">{invoice.customerEmail}</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Line Items</h4>
            <div className="space-y-3 bg-muted/30 rounded-lg p-3">
              {invoice.lines.map((line, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{line.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {line.qty} × {fmt(line.unitPrice)}
                    </p>
                  </div>
                  <span className="font-mono tabular-nums">
                    {fmt(line.qty * line.unitPrice)}
                  </span>
                </div>
              ))}

              <Separator className="my-2" />

              <div className="space-y-1.5 pt-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono tabular-nums">{fmt(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-mono tabular-nums">{fmt(invoice.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="font-mono tabular-nums text-foreground">{fmt(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Notes</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button className="flex-1" variant="outline" size="sm">
              <IconDownload className="size-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────

function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>(initialInvoices)
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Invoices"
            description="Manage invoices, record payments, and track receivables."
          >
            <Button size="sm">
              Create Invoice
            </Button>
          </PageHeader>

          <InvoiceStatCards invoices={invoices} />

          <div className="rounded-xl border border-border bg-card p-4">
            <InvoiceDataTable
              data={invoices}
              onViewDetail={handleViewDetail}
            />
          </div>
        </div>
      </div>

      <InvoiceDetailSheet
        invoice={selectedInvoice}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}
