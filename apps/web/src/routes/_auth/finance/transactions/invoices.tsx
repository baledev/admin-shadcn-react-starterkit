import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { InvoiceDataTable } from "@/components/invoice-data-table"
import { type Invoice, initialInvoices, STATUS_META } from "@/lib/invoices-data"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import { IconDownload } from "@tabler/icons-react"

export const Route = createFileRoute("/_auth/finance/transactions/invoices")({
  component: FinanceInvoicesPage,
})

function FinanceInvoicesPage() {
  const [invoices] = React.useState<Invoice[]>(initialInvoices)
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(
    null
  )
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailOpen(true)
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium text-foreground">
          Daftar Invoice Customer (Accounts Receivable)
        </h2>
        <p className="text-sm text-muted-foreground">
          List piutang dari customer hasil dari transaksi penjualan jasa/produk.
        </p>
      </div>

      <InvoiceDataTable data={invoices} onViewDetail={handleViewDetail} />

      {/* Invoice Detail Sheet */}
      {selectedInvoice && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="flex h-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">
                {selectedInvoice.id}
              </SheetTitle>
              <SheetDescription>
                Dibuat pada {selectedInvoice.issuedAt}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`ring-1 ${STATUS_META[selectedInvoice.status].chip}`}
                >
                  {STATUS_META[selectedInvoice.status].label}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Customer</h4>
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium text-foreground">
                    {selectedInvoice.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedInvoice.customerEmail}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Line Items</h4>
                <div className="space-y-3 rounded-lg bg-muted/30 p-3">
                  {selectedInvoice.lines.map((line, idx) => (
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

                  <div className="space-y-1.5 pt-1.5 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{fmt(selectedInvoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pajak (10%)</span>
                      <span>{fmt(selectedInvoice.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground">
                      <span>Total</span>
                      <span>{fmt(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h4 className="mb-1 text-sm font-semibold">Catatan</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              {/* collapsible preview of double-entry */}
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                <span className="block font-semibold text-foreground">
                  Auto Journal Entry Preview:
                </span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dr. Piutang Usaha (1120)</span>
                  <span className="font-mono">
                    {fmt(selectedInvoice.total)}
                  </span>
                </div>
                <div className="flex justify-between pl-4 text-muted-foreground">
                  <span>Cr. Pendapatan Jasa (4110)</span>
                  <span className="font-mono">
                    {fmt(selectedInvoice.total)}
                  </span>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-auto border-t border-border pt-4">
              <Button className="w-full" variant="outline" size="sm">
                <IconDownload className="mr-2 size-4" />
                Cetak Invoice
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
