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
import {
  type EquityType,
  EQUITY_TYPE_OPTIONS,
  EQUITY_TYPE_META,
} from "@/lib/equity-data"

export type EquityFormState = {
  type: EquityType
  investorName: string
  amount: number
  date: string
  note: string
}

interface EquityFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: EquityFormState
  onField: <K extends keyof EquityFormState>(
    key: K,
    value: EquityFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function EquityFormSheet({
  open,
  onOpenChange,
  form,
  onField,
  onSave,
}: EquityFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Input Transaksi Modal / Ekuitas</SheetTitle>
          <SheetDescription>
            Catat mutasi dana modal, prive, atau laba ditahan. Transaksi disetujui akan men-generate journal entry secara otomatis.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
            <Field>
              <FieldLabel htmlFor="eq-type">Jenis Transaksi</FieldLabel>
              <Select
                value={form.type}
                onValueChange={(val) => { if (val) onField("type", val as EquityType) }}
              >
                <SelectTrigger id="eq-type">
                  <SelectValue placeholder="Pilih Jenis Transaksi" />
                </SelectTrigger>
                <SelectContent>
                  {EQUITY_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="eq-investor">Pihak / Nama Pemilik</FieldLabel>
              <Input
                id="eq-investor"
                placeholder="E.g., Hendra Wijaya"
                value={form.investorName}
                onChange={(e) => onField("investorName", e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Tanggal Transaksi</FieldLabel>
              <DatePicker
                date={form.date ? parseIso(form.date) : undefined}
                onSelect={(date) => {
                  if (date) onField("date", toIsoDate(date))
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="eq-amount">Nominal Transaksi (Rp)</FieldLabel>
              <Input
                id="eq-amount"
                type="number"
                placeholder="0"
                value={form.amount || ""}
                onChange={(e) => onField("amount", Number(e.target.value))}
                required
                min="100000"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="eq-note">Keterangan / Catatan</FieldLabel>
              <Textarea
                id="eq-note"
                placeholder="Keterangan tambahan transaksi ekuitas..."
                value={form.note}
                onChange={(e) => onField("note", e.target.value)}
                className="min-h-24 resize-none"
              />
            </Field>

            <div className="bg-muted/40 rounded-lg p-3 border border-border text-xs text-muted-foreground leading-normal space-y-1">
              <span className="font-semibold block text-foreground mb-1">Preview Double-Entry (Auto):</span>
              <div className="flex justify-between font-mono">
                <span>Debit: {EQUITY_TYPE_META[form.type]?.drAccount}</span>
                <span>Kredit: {EQUITY_TYPE_META[form.type]?.crAccount}</span>
              </div>
              <span className="text-[10px] italic">*) Akun BCA (1112) dan Modal/Prive/Laba Ditahan di CoA.</span>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={!form.investorName || !form.amount}>
              Simpan Transaksi
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
