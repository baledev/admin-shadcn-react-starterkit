import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconAlertTriangle,
  IconCheck,
  IconCurrencyDollar,
  IconDownload,
  IconPlus,
  IconReceipt,
} from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import { InvoiceDataTable } from "@/components/invoice-data-table"
import {
  type Invoice,
  STATUS_META,
  computeInvoiceStats,
  initialInvoices,
} from "@/lib/invoices-data"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

// ─── Currency formatter ───────────────────────────────────────────────────────

const fmtCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

// ─── Stat cards ───────────────────────────────────────────────────────────────

function InvoiceStatCards({ invoices }: { invoices: Invoice[] }) {
  const { totalInvoiced, paid, outstanding, overdue } =
    computeInvoiceStats(invoices)

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Invoiced</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtCurrency.format(totalInvoiced)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconReceipt className="size-3.5" aria-hidden="true" />
              All
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All-time invoice value
          </div>
          <div className="text-muted-foreground">
            {invoices.length} invoices total
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Paid</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtCurrency.format(paid)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCheck className="size-3.5" aria-hidden="true" />
              Collected
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
            {fmtCurrency.format(outstanding)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar className="size-3.5" aria-hidden="true" />
              Pending
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Awaiting payment
          </div>
          <div className="text-muted-foreground">
            Draft and sent invoices
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overdue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtCurrency.format(overdue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconAlertTriangle className="size-3.5" aria-hidden="true" />
              At Risk
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Past due date
          </div>
          <div className="text-muted-foreground">
            {invoices.filter((i) => i.status === "overdue").length} overdue invoices
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// ─── Invoice preview Sheet ────────────────────────────────────────────────────

interface InvoicePreviewSheetProps {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function InvoicePreviewSheet({
  invoice,
  open,
  onOpenChange,
}: InvoicePreviewSheetProps) {
  if (!invoice) return null

  const statusMeta = STATUS_META[invoice.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="font-mono text-lg">
                {invoice.id}
              </SheetTitle>
              <SheetDescription className="mt-1">
                Invoice preview
              </SheetDescription>
            </div>
            <Badge variant="outline" className={`ring-1 ${statusMeta.chip}`}>
              {statusMeta.label}
            </Badge>
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
          {/* Logo placeholder + dates */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconReceipt className="size-6" aria-hidden="true" />
            </div>
            <div className="text-right text-sm">
              <div className="text-muted-foreground">Issue date</div>
              <div className="tabular-nums font-medium">{invoice.issuedAt}</div>
              <div className="mt-1 text-muted-foreground">Due date</div>
              <div className="tabular-nums font-medium">{invoice.dueAt}</div>
            </div>
          </div>

          {/* Bill to */}
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Bill To
            </p>
            <p className="font-medium">{invoice.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {invoice.customerEmail}
            </p>
          </div>

          <Separator />

          {/* Line items */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Line Items
            </p>
            <div className="space-y-2">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Amount</span>
              </div>
              <Separator />
              {invoice.lines.map((line, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-sm"
                >
                  <span>{line.description}</span>
                  <span className="text-right tabular-nums text-muted-foreground">
                    {line.qty}
                  </span>
                  <span className="text-right tabular-nums">
                    {fmtCurrency.format(line.qty * line.unitPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">
                {fmtCurrency.format(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (10%)</span>
              <span className="tabular-nums">
                {fmtCurrency.format(invoice.tax)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="tabular-nums">
                {fmtCurrency.format(invoice.total)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Notes
                </p>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Footer actions */}
        <div className="flex justify-end gap-2 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => {
              /* stub — wire to real PDF generation */
            }}
          >
            <IconDownload className="size-4" aria-hidden="true" />
            Download PDF
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function InvoicesPage() {
  const [invoices] = React.useState<Invoice[]>(initialInvoices)
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(
    null
  )
  const [sheetOpen, setSheetOpen] = React.useState(false)

  function handleViewDetail(invoice: Invoice) {
    setSelectedInvoice(invoice)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Invoices"
            description="Track and manage customer invoices."
          >
            <Button size="sm">
              <IconPlus className="size-4" aria-hidden="true" />
              New Invoice
            </Button>
          </PageHeader>

          <InvoiceStatCards invoices={invoices} />

          <InvoiceDataTable data={invoices} onViewDetail={handleViewDetail} />
        </div>
      </div>

      <InvoicePreviewSheet
        invoice={selectedInvoice}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
