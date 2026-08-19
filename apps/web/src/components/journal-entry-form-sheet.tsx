import * as React from "react"
import { IconPlus, IconTrash, IconCheck, IconAlertTriangle } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@workspace/ui/components/sheet"
import { DatePicker } from "@workspace/ui/components/date-picker"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { parseIso, toIsoDate } from "@/lib/date-utils"
import { type Account, formatRupiah } from "@/lib/accounts-data"
import {
  type JournalType,
  JOURNAL_TYPE_OPTIONS,
} from "@/lib/journal-entries-data"

export type JournalEntryFormState = {
  date: string
  reference: string
  note: string
  type: JournalType
  lines: {
    accountCode: string
    description: string
    debit: number
    credit: number
  }[]
}

interface JournalEntryFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: JournalEntryFormState
  accounts: Account[]
  onField: <K extends keyof JournalEntryFormState>(
    key: K,
    value: JournalEntryFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function JournalEntryFormSheet({
  open,
  onOpenChange,
  form,
  accounts,
  onField,
  onSave,
}: JournalEntryFormSheetProps) {
  const level3Accounts = React.useMemo(() => {
    return accounts.filter((acc) => acc.level === 3)
  }, [accounts])

  const { totalDebit, totalCredit, isBalanced } = React.useMemo(() => {
    const totalDebit = form.lines.reduce((sum, line) => sum + (line.debit || 0), 0)
    const totalCredit = form.lines.reduce((sum, line) => sum + (line.credit || 0), 0)
    const isBalanced = totalDebit === totalCredit && totalDebit > 0
    return { totalDebit, totalCredit, isBalanced }
  }, [form.lines])

  const handleLineChange = (
    index: number,
    field: "accountCode" | "description" | "debit" | "credit",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    const newLines = [...form.lines]
    
    if (field === "debit" && value > 0) {
      newLines[index] = { ...newLines[index], [field]: value, credit: 0 }
    } else if (field === "credit" && value > 0) {
      newLines[index] = { ...newLines[index], [field]: value, debit: 0 }
    } else {
      newLines[index] = { ...newLines[index], [field]: value }
    }

    onField("lines", newLines)
  }

  const addLine = () => {
    onField("lines", [
      ...form.lines,
      { accountCode: "", description: "", debit: 0, credit: 0 },
    ])
  }

  const removeLine = (index: number) => {
    if (form.lines.length <= 2) return
    const newLines = form.lines.filter((_, idx) => idx !== index)
    onField("lines", newLines)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Input Jurnal Manual (Double-Entry)</SheetTitle>
          <SheetDescription>
            Catat transaksi keuangan secara manual langsung ke buku besar.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Tanggal</FieldLabel>
                <DatePicker
                  date={form.date ? parseIso(form.date) : undefined}
                  onSelect={(date) => {
                    if (date) onField("date", toIsoDate(date))
                  }}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="entry-type">Tipe Jurnal</FieldLabel>
                <Select
                  value={form.type}
                  onValueChange={(val) => { if (val) onField("type", val as JournalType) }}
                >
                  <SelectTrigger id="entry-type">
                    <SelectValue placeholder="Pilih Jurnal" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOURNAL_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="entry-ref">Referensi (ID/Kwitansi/No. Dokumen)</FieldLabel>
                <Input
                  id="entry-ref"
                  placeholder="E.g., INV-001, CASH-OUT-02"
                  value={form.reference}
                  onChange={(e) => onField("reference", e.target.value)}
                />
              </Field>

              <Field className="col-span-2">
                <FieldLabel htmlFor="entry-note">Catatan / Keterangan Jurnal</FieldLabel>
                <Textarea
                  id="entry-note"
                  placeholder="Deskripsi transaksi..."
                  value={form.note}
                  onChange={(e) => onField("note", e.target.value)}
                  className="min-h-16 resize-none"
                  required
                />
              </Field>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Daftar Akun Ledger (Baris Jurnal)</h4>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <IconPlus className="size-4 mr-1.5" />
                  Tambah Baris
                </Button>
              </div>

              <div className="space-y-3 rounded-lg border border-border p-3 bg-muted/20 max-h-[300px] overflow-y-auto">
                {form.lines.map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-start border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <div className="flex-1 space-y-2">
                      <Select
                        value={line.accountCode}
                        onValueChange={(val) => handleLineChange(idx, "accountCode", val)}
                      >
                        <SelectTrigger className="w-full text-xs h-9">
                          <SelectValue placeholder="Pilih Akun" />
                        </SelectTrigger>
                        <SelectContent>
                          {level3Accounts.map((acc) => (
                            <SelectItem key={acc.code} value={acc.code} className="text-xs">
                              {acc.code} - {acc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Catatan baris (opsional)"
                        value={line.description}
                        onChange={(e) => handleLineChange(idx, "description", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="w-[120px]">
                      <Input
                        type="number"
                        placeholder="Debet"
                        value={line.debit || ""}
                        onChange={(e) => handleLineChange(idx, "debit", Number(e.target.value))}
                        className="h-9 text-xs text-right font-mono"
                      />
                    </div>

                    <div className="w-[120px]">
                      <Input
                        type="number"
                        placeholder="Kredit"
                        value={line.credit || ""}
                        onChange={(e) => handleLineChange(idx, "credit", Number(e.target.value))}
                        className="h-9 text-xs text-right font-mono"
                      />
                    </div>

                    {form.lines.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 text-destructive hover:bg-destructive/15 mt-0 shrink-0"
                        onClick={() => removeLine(idx)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    {isBalanced ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <IconCheck className="size-4" /> Balanced
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center gap-1">
                        <IconAlertTriangle className="size-4" /> Unbalanced
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Debit & Kredit harus bernilai sama dan lebih dari Rp 0.
                  </div>
                </div>

                <div className="text-right space-y-1 font-mono text-xs">
                  <div>Debet: <span className="font-semibold tabular-nums text-foreground">{formatRupiah(totalDebit)}</span></div>
                  <div>Kredit: <span className="font-semibold tabular-nums text-foreground">{formatRupiah(totalCredit)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={!isBalanced || form.lines.some(l => !l.accountCode)}>
              Post Jurnal
            </Button>
            <SheetClose render={<Button type="button" variant="outline" />}>
              Batal
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
