import * as React from "react"
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
import { initialTeamMembers } from "@/lib/team-data"
import {
  type ExpenseCategory,
  EXPENSE_CATEGORY_OPTIONS,
} from "@/lib/expenses-finance-data"

export type ExpenseFormState = {
  employeeId: string
  category: ExpenseCategory
  date: string
  amount: number
  description: string
  receiptUrl: string
}

interface ExpensesFinanceFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: ExpenseFormState
  onField: <K extends keyof ExpenseFormState>(
    key: K,
    value: ExpenseFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function ExpensesFinanceFormSheet({
  open,
  onOpenChange,
  form,
  onField,
  onSave,
}: ExpensesFinanceFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Pengajuan Klaim Expense (Reimburse)</SheetTitle>
          <SheetDescription>
            Catat klaim pengeluaran pribadi karyawan yang akan diganti oleh perusahaan (Reimbursement).
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col justify-between overflow-hidden mt-6"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-1">
            {/* Karyawan Select */}
            <Field>
              <FieldLabel htmlFor="exp-employee">Karyawan</FieldLabel>
              <Select
                value={form.employeeId}
                onValueChange={(val) => onField("employeeId", val)}
              >
                <SelectTrigger id="exp-employee">
                  <SelectValue placeholder="Pilih Karyawan" />
                </SelectTrigger>
                <SelectContent>
                  {initialTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Kategori */}
            <Field>
              <FieldLabel htmlFor="exp-category">Kategori Pengeluaran</FieldLabel>
              <Select
                value={form.category}
                onValueChange={(val: ExpenseCategory) => onField("category", val)}
              >
                <SelectTrigger id="exp-category">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Date */}
            <Field>
              <FieldLabel>Tanggal Nota / Kwitansi</FieldLabel>
              <DatePicker
                date={form.date ? parseIso(form.date) : undefined}
                onSelect={(date) => {
                  if (date) onField("date", toIsoDate(date))
                }}
              />
            </Field>

            {/* Amount */}
            <Field>
              <FieldLabel htmlFor="exp-amount">Jumlah Nominal (Rp)</FieldLabel>
              <Input
                id="exp-amount"
                type="number"
                placeholder="0"
                value={form.amount || ""}
                onChange={(e) => onField("amount", Number(e.target.value))}
                required
                min="1000"
              />
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="exp-desc">Deskripsi Pengeluaran</FieldLabel>
              <Textarea
                id="exp-desc"
                placeholder="Tulis rincian pembelian barang/jasa..."
                value={form.description}
                onChange={(e) => onField("description", e.target.value)}
                className="min-h-16 resize-none"
                required
              />
            </Field>

            {/* Receipt URL / Placeholder file input */}
            <Field>
              <FieldLabel htmlFor="exp-receipt">Nota Fisik / Bukti Pembayaran (URL/Nama File)</FieldLabel>
              <Input
                id="exp-receipt"
                placeholder="E.g., /receipts/exp-006.jpg"
                value={form.receiptUrl}
                onChange={(e) => onField("receiptUrl", e.target.value)}
              />
            </Field>
          </div>

          <SheetFooter className="mt-auto border-t border-border pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </SheetClose>
            <Button type="submit" disabled={!form.employeeId || !form.amount || !form.description}>
              Ajukan Klaim
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
