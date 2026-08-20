import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { ExpensesFinanceDataTable } from "@/components/expenses-finance-data-table"
import {
  type Expense,
  initialExpenses,
  EXPENSE_STATUS_META,
  EXPENSE_CATEGORY_META,
} from "@/lib/expenses-finance-data"
import {
  ExpensesFinanceFormSheet,
  type ExpenseFormState,
} from "@/components/expenses-finance-form-sheet"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { formatRupiah } from "@/lib/accounts-data"
import { initialTeamMembers } from "@/lib/team-data"
import { IconExternalLink, IconPlus } from "@tabler/icons-react"

export const Route = createFileRoute("/_auth/finance/transactions/expenses")({
  component: FinanceExpensesPage,
})

function FinanceExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses)
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(
    null
  )
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const [formState, setFormState] = React.useState<ExpenseFormState>({
    employeeId: "",
    category: "travel",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    description: "",
    receiptUrl: "",
  })

  const handleField = <K extends keyof ExpenseFormState>(
    key: K,
    value: ExpenseFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleViewDetail = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDetailOpen(true)
  }

  const handleAddExpense = () => {
    setFormState({
      employeeId: "",
      category: "travel",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      description: "",
      receiptUrl: "",
    })
    setIsFormOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const member = initialTeamMembers.find((m) => m.id === formState.employeeId)
    if (!member) return

    const newExpense: Expense = {
      id: `EXP-2026-0${expenses.length + 1}`,
      employeeName: member.name,
      employeeEmail: `${member.name.toLowerCase().replace(" ", "")}@company.com`,
      category: formState.category,
      date: formState.date,
      description: formState.description,
      amount: formState.amount,
      status: "submitted",
      receiptUrl: formState.receiptUrl,
    }

    setExpenses([newExpense, ...expenses])
    setIsFormOpen(false)
  }

  const handleApproveExpense = (expense: Expense) => {
    setExpenses(
      expenses.map((e) =>
        e.id === expense.id ? { ...e, status: "approved" as const } : e
      )
    )
  }

  const handleReimburseExpense = (expense: Expense) => {
    setExpenses(
      expenses.map((e) =>
        e.id === expense.id ? { ...e, status: "reimbursed" as const } : e
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Klaim Pengeluaran Karyawan (Reimbursements)
          </h2>
          <p className="text-sm text-muted-foreground">
            Catat dan bayar klaim biaya kantor, bensin, konsumsi meeting klien,
            dll yang diajukan karyawan.
          </p>
        </div>
        <Button size="sm" onClick={handleAddExpense}>
          <IconPlus className="mr-2 size-4" />
          Klaim Expense
        </Button>
      </div>

      <ExpensesFinanceDataTable
        data={expenses}
        onViewDetail={handleViewDetail}
        onApproveExpense={handleApproveExpense}
        onReimburseExpense={handleReimburseExpense}
      />

      <ExpensesFinanceFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={formState}
        onField={handleField}
        onSave={handleSave}
      />

      {/* Detail Sheet */}
      {selectedExpense && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="flex h-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">
                {selectedExpense.id}
              </SheetTitle>
              <SheetDescription>
                Klaim diajukan pada {selectedExpense.date}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`ring-1 ${EXPENSE_STATUS_META[selectedExpense.status].chip}`}
                >
                  {EXPENSE_STATUS_META[selectedExpense.status].label}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Karyawan</h4>
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium text-foreground">
                    {selectedExpense.employeeName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedExpense.employeeEmail}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Kategori
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {EXPENSE_CATEGORY_META[selectedExpense.category].label}
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Jumlah Nominal
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {formatRupiah(selectedExpense.amount)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Keterangan Nota
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {selectedExpense.description}
                  </p>
                </div>
              </div>

              {selectedExpense.receiptUrl && (
                <div>
                  <span className="mb-1 block text-xs text-muted-foreground">
                    Nota Fisik / Bukti
                  </span>
                  <a
                    href={selectedExpense.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Lihat Lampiran File
                    <IconExternalLink className="size-3.5" />
                  </a>
                </div>
              )}

              <Separator />

              {/* Journal entry preview */}
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                <span className="block font-semibold text-foreground">
                  Auto Journal Entry Preview:
                </span>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Dr. Beban{" "}
                    {EXPENSE_CATEGORY_META[selectedExpense.category].label} (
                    {
                      EXPENSE_CATEGORY_META[selectedExpense.category]
                        .accountCode
                    }
                    )
                  </span>
                  <span className="font-mono">
                    {formatRupiah(selectedExpense.amount)}
                  </span>
                </div>
                <div className="flex justify-between pl-4 text-muted-foreground">
                  {selectedExpense.status === "reimbursed" ? (
                    <>
                      <span>Cr. Kas Tunai / Bank (1111/1112)</span>
                      <span className="font-mono">
                        {formatRupiah(selectedExpense.amount)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Cr. Hutang Reimbursement (2120)</span>
                      <span className="font-mono">
                        {formatRupiah(selectedExpense.amount)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
