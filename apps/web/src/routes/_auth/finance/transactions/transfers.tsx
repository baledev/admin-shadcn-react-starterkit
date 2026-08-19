import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { TransfersDataTable } from "@/components/transfers-data-table"
import {
  type Transfer,
  initialTransfers,
  TRANSFER_STATUS_META,
} from "@/lib/transfers-data"
import { TransfersFormSheet, type TransferFormState } from "@/components/transfers-form-sheet"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { initialAccounts, formatRupiah } from "@/lib/accounts-data"

export const Route = createFileRoute("/_auth/finance/transactions/transfers")({
  component: TransfersPage,
})

function TransfersPage() {
  const [transfers, setTransfers] = React.useState<Transfer[]>(initialTransfers)
  const [selectedTransfer, setSelectedTransfer] = React.useState<Transfer | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const [formState, setFormState] = React.useState<TransferFormState>({
    fromAccountCode: "",
    toAccountCode: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    note: "",
  })

  const handleField = <K extends keyof TransferFormState>(
    key: K,
    value: TransferFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleViewDetail = (transfer: Transfer) => {
    setSelectedTransfer(transfer)
    setIsDetailOpen(true)
  }

  const handleAddTransfer = () => {
    setFormState({
      fromAccountCode: "",
      toAccountCode: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      note: "",
    })
    setIsFormOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const fromAcc = initialAccounts.find((a) => a.code === formState.fromAccountCode)
    const toAcc = initialAccounts.find((a) => a.code === formState.toAccountCode)
    if (!fromAcc || !toAcc) return

    const newTransfer: Transfer = {
      id: `TRF-2026-0${transfers.length + 1}`,
      fromAccountCode: formState.fromAccountCode,
      fromAccountName: fromAcc.name,
      toAccountCode: formState.toAccountCode,
      toAccountName: toAcc.name,
      amount: formState.amount,
      date: formState.date,
      status: "completed", // default completed directly
      note: formState.note,
    }

    setTransfers([newTransfer, ...transfers])
    setIsFormOpen(false)
  }

  const handleCompleteTransfer = (transfer: Transfer) => {
    setTransfers(
      transfers.map((t) => (t.id === transfer.id ? { ...t, status: "completed" as const } : t))
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Mutasi Dana Antar Kas & Rekening (Transfers)</h3>
        <p className="text-sm text-muted-foreground">Catat pemindahan saldo operasional dari kas kecil ke bank, penarikan tunai, maupun transfer antar rekening bank internal.</p>
      </div>

      <TransfersDataTable
        data={transfers}
        onAddTransfer={handleAddTransfer}
        onViewDetail={handleViewDetail}
        onCompleteTransfer={handleCompleteTransfer}
      />

      <TransfersFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={formState}
        accounts={initialAccounts}
        onField={handleField}
        onSave={handleSave}
      />

      {/* Detail Sheet */}
      {selectedTransfer && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">{selectedTransfer.id}</SheetTitle>
              <SheetDescription>Tercatat pada {selectedTransfer.date}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={`ring-1 ${TRANSFER_STATUS_META[selectedTransfer.status].chip}`}>
                  {TRANSFER_STATUS_META[selectedTransfer.status].label}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block mb-0.5">Dari Akun Asal</span>
                  <p className="text-sm text-foreground font-semibold">
                    {selectedTransfer.fromAccountCode} - {selectedTransfer.fromAccountName}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block mb-0.5">Ke Akun Tujuan</span>
                  <p className="text-sm text-foreground font-semibold">
                    {selectedTransfer.toAccountCode} - {selectedTransfer.toAccountName}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Nominal Transfer</span>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {formatRupiah(selectedTransfer.amount)}
                  </span>
                </div>
                {selectedTransfer.note && (
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground block mb-0.5">Catatan</span>
                    <p className="text-sm text-muted-foreground font-medium">{selectedTransfer.note}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Journal entry preview */}
              <div className="rounded-lg border border-border p-3 text-xs bg-muted/20 space-y-1.5">
                <span className="font-semibold block text-foreground">Auto Journal Entry Preview:</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dr. Rekening Tujuan ({selectedTransfer.toAccountCode})</span>
                  <span className="font-mono">{formatRupiah(selectedTransfer.amount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-4">
                  <span>Cr. Rekening Asal ({selectedTransfer.fromAccountCode})</span>
                  <span className="font-mono">{formatRupiah(selectedTransfer.amount)}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
