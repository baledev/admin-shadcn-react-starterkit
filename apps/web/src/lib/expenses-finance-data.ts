// ─── Types ────────────────────────────────────────────────────────────────────

export type ExpenseStatus =
  "draft" | "submitted" | "approved" | "reimbursed" | "rejected"
export type ExpenseCategory =
  "travel" | "meals" | "office" | "marketing" | "other"

export type Expense = {
  id: string // "EXP-2026-001"
  employeeName: string
  employeeEmail: string
  category: ExpenseCategory
  date: string // ISO date string
  description: string
  amount: number
  status: ExpenseStatus
  receiptUrl?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const EXPENSE_STATUS_META: Record<
  ExpenseStatus,
  { label: string; chip: string }
> = {
  draft: {
    label: "Draft",
    chip: "bg-muted text-muted-foreground ring-border",
  },
  submitted: {
    label: "Diajukan",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300",
  },
  approved: {
    label: "Disetujui",
    chip: "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:bg-violet-400/15 dark:text-violet-300",
  },
  reimbursed: {
    label: "Dibayar",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  rejected: {
    label: "Ditolak",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const EXPENSE_CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; accountCode: string }
> = {
  travel: { label: "Perjalanan Dinas", accountCode: "5240" },
  meals: { label: "Konsumsi / Makan", accountCode: "5200" },
  office: { label: "Keperluan Kantor", accountCode: "5230" },
  marketing: { label: "Iklan & Pemasaran", accountCode: "5200" },
  other: { label: "Lain-lain", accountCode: "5200" },
}

export const EXPENSE_STATUS_OPTIONS: { value: ExpenseStatus; label: string }[] =
  [
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Diajukan" },
    { value: "approved", label: "Disetujui" },
    { value: "reimbursed", label: "Dibayar" },
    { value: "rejected", label: "Ditolak" },
  ]

export const EXPENSE_CATEGORY_OPTIONS: {
  value: ExpenseCategory
  label: string
}[] = [
  { value: "travel", label: "Perjalanan Dinas" },
  { value: "meals", label: "Konsumsi / Makan" },
  { value: "office", label: "Keperluan Kantor" },
  { value: "marketing", label: "Iklan & Pemasaran" },
  { value: "other", label: "Lain-lain" },
]

// ─── Static Data ──────────────────────────────────────────────────────────────

export const initialExpenses: Expense[] = [
  {
    id: "EXP-2026-001",
    employeeName: "Budi Utomo",
    employeeEmail: "budi@company.com",
    category: "travel",
    date: "2026-01-10",
    description: "Bensin & tol dinas luar kota Bandung",
    amount: 450000,
    status: "reimbursed",
    receiptUrl: "/receipts/exp-001.jpg",
  },
  {
    id: "EXP-2026-002",
    employeeName: "Dewi Lestari",
    employeeEmail: "dewi@company.com",
    category: "meals",
    date: "2026-01-12",
    description: "Makan siang meeting klien digital agency",
    amount: 320000,
    status: "reimbursed",
    receiptUrl: "/receipts/exp-002.jpg",
  },
  {
    id: "EXP-2026-003",
    employeeName: "Rian Wijaya",
    employeeEmail: "rian@company.com",
    category: "office",
    date: "2026-01-18",
    description: "Membeli kertas printer & tinta refill",
    amount: 150000,
    status: "reimbursed",
  },
  {
    id: "EXP-2026-004",
    employeeName: "Siti Rahma",
    employeeEmail: "siti@company.com",
    category: "marketing",
    date: "2026-02-02",
    description: "Iklan Facebook & Instagram Ads - Campaign Feb",
    amount: 1500000,
    status: "approved",
    receiptUrl: "/receipts/exp-004.jpg",
  },
  {
    id: "EXP-2026-005",
    employeeName: "Eko Prasetyo",
    employeeEmail: "eko@company.com",
    category: "travel",
    date: "2026-02-05",
    description: "Tiket kereta dinas ke Jakarta",
    amount: 800000,
    status: "submitted",
    receiptUrl: "/receipts/exp-005.jpg",
  },
  {
    id: "EXP-2026-006",
    employeeName: "Dewi Lestari",
    employeeEmail: "dewi@company.com",
    category: "meals",
    date: "2026-02-12",
    description: "Beli kopi & camilan untuk internal meeting",
    amount: 120000,
    status: "submitted",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeExpenseStats(expenses: Expense[]): {
  totalReimbursed: number
  totalPendingApproval: number
  submittedCount: number
} {
  let totalReimbursed = 0
  let totalPendingApproval = 0
  let submittedCount = 0

  for (const exp of expenses) {
    if (exp.status === "reimbursed") {
      totalReimbursed += exp.amount
    } else if (exp.status === "submitted") {
      totalPendingApproval += exp.amount
      submittedCount++
    } else if (exp.status === "approved") {
      totalPendingApproval += exp.amount
    }
  }

  return {
    totalReimbursed,
    totalPendingApproval,
    submittedCount,
  }
}
