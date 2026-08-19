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
import {
  type PaymentDirection,
  type PaymentMethod,
  PAYMENT_DIRECTION_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "@/lib/payments-data"

export type PaymentFormState = {
  direction: PaymentDirection
  partnerName: string
  amount: number
  date: string
  method: PaymentMethod
  accountCode: string
  reference: string
  note: string
}

interface PaymentsFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: PaymentFormState
  accounts: Account[]
  onField: <K extends keyof PaymentFormState>(
    key: K,
    value: PaymentFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function PaymentsFormSheet({
  open,
  onOpenChange,
  form,
  accounts,
  onField,
  onSave,
}: PaymentsFormSheetProps) {
  // Cash & Bank accounts list (Level 3 under 1110 subclass)
  const cashBankAccounts = React.useMemo(() => {
    return accounts.filter((acc) => acc.level === 3 && acc.parentCode === "1100" && acc.code.startsWith("111"))
  }, [accounts])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Pencatatan Transaksi Pembayaran</SheetTitle>
          <SheetDescription>
            Catat transaksi kas masuk/keluar operasional lainnya (settlement, penerimaan, biaya tak langsung).
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col justify-between overflow-hidden mt-6"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-1">
            {/* Direction */}
            <Field>
              <FieldLabel htmlFor="pmt-dir">Arah Aliran Dana</FieldLabel>
              <Select
                value={form.direction}
                onValueChange={(val: PaymentDirection) => onField("direction", val)}
              >
                <SelectTrigger id="pmt-dir">
                  <SelectValue placeholder="Pilih Arah Dana" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_DIRECTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Partner Name */}
            <Field>
              <FieldLabel htmlFor="pmt-partner">Mitra / Partner (Nama Klien/Vendor)</FieldLabel>
              <Input
                id="pmt-partner"
                placeholder="E.g., Alice Johnson, PLN"
                value={form.partnerName}
                onChange={(e) => onField("partnerName", e.target.value)}
                required
              />
            </Field>

            {/* Date */}
            <Field>
              <FieldLabel>Tanggal Pembayaran</FieldLabel>
              <DatePicker
                date={form.date ? parseIso(form.date) : undefined}
                onSelect={(date) => {
                  if (date) onField("date", toIsoDate(date))
                }}
              />
            </Field>

            {/* Cash/Bank Account */}
            <Field>
              <FieldLabel htmlFor="pmt-account">Akun Kas / Bank Pengirim/Penerima</FieldLabel>
              <Select
                value={form.accountCode}
                onValueChange={(val) => onField("accountCode", val)}
              >
                <SelectTrigger id="pmt-account">
                  <SelectValue placeholder="Pilih Akun Kas/Bank" />
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

            {/* Method */}
            <Field>
              <FieldLabel htmlFor="pmt-method">Metode Pembayaran</FieldLabel>
              <Select
                value={form.method}
                onValueChange={(val: PaymentMethod) => onField("method", val)}
              >
                <SelectTrigger id="pmt-method">
                  <SelectValue placeholder="Pilih Metode" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Amount */}
            <Field>
              <FieldLabel htmlFor="pmt-amount">Nominal Jumlah Pembayaran (Rp)</FieldLabel>
              <Input
                id="pmt-amount"
                type="number"
                placeholder="0"
                value={form.amount || ""}
                onChange={(e) => onField("amount", Number(e.target.value))}
                required
                min="1000"
              />
            </Field>

            {/* Reference */}
            <Field>
              <FieldLabel htmlFor="pmt-ref">Referensi Dokumen (E.g. No. Invoice / Memo)</FieldLabel>
              <Input
                id="pmt-ref"
                placeholder="E.g., INV-2026-001, BILL-002"
                value={form.reference}
                onChange={(e) => onField("reference", e.target.value)}
              />
            </Field>

            {/* Note */}
            <Field>
              <FieldLabel htmlFor="pmt-note">Catatan / Deskripsi Tambahan</FieldLabel>
              <Textarea
                id="pmt-note"
                placeholder="Detail informasi pembayaran..."
                value={form.note}
                onChange={(e) => onField("note", e.target.value)}
                className="min-h-16 resize-none"
              />
            </Field>
          </div>

          <SheetFooter className="mt-auto border-t border-border pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </SheetClose>
            <Button type="submit" disabled={!form.partnerName || !form.amount || !form.accountCode}>
              Simpan Pembayaran
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
