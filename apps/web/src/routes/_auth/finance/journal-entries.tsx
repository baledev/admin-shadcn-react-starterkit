import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { JournalEntryDataTable } from "@/components/journal-entry-data-table"
import { JournalEntryDetailSheet } from "@/components/journal-entry-detail-sheet"
import { JournalEntryFormSheet, type JournalEntryFormState } from "@/components/journal-entry-form-sheet"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
  type JournalEntry,
  initialJournalEntries,
} from "@/lib/journal-entries-data"
import { initialAccounts } from "@/lib/accounts-data"

export const Route = createFileRoute("/_auth/finance/journal-entries")({
  component: JournalEntriesPage,
})

function JournalEntriesPage() {
  const [entries, setEntries] = React.useState<JournalEntry[]>(initialJournalEntries)
  const [selectedEntry, setSelectedEntry] = React.useState<JournalEntry | null>(null)
  
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [pendingCancel, setPendingCancel] = React.useState<JournalEntry | null>(null)

  const [formState, setFormState] = React.useState<JournalEntryFormState>({
    date: new Date().toISOString().split("T")[0],
    reference: "",
    note: "",
    type: "general",
    lines: [
      { accountCode: "", description: "", debit: 0, credit: 0 },
      { accountCode: "", description: "", debit: 0, credit: 0 },
    ],
  })

  const handleField = <K extends keyof JournalEntryFormState>(
    key: K,
    value: JournalEntryFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddEntry = () => {
    setFormState({
      date: new Date().toISOString().split("T")[0],
      reference: "",
      note: "",
      type: "general",
      lines: [
        { accountCode: "", description: "", debit: 0, credit: 0 },
        { accountCode: "", description: "", debit: 0, credit: 0 },
      ],
    })
    setIsFormOpen(true)
  }

  const handleViewDetail = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setIsDetailOpen(true)
  }

  const handleCancelEntry = (entry: JournalEntry) => {
    setPendingCancel(entry)
  }

  const handleConfirmCancel = () => {
    if (!pendingCancel) return
    setEntries(
      entries.map((e) =>
        e.id === pendingCancel.id ? { ...e, status: "cancelled" as const } : e
      )
    )
    setPendingCancel(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const totalDebit = formState.lines.reduce((sum, l) => sum + (l.debit || 0), 0)
    const totalCredit = formState.lines.reduce((sum, l) => sum + (l.credit || 0), 0)

    const formattedLines = formState.lines.map((line) => {
      const acc = initialAccounts.find((a) => a.code === line.accountCode)
      return {
        accountCode: line.accountCode,
        accountName: acc ? acc.name : "Akun Terhapus",
        description: line.description,
        debit: line.debit,
        credit: line.credit,
      }
    })

    const newEntry: JournalEntry = {
      id: `JV-2026-00${entries.length + 1}`,
      date: formState.date,
      reference: formState.reference,
      note: formState.note,
      type: formState.type,
      status: "posted",
      lines: formattedLines,
      totalDebit,
      totalCredit,
    }

    setEntries([newEntry, ...entries])
    setIsFormOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Journal Entries (Buku Besar)"
            description="Daftar pos jurnal umum transaksi keuangan perusahaan untuk pembukuan double-entry balanced."
          />

          <div className="rounded-xl border border-border bg-card p-4">
            <JournalEntryDataTable
              data={entries}
              onAddEntry={handleAddEntry}
              onViewDetail={handleViewDetail}
              onCancelEntry={handleCancelEntry}
            />
          </div>
        </div>
      </div>

      <JournalEntryDetailSheet
        entry={selectedEntry}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <JournalEntryFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={formState}
        accounts={initialAccounts}
        onField={handleField}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={pendingCancel !== null}
        onOpenChange={(open) => {
          if (!open) setPendingCancel(null)
        }}
        title="Batalkan Jurnal Entry?"
        description={
          <>
            Jurnal entry <span className="font-semibold text-foreground">{pendingCancel?.id}</span> akan dibatalkan (void). Saldo tidak akan terhitung lagi di buku besar.
          </>
        }
        confirmLabel="Batalkan Jurnal"
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
