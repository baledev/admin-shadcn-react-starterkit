import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { ExpensesFinanceDataTable } from "@/components/expenses-finance-data-table"
import {
  type Expense,
  initialExpenses,
  EXPENSE_STATUS_META,
  EXPENSE_CATEGORY_META,
} from "@/lib/expenses-finance-data"
import { ExpensesFinanceFormSheet, type ExpenseFormState } from "@/components/expenses-finance-form-sheet"
import { Badge } from "@workspace/ui/components/badge"
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
import { IconExternalLink } from "@tabler/icons-react"

export const Route = createFileRoute("/_auth/finance/transactions/expenses")({
  component: FinanceExpensesPage,
})

function FinanceExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses)
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null)
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
      expenses.map((e) => (e.id === expense.id ? { ...e, status: "approved" as const } : e))
    )
  }

  const handleReimburseExpense = (expense: Expense) => {
    setExpenses(
      expenses.map((e) => (e.id === expense.id ? { ...e, status: "reimbursed" as const } : e))
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Klaim Pengeluaran Karyawan (Reimbursements)</h3>
        <p className="text-sm text-muted-foreground">Catat dan bayar klaim biaya kantor, bensin, konsumsi meeting klien, dll yang diajukan karyawan.</p>
      </div>

      <ExpensesFinanceDataTable
        data={expenses}
        onAddExpense={handleAddExpense}
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
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">{selectedExpense.id}</SheetTitle>
              <SheetDescription>Klaim diajukan pada {selectedExpense.date}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={`ring-1 ${EXPENSE_STATUS_META[selectedExpense.status].chip}`}>
                  {EXPENSE_STATUS_META[selectedExpense.status].label}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Karyawan</h4>
                <div className="text-sm bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">{selectedExpense.employeeName}</p>
                  <p className="text-muted-foreground text-xs">{selectedExpense.employeeEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Kategori</span>
                  <span className="text-sm font-semibold text-foreground">
                    {EXPENSE_CATEGORY_META[selectedExpense.category].label}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Jumlah Nominal</span>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {formatRupiah(selectedExpense.amount)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block mb-0.5">Keterangan Nota</span>
                  <p className="text-sm text-foreground font-medium">{selectedExpense.description}</p>
                </div>
              </div>

              {selectedExpense.receiptUrl && (
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Nota Fisik / Bukti</span>
                  <a
                    href={selectedExpense.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                  >
                    Lihat Lampiran File
                    <IconExternalLink className="size-3.5" />
                  </a>
                </div>
              )}

              <Separator />

              {/* Journal entry preview */}
              <div className="rounded-lg border border-border p-3 text-xs bg-muted/20 space-y-1.5">
                <span className="font-semibold block text-foreground">Auto Journal Entry Preview:</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dr. Beban {EXPENSE_CATEGORY_META[selectedExpense.category].label} ({EXPENSE_CATEGORY_META[selectedExpense.category].accountCode})</span>
                  <span className="font-mono">{formatRupiah(selectedExpense.amount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-4">
                  {selectedExpense.status === "reimbursed" ? (
                    <>
                      <span>Cr. Kas Tunai / Bank (1111/1112)</span>
                      <span className="font-mono">{formatRupiah(selectedExpense.amount)}</span>
                    </>
                  ) : (
                    <>
                      <span>Cr. Hutang Reimbursement (2120)</span>
                      <span className="font-mono">{formatRupiah(selectedExpense.amount)}</span>
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
