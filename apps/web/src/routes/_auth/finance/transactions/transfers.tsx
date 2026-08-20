import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { TransfersDataTable } from "@/components/transfers-data-table"
import {
  type Transfer,
  initialTransfers,
  TRANSFER_STATUS_META,
} from "@/lib/transfers-data"
import {
  TransfersFormSheet,
  type TransferFormState,
} from "@/components/transfers-form-sheet"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { IconPlus } from "@tabler/icons-react"
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
  const [selectedTransfer, setSelectedTransfer] =
    React.useState<Transfer | null>(null)
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

    const fromAcc = initialAccounts.find(
      (a) => a.code === formState.fromAccountCode
    )
    const toAcc = initialAccounts.find(
      (a) => a.code === formState.toAccountCode
    )
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
      transfers.map((t) =>
        t.id === transfer.id ? { ...t, status: "completed" as const } : t
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Mutasi Dana Antar Kas & Rekening (Transfers)
          </h2>
          <p className="text-sm text-muted-foreground">
            Catat pemindahan saldo operasional dari kas kecil ke bank, penarikan
            tunai, maupun transfer antar rekening bank internal.
          </p>
        </div>
        <Button size="sm" onClick={handleAddTransfer}>
          <IconPlus className="mr-2 size-4" />
          Transfer Dana Baru
        </Button>
      </div>

      <TransfersDataTable
        data={transfers}
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
          <SheetContent className="flex h-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">
                {selectedTransfer.id}
              </SheetTitle>
              <SheetDescription>
                Tercatat pada {selectedTransfer.date}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`ring-1 ${TRANSFER_STATUS_META[selectedTransfer.status].chip}`}
                >
                  {TRANSFER_STATUS_META[selectedTransfer.status].label}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Dari Akun Asal
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedTransfer.fromAccountCode} -{" "}
                    {selectedTransfer.fromAccountName}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Ke Akun Tujuan
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedTransfer.toAccountCode} -{" "}
                    {selectedTransfer.toAccountName}
                  </p>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Nominal Transfer
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {formatRupiah(selectedTransfer.amount)}
                  </span>
                </div>
                {selectedTransfer.note && (
                  <div className="col-span-2">
                    <span className="mb-0.5 block text-xs text-muted-foreground">
                      Catatan
                    </span>
                    <p className="text-sm font-medium text-muted-foreground">
                      {selectedTransfer.note}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Journal entry preview */}
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                <span className="block font-semibold text-foreground">
                  Auto Journal Entry Preview:
                </span>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Dr. Rekening Tujuan ({selectedTransfer.toAccountCode})
                  </span>
                  <span className="font-mono">
                    {formatRupiah(selectedTransfer.amount)}
                  </span>
                </div>
                <div className="flex justify-between pl-4 text-muted-foreground">
                  <span>
                    Cr. Rekening Asal ({selectedTransfer.fromAccountCode})
                  </span>
                  <span className="font-mono">
                    {formatRupiah(selectedTransfer.amount)}
                  </span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
