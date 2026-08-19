import * as React from "react"
import { IconPlus, IconTrash } from "@tabler/icons-react"
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
import { Separator } from "@workspace/ui/components/separator"
import { parseIso, toIsoDate } from "@/lib/date-utils"
import { type Account, formatRupiah } from "@/lib/accounts-data"

export type BillFormState = {
  vendorName: string
  vendorEmail: string
  issuedAt: string
  dueAt: string
  notes: string
  lines: {
    description: string
    accountCode: string
    qty: number
    unitPrice: number
  }[]
}

interface BillsFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: BillFormState
  accounts: Account[]
  onField: <K extends keyof BillFormState>(
    key: K,
    value: BillFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function BillsFormSheet({
  open,
  onOpenChange,
  form,
  accounts,
  onField,
  onSave,
}: BillsFormSheetProps) {
  // We want to list expense accounts for bill lines
  const expenseAccounts = React.useMemo(() => {
    return accounts.filter((acc) => acc.level === 3 && (acc.type === "expense" || acc.code.startsWith("12"))) // expense or fixed asset
  }, [accounts])

  // Calculate totals
  const { subtotal, tax, total } = React.useMemo(() => {
    const subtotal = form.lines.reduce(
      (sum, line) => sum + (line.qty * line.unitPrice || 0),
      0
    )
    const tax = Math.round(subtotal * 0.1) // 10% tax
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [form.lines])

  const handleLineChange = (
    index: number,
    field: "description" | "accountCode" | "qty" | "unitPrice",
    value: any
  ) => {
    const newLines = [...form.lines]
    newLines[index] = { ...newLines[index], [field]: value }
    onField("lines", newLines)
  }

  const addLine = () => {
    onField("lines", [
      ...form.lines,
      { description: "", accountCode: "", qty: 1, unitPrice: 0 },
    ])
  }

  const removeLine = (index: number) => {
    if (form.lines.length <= 1) return
    const newLines = form.lines.filter((_, idx) => idx !== index)
    onField("lines", newLines)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Catat Bill Vendor Baru (AP)</SheetTitle>
          <SheetDescription>
            Masukkan tagihan yang diterima dari vendor/supplier untuk dicatat sebagai hutang usaha.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col justify-between overflow-hidden mt-6"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-1">
            {/* Vendor Info */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="bill-vendor">Nama Vendor</FieldLabel>
                <Input
                  id="bill-vendor"
                  placeholder="E.g., Biznet, AWS"
                  value={form.vendorName}
                  onChange={(e) => onField("vendorName", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="bill-email">Email Vendor</FieldLabel>
                <Input
                  id="bill-email"
                  type="email"
                  placeholder="vendor@mail.com"
                  value={form.vendorEmail}
                  onChange={(e) => onField("vendorEmail", e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Tanggal Bill</FieldLabel>
                <DatePicker
                  date={form.issuedAt ? parseIso(form.issuedAt) : undefined}
                  onSelect={(date) => {
                    if (date) onField("issuedAt", toIsoDate(date))
                  }}
                />
              </Field>

              <Field>
                <FieldLabel>Tanggal Jatuh Tempo</FieldLabel>
                <DatePicker
                  date={form.dueAt ? parseIso(form.dueAt) : undefined}
                  onSelect={(date) => {
                    if (date) onField("dueAt", toIsoDate(date))
                  }}
                />
              </Field>
            </div>

            <Separator />

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Rincian Pembelian (Expense / Aset)</h4>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <IconPlus className="size-4 mr-1.5" />
                  Tambah Baris
                </Button>
              </div>

              <div className="space-y-3 rounded-lg border border-border p-3 bg-muted/20 max-h-[220px] overflow-y-auto">
                {form.lines.map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-start border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Deskripsi barang/jasa"
                        value={line.description}
                        onChange={(e) => handleLineChange(idx, "description", e.target.value)}
                        className="h-9 text-xs"
                        required
                      />

                      <Select
                        value={line.accountCode}
                        onValueChange={(val) => handleLineChange(idx, "accountCode", val)}
                      >
                        <SelectTrigger className="w-full text-xs h-8">
                          <SelectValue placeholder="Alokasi Akun Beban/Aset" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseAccounts.map((acc) => (
                            <SelectItem key={acc.code} value={acc.code} className="text-xs">
                              {acc.code} - {acc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-[70px]">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={line.qty || ""}
                        onChange={(e) => handleLineChange(idx, "qty", Number(e.target.value))}
                        className="h-9 text-xs text-right font-mono"
                        required
                        min="1"
                      />
                    </div>

                    <div className="w-[120px]">
                      <Input
                        type="number"
                        placeholder="Harga Satuan"
                        value={line.unitPrice || ""}
                        onChange={(e) => handleLineChange(idx, "unitPrice", Number(e.target.value))}
                        className="h-9 text-xs text-right font-mono"
                        required
                      />
                    </div>

                    {form.lines.length > 1 && (
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
            </div>

            {/* Calculations summaries */}
            <div className="bg-muted/40 p-4 rounded-lg border border-border space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PPN (10%)</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-foreground text-base">
                <span>Total Bill (Hutang)</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Notes */}
            <Field>
              <FieldLabel htmlFor="bill-notes">Catatan Tambahan</FieldLabel>
              <Textarea
                id="bill-notes"
                placeholder="Syarat pembayaran, nomor invoice fisik vendor, dll..."
                value={form.notes}
                onChange={(e) => onField("notes", e.target.value)}
                className="min-h-16 resize-none"
              />
            </Field>
          </div>

          <SheetFooter className="mt-auto border-t border-border pt-4">
            <SheetClose render={<Button type="button" variant="outline" />}>
              Batal
            </SheetClose>
            <Button type="submit" disabled={form.lines.some(l => !l.accountCode || !l.description)}>
              Simpan Bill
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
