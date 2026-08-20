import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { PageHeader } from "@/components/page-header"
import { AccountsDataTable } from "@/components/accounts-data-table"
import {
  AccountsFormSheet,
  type AccountFormState,
} from "@/components/accounts-form-sheet"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
  type Account,
  initialAccounts,
  computeAccountBalances,
} from "@/lib/accounts-data"

export const Route = createFileRoute("/_auth/finance/chart-of-accounts")({
  component: ChartOfAccountsPage,
})

function ChartOfAccountsPage() {
  const [accounts, setAccounts] = React.useState<Account[]>(() =>
    computeAccountBalances(initialAccounts)
  )

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [pendingDelete, setPendingDelete] = React.useState<Account | null>(null)

  const [formState, setFormState] = React.useState<AccountFormState>({
    code: "",
    name: "",
    type: "asset",
    parentCode: "",
    balance: 0,
    description: "",
  })

  const handleField = <K extends keyof AccountFormState>(
    key: K,
    value: AccountFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddAccount = () => {
    setIsEditing(false)
    setFormState({
      code: "",
      name: "",
      type: "asset",
      parentCode: "1100", // Default to Aktiva Lancar
      balance: 0,
      description: "",
    })
    setIsFormOpen(true)
  }

  const handleEditAccount = (account: Account) => {
    setIsEditing(true)
    setFormState({
      code: account.code,
      name: account.name,
      type: account.type,
      parentCode: account.parentCode || "",
      balance: account.balance,
      description: account.description || "",
    })
    setIsFormOpen(true)
  }

  const handleDeleteAccount = (account: Account) => {
    setPendingDelete(account)
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    setAccounts(accounts.filter((acc) => acc.code !== pendingDelete.code))
    setPendingDelete(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      const updated = accounts.map((acc) =>
        acc.code === formState.code
          ? {
              ...acc,
              name: formState.name,
              description: formState.description,
            }
          : acc
      )
      setAccounts(computeAccountBalances(updated))
    } else {
      const newAcc: Account = {
        code: formState.code,
        name: formState.name,
        type: formState.type,
        level: 3,
        parentCode: formState.parentCode,
        balance: formState.balance,
        description: formState.description,
      }

      // Prohibit duplicate code
      if (accounts.some((acc) => acc.code === newAcc.code)) {
        alert("Kode akun sudah terpakai!")
        return
      }

      setAccounts(computeAccountBalances([...accounts, newAcc]))
    }

    setIsFormOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Chart of Accounts (CoA)"
            description="Bagan Akun standar keuangan akuntansi perusahaan 3 level (Kelompok Utama, Sub-Grup, Buku Besar)."
          >
            <Button size="sm" onClick={handleAddAccount}>
              <IconPlus className="mr-2 size-4" />
              Tambah Akun
            </Button>
          </PageHeader>

          <AccountsDataTable
            data={accounts}
            onEditAccount={handleEditAccount}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>

      <AccountsFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        isEditing={isEditing}
        form={formState}
        accounts={accounts}
        onField={handleField}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Hapus Akun?"
        description={
          <>
            Akun{" "}
            <span className="font-semibold text-foreground">
              {pendingDelete?.code} - {pendingDelete?.name}
            </span>{" "}
            akan dihapus dari Bagan Akun. Tindakan ini tidak dapat dibatalkan.
          </>
        }
        confirmLabel="Hapus Akun"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
