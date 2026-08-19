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

export type KasbonFormState = {
  employeeId: string
  date: string
  amount: number
  purpose: string
  notes: string
}

interface KasbonFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: KasbonFormState
  onField: <K extends keyof KasbonFormState>(
    key: K,
    value: KasbonFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function KasbonFormSheet({
  open,
  onOpenChange,
  form,
  onField,
  onSave,
}: KasbonFormSheetProps) {
  // Find selected employee details to set name/email automatically on save
  const handleEmployeeChange = (id: string) => {
    onField("employeeId", id)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Pengajuan Kasbon Karyawan</SheetTitle>
          <SheetDescription>
            Ajukan kasbon/pinjaman untuk karyawan. Transaksi ini akan tercatat sebagai Piutang Karyawan.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col justify-between overflow-hidden mt-6"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-1">
            {/* Employee Select */}
            <Field>
              <FieldLabel htmlFor="kasbon-employee">Karyawan</FieldLabel>
              <Select value={form.employeeId} onValueChange={handleEmployeeChange}>
                <SelectTrigger id="kasbon-employee">
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

            {/* Date */}
            <Field>
              <FieldLabel>Tanggal Pengajuan</FieldLabel>
              <DatePicker
                date={form.date ? parseIso(form.date) : undefined}
                onSelect={(date) => {
                  if (date) onField("date", toIsoDate(date))
                }}
              />
            </Field>

            {/* Amount */}
            <Field>
              <FieldLabel htmlFor="kasbon-amount">Jumlah Kasbon (Rp)</FieldLabel>
              <Input
                id="kasbon-amount"
                type="number"
                placeholder="0"
                value={form.amount || ""}
                onChange={(e) => onField("amount", Number(e.target.value))}
                required
                min="50000"
              />
            </Field>

            {/* Purpose */}
            <Field>
              <FieldLabel htmlFor="kasbon-purpose">Keperluan / Tujuan</FieldLabel>
              <Input
                id="kasbon-purpose"
                placeholder="E.g., Perbaikan kendaraan operasional, berobat"
                value={form.purpose}
                onChange={(e) => onField("purpose", e.target.value)}
                required
              />
            </Field>

            {/* Notes */}
            <Field>
              <FieldLabel htmlFor="kasbon-notes">Catatan Persetujuan / Tenor</FieldLabel>
              <Textarea
                id="kasbon-notes"
                placeholder="E.g., Dicicil 5 bulan @ Rp 200.000 potong gaji"
                value={form.notes}
                onChange={(e) => onField("notes", e.target.value)}
                className="min-h-24 resize-none"
              />
            </Field>
          </div>

          <SheetFooter className="mt-auto border-t border-border pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </SheetClose>
            <Button type="submit" disabled={!form.employeeId || !form.amount || !form.purpose}>
              Simpan Pengajuan
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
