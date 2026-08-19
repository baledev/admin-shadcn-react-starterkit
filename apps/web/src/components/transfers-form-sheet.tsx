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
import { type Account } from "@/lib/accounts-data"

export type TransferFormState = {
  fromAccountCode: string
  toAccountCode: string
  amount: number
  date: string
  note: string
}

interface TransfersFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: TransferFormState
  accounts: Account[]
  onField: <K extends keyof TransferFormState>(
    key: K,
    value: TransferFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function TransfersFormSheet({
  open,
  onOpenChange,
  form,
  accounts,
  onField,
  onSave,
}: TransfersFormSheetProps) {
  const cashBankAccounts = React.useMemo(() => {
    return accounts.filter((acc) => acc.level === 3 && acc.parentCode === "1100" && acc.code.startsWith("111"))
  }, [accounts])

  const destinationAccounts = React.useMemo(() => {
    return cashBankAccounts.filter((acc) => acc.code !== form.fromAccountCode)
  }, [cashBankAccounts, form.fromAccountCode])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Mutasi Dana Antar Rekening</SheetTitle>
          <SheetDescription>
            Pindahkan saldo dana kas/bank internal perusahaan ke rekening/kas bank lain.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
            <Field>
              <FieldLabel htmlFor="trf-from">Dari Rekening / Kas</FieldLabel>
              <Select
                value={form.fromAccountCode}
                onValueChange={(val) => onField("fromAccountCode", val || "")}
              >
                <SelectTrigger id="trf-from">
                  <SelectValue placeholder="Pilih Rekening Asal" />
                </SelectTrigger>
                <SelectContent>
                  {cashBankAccounts.map((acc) => (
                    <SelectItem key={acc.code} value={acc.code}>
                      {acc.code} - {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="trf-to">Ke Rekening / Kas Tujuan</FieldLabel>
              <Select
                value={form.toAccountCode}
                onValueChange={(val) => onField("toAccountCode", val || "")}
                disabled={!form.fromAccountCode}
              >
                <SelectTrigger id="trf-to">
                  <SelectValue placeholder="Pilih Rekening Tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {destinationAccounts.map((acc) => (
                    <SelectItem key={acc.code} value={acc.code}>
                      {acc.code} - {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Tanggal Mutasi</FieldLabel>
              <DatePicker
                date={form.date ? parseIso(form.date) : undefined}
                onSelect={(date) => {
                  if (date) onField("date", toIsoDate(date))
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="trf-amount">Nominal Transfer (Rp)</FieldLabel>
              <Input
                id="trf-amount"
                type="number"
                placeholder="0"
                value={form.amount || ""}
                onChange={(e) => onField("amount", Number(e.target.value))}
                required
                min="1000"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="trf-note">Keterangan / Catatan</FieldLabel>
              <Textarea
                id="trf-note"
                placeholder="Tulis alasan mutasi rekening..."
                value={form.note}
                onChange={(e) => onField("note", e.target.value)}
                className="min-h-24 resize-none"
              />
            </Field>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={!form.fromAccountCode || !form.toAccountCode || !form.amount}>
              Simpan Transfer
            </Button>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Batal
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
