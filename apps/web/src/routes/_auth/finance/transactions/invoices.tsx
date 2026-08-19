import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { InvoiceDataTable } from "@/components/invoice-data-table"
import {
  type Invoice,
  initialInvoices,
  STATUS_META,
} from "@/lib/invoices-data"
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
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
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
        <h2 className="text-sm font-medium text-foreground">Daftar Invoice Customer (Accounts Receivable)</h2>
        <p className="text-sm text-muted-foreground">List piutang dari customer hasil dari transaksi penjualan jasa/produk.</p>
      </div>

      <InvoiceDataTable
        data={invoices}
        onViewDetail={handleViewDetail}
      />

      {/* Invoice Detail Sheet */}
      {selectedInvoice && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-md flex flex-col h-full">
            <SheetHeader>
              <SheetTitle className="font-mono">{selectedInvoice.id}</SheetTitle>
              <SheetDescription>Dibuat pada {selectedInvoice.issuedAt}</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={`ring-1 ${STATUS_META[selectedInvoice.status].chip}`}>
                  {STATUS_META[selectedInvoice.status].label}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Customer</h4>
                <div className="text-sm bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">{selectedInvoice.customerName}</p>
                  <p className="text-muted-foreground text-xs">{selectedInvoice.customerEmail}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                <div className="space-y-3 bg-muted/30 rounded-lg p-3">
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
                  <h4 className="text-sm font-semibold mb-1">Catatan</h4>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
                </div>
              )}

              {/* collapsible preview of double-entry */}
              <div className="rounded-lg border border-border p-3 text-xs bg-muted/20 space-y-1.5">
                <span className="font-semibold block text-foreground">Auto Journal Entry Preview:</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dr. Piutang Usaha (1120)</span>
                  <span className="font-mono">{fmt(selectedInvoice.total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-4">
                  <span>Cr. Pendapatan Jasa (4110)</span>
                  <span className="font-mono">{fmt(selectedInvoice.total)}</span>
                </div>
              </div>

              </div>

            <SheetFooter className="mt-auto border-t border-border pt-4">
              <Button className="w-full" variant="outline" size="sm">
                <IconDownload className="size-4 mr-2" />
                Cetak Invoice
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
