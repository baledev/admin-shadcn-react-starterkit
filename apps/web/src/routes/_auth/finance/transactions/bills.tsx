import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { BillsDataTable } from "@/components/bills-data-table"
import { type Bill, initialBills, BILL_STATUS_META } from "@/lib/bills-data"
import {
  BillsFormSheet,
  type BillFormState,
} from "@/components/bills-form-sheet"
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
import { initialAccounts, formatRupiah } from "@/lib/accounts-data"
import { IconDownload, IconPlus } from "@tabler/icons-react"

export const Route = createFileRoute("/_auth/finance/transactions/bills")({
  component: BillsPage,
})

function BillsPage() {
  const [bills, setBills] = React.useState<Bill[]>(initialBills)
  const [selectedBill, setSelectedBill] = React.useState<Bill | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const [formState, setFormState] = React.useState<BillFormState>(() => ({
    vendorName: "",
    vendorEmail: "",
    issuedAt: new Date().toISOString().split("T")[0],
    dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    lines: [{ description: "", accountCode: "", qty: 1, unitPrice: 0 }],
  }))

  const handleField = <K extends keyof BillFormState>(
    key: K,
    value: BillFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleViewDetail = (bill: Bill) => {
    setSelectedBill(bill)
    setIsDetailOpen(true)
  }

  const handleAddBill = () => {
    setFormState({
      vendorName: "",
      vendorEmail: "",
      issuedAt: new Date().toISOString().split("T")[0],
      dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
      lines: [{ description: "", accountCode: "", qty: 1, unitPrice: 0 }],
    })
    setIsFormOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const subtotal = formState.lines.reduce(
      (sum, line) => sum + (line.qty * line.unitPrice || 0),
      0
    )
    const tax = Math.round(subtotal * 0.1)
    const total = subtotal + tax

    const newBill: Bill = {
      id: `BILL-2026-0${bills.length + 1}`,
      vendorName: formState.vendorName,
      vendorEmail: formState.vendorEmail,
      status: "received",
      lines: formState.lines.map((l) => ({
        ...l,
        amount: l.qty * l.unitPrice,
      })),
      subtotal,
      tax,
      total,
      issuedAt: formState.issuedAt,
      dueAt: formState.dueAt,
      notes: formState.notes,
    }

    setBills([newBill, ...bills])
    setIsFormOpen(false)
  }

  const handlePayBill = (bill: Bill) => {
    setBills(
      bills.map((b) =>
        b.id === bill.id ? { ...b, status: "paid" as const } : b
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Daftar Bill Vendor (Accounts Payable)
          </h2>
          <p className="text-sm text-muted-foreground">
            List tagihan masuk dari vendor/supplier atas pembelian barang/jasa
            operasional.
          </p>
        </div>
        <Button size="sm" onClick={handleAddBill}>
          <IconPlus className="mr-2 size-4" />
          Catat Bill Baru
        </Button>
      </div>

      <BillsDataTable
        data={bills}
        onViewDetail={handleViewDetail}
        onPayBill={handlePayBill}
      />

      <BillsFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={formState}
        accounts={initialAccounts}
        onField={handleField}
        onSave={handleSave}
      />

      {/* Bill Detail Sheet */}
      {selectedBill && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="flex h-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">{selectedBill.id}</SheetTitle>
              <SheetDescription>
                Dibuat pada {selectedBill.issuedAt}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`ring-1 ${BILL_STATUS_META[selectedBill.status].chip}`}
                >
                  {BILL_STATUS_META[selectedBill.status].label}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Vendor</h4>
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium text-foreground">
                    {selectedBill.vendorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedBill.vendorEmail}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">
                  Rincian Pembelian
                </h4>
                <div className="space-y-3 rounded-lg bg-muted/30 p-3">
                  {selectedBill.lines.map((line, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{line.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {line.qty} × {formatRupiah(line.unitPrice)}
                        </p>
                      </div>
                      <span className="font-mono tabular-nums">
                        {formatRupiah(line.amount)}
                      </span>
                    </div>
                  ))}

                  <Separator className="my-2" />

                  <div className="space-y-1.5 pt-1.5 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatRupiah(selectedBill.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PPN (10%)</span>
                      <span>{formatRupiah(selectedBill.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground">
                      <span>Total</span>
                      <span>{formatRupiah(selectedBill.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBill.notes && (
                <div>
                  <h4 className="mb-1 text-sm font-semibold">Catatan</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedBill.notes}
                  </p>
                </div>
              )}

              {/* collapsible preview of double-entry */}
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                <span className="block font-semibold text-foreground">
                  Auto Journal Entry Preview:
                </span>
                {selectedBill.lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-muted-foreground"
                  >
                    <span>Dr. Akun Beban/Aset ({line.accountCode})</span>
                    <span className="font-mono">
                      {formatRupiah(line.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pl-4 text-muted-foreground">
                  <span>Cr. Hutang Usaha (2110)</span>
                  <span className="font-mono">
                    {formatRupiah(selectedBill.total)}
                  </span>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-auto border-t border-border pt-4">
              <Button className="w-full" variant="outline" size="sm">
                <IconDownload className="mr-2 size-4" />
                Cetak Bill
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
