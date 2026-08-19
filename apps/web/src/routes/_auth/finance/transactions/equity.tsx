import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { EquityDataTable } from "@/components/equity-data-table"
import {
  type EquityTransaction,
  initialEquityTransactions,
  EQUITY_STATUS_META,
  EQUITY_TYPE_META,
} from "@/lib/equity-data"
import { EquityFormSheet, type EquityFormState } from "@/components/equity-form-sheet"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { formatRupiah } from "@/lib/accounts-data"

export const Route = createFileRoute("/_auth/finance/transactions/equity")({
  component: EquityPage,
})

function EquityPage() {
  const [transactions, setTransactions] = React.useState<EquityTransaction[]>(initialEquityTransactions)
  const [selectedTx, setSelectedTx] = React.useState<EquityTransaction | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const [formState, setFormState] = React.useState<EquityFormState>({
    type: "capital_addition",
    investorName: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    note: "",
  })

  const handleField = <K extends keyof EquityFormState>(
    key: K,
    value: EquityFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleViewDetail = (tx: EquityTransaction) => {
    setSelectedTx(tx)
    setIsDetailOpen(true)
  }

  const handleAddTransaction = () => {
    setFormState({
      type: "capital_addition",
      investorName: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      note: "",
    })
    setIsFormOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const newTx: EquityTransaction = {
      id: `EQT-2026-0${transactions.length + 1}`,
      type: formState.type,
      investorName: formState.investorName,
      amount: formState.amount,
      date: formState.date,
      status: "approved", // default approved directly
      note: formState.note,
    }

    setTransactions([newTx, ...transactions])
    setIsFormOpen(false)
  }

  const handleApproveTransaction = (tx: EquityTransaction) => {
    setTransactions(
      transactions.map((t) => (t.id === tx.id ? { ...t, status: "approved" as const } : t))
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Transaksi Modal & Struktur Ekuitas (Equity)</h3>
        <p className="text-sm text-muted-foreground">Catat modal awal pendirian, penambahan modal pemilik, penarikan prive pribadi, serta distribusi laba ditahan.</p>
      </div>

      <EquityDataTable
        data={transactions}
        onAddTransaction={handleAddTransaction}
        onViewDetail={handleViewDetail}
        onApproveTransaction={handleApproveTransaction}
      />

      <EquityFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={formState}
        onField={handleField}
        onSave={handleSave}
      />

      {/* Detail Sheet */}
      {selectedTx && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">{selectedTx.id}</SheetTitle>
              <SheetDescription>Tercatat pada {selectedTx.date}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={`ring-1 ${EQUITY_STATUS_META[selectedTx.status].chip}`}>
                  {EQUITY_STATUS_META[selectedTx.status].label}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Jenis Transaksi</span>
                  <Badge variant="outline" className={`ring-1 ${EQUITY_TYPE_META[selectedTx.type].chip}`}>
                    {EQUITY_TYPE_META[selectedTx.type].label}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Nominal Transaksi</span>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {formatRupiah(selectedTx.amount)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block mb-0.5">Pihak / Pemilik</span>
                  <p className="text-sm text-foreground font-semibold">{selectedTx.investorName}</p>
                </div>
                {selectedTx.note && (
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground block mb-0.5">Keterangan</span>
                    <p className="text-sm text-muted-foreground font-medium">{selectedTx.note}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Journal entry preview */}
              <div className="rounded-lg border border-border p-3 text-xs bg-muted/20 space-y-1.5">
                <span className="font-semibold block text-foreground">Auto Journal Entry Preview:</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dr. Akun ({EQUITY_TYPE_META[selectedTx.type].drAccount})</span>
                  <span className="font-mono">{formatRupiah(selectedTx.amount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-4">
                  <span>Cr. Akun ({EQUITY_TYPE_META[selectedTx.type].crAccount})</span>
                  <span className="font-mono">{formatRupiah(selectedTx.amount)}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
