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
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  type Account,
  type AccountType,
  ACCOUNT_TYPE_OPTIONS,
} from "@/lib/accounts-data"

export type AccountFormState = {
  code: string
  name: string
  type: AccountType
  parentCode: string
  balance: number
  description: string
}

interface AccountsFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  form: AccountFormState
  accounts: Account[]
  onField: <K extends keyof AccountFormState>(
    key: K,
    value: AccountFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function AccountsFormSheet({
  open,
  onOpenChange,
  isEditing,
  form,
  accounts,
  onField,
  onSave,
}: AccountsFormSheetProps) {
  // Filter accounts of level 2 matching the selected type to be parents
  const parentOptions = React.useMemo(() => {
    return accounts.filter((acc) => acc.level === 2 && acc.type === form.type)
  }, [accounts, form.type])

  // Auto-generate code prefix based on selected parent if not editing
  React.useEffect(() => {
    if (!isEditing && form.parentCode && !form.code.startsWith(form.parentCode)) {
      // Find children of this parent to propose next available suffix
      const children = accounts.filter(
        (acc) => acc.parentCode === form.parentCode && acc.level === 3
      )
      const nextNum = children.length + 1
      const suffix = nextNum.toString().padStart(2, "0") // e.g. "01", "02"
      
      // Propose code: parentCode + next index (e.g. 1111, 1112)
      // Since our static codes are like "1111", "1112", we can just do parentCode + index, or parentCode's prefix + next.
      // E.g. parent "1100" (Aset Lancar) -> children "1111" (Kas), "1112" (BCA), "1113" (BRI), next could be 1110 + nextNum or simply parentCode without trailing zeros.
      // Let's do: if parent is 1100, code prefix can be "111" or "112" etc.
      // Better yet, just let the user input the full code but prefill with parentCode.
      if (form.parentCode === "1100") {
        onField("code", "11" + (children.length + 1).toString().padStart(2, "0"))
      } else if (form.parentCode === "1200") {
        onField("code", "12" + (children.length + 3).toString().padStart(2, "0")) // vehicular, equipment codes
      } else {
        onField("code", form.parentCode.slice(0, 3) + nextNum)
      }
    }
  }, [form.parentCode, isEditing])

  // When type changes, clear parentCode so user selects a valid parent
  const handleTypeChange = (value: AccountType) => {
    onField("type", value)
    const validParents = accounts.filter((acc) => acc.level === 2 && acc.type === value)
    if (validParents.length > 0) {
      onField("parentCode", validParents[0].code)
    } else {
      onField("parentCode", "")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Ubah Akun (CoA)" : "Tambah Akun Baru (CoA)"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Ubah informasi detail akun Chart of Accounts."
              : "Tambahkan akun level 3 baru ke dalam Chart of Accounts."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col justify-between overflow-hidden mt-6"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-1">
            {/* Tipe Akun */}
            <Field>
              <FieldLabel htmlFor="account-type">Tipe Akun</FieldLabel>
              <Select
                value={form.type}
                onValueChange={handleTypeChange}
                disabled={isEditing}
              >
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Pilih Tipe Akun" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Parent Account (Level 2) */}
            <Field>
              <FieldLabel htmlFor="account-parent">Sub-Grup Induk (Level 2)</FieldLabel>
              <Select
                value={form.parentCode}
                onValueChange={(val) => onField("parentCode", val)}
                disabled={isEditing}
              >
                <SelectTrigger id="account-parent">
                  <SelectValue placeholder="Pilih Sub-Grup Induk" />
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((parent) => (
                    <SelectItem key={parent.code} value={parent.code}>
                      {parent.code} - {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Kode Akun */}
            <Field>
              <FieldLabel htmlFor="account-code">Kode Akun</FieldLabel>
              <Input
                id="account-code"
                placeholder="E.g., 1114"
                value={form.code}
                onChange={(e) => onField("code", e.target.value)}
                disabled={isEditing}
                className="font-mono"
                required
              />
            </Field>

            {/* Nama Akun */}
            <Field>
              <FieldLabel htmlFor="account-name">Nama Akun</FieldLabel>
              <Input
                id="account-name"
                placeholder="E.g., Bank Mandiri Mandek"
                value={form.name}
                onChange={(e) => onField("name", e.target.value)}
                required
              />
            </Field>

            {/* Saldo Awal */}
            <Field>
              <FieldLabel htmlFor="account-balance">Saldo Awal</FieldLabel>
              <Input
                id="account-balance"
                type="number"
                placeholder="0"
                value={form.balance || ""}
                onChange={(e) => onField("balance", Number(e.target.value))}
                disabled={isEditing} // saldo awal diset di awal saja, setelah itu lewat Journal Entry
              />
            </Field>

            {/* Deskripsi */}
            <Field>
              <FieldLabel htmlFor="account-description">Deskripsi</FieldLabel>
              <Textarea
                id="account-description"
                placeholder="Catatan tambahan mengenai akun ini..."
                value={form.description}
                onChange={(e) => onField("description", e.target.value)}
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
            <Button type="submit">Simpan</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
