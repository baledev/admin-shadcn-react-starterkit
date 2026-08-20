// ─── Types ────────────────────────────────────────────────────────────────────

export type BillStatus = "draft" | "received" | "paid" | "overdue"

export type BillLine = {
  description: string
  accountCode: string // Expense or Asset account
  qty: number
  unitPrice: number
  amount: number
}

export type Bill = {
  id: string // "BILL-2026-001"
  vendorName: string
  vendorEmail: string
  status: BillStatus
  lines: BillLine[]
  subtotal: number
  tax: number
  total: number
  issuedAt: string // ISO date string
  dueAt: string
  notes?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const BILL_STATUS_META: Record<
  BillStatus,
  { label: string; chip: string }
> = {
  draft: {
    label: "Draft",
    chip: "bg-muted text-muted-foreground ring-border",
  },
  received: {
    label: "Received",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
  },
  paid: {
    label: "Paid",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  overdue: {
    label: "Overdue",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const BILL_STATUS_OPTIONS: { value: BillStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "received", label: "Received" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
]

// ─── Static Data ──────────────────────────────────────────────────────────────

export const initialBills: Bill[] = [
  {
    id: "BILL-2026-001",
    vendorName: "Biznet Networks",
    vendorEmail: "billing@biznet.id",
    status: "paid",
    lines: [
      {
        description: "Internet Dedicated 50 Mbps - Jan",
        accountCode: "5230",
        qty: 1,
        unitPrice: 5000000,
        amount: 5000000,
      },
    ],
    subtotal: 5000000,
    tax: 500000,
    total: 5500000,
    issuedAt: "2026-01-02",
    dueAt: "2026-01-15",
    notes: "Sudah dipotong pajak PPh 23",
  },
  {
    id: "BILL-2026-002",
    vendorName: "Amazon Web Services",
    vendorEmail: "aws-billing@amazon.com",
    status: "paid",
    lines: [
      {
        description: "Cloud Hosting - EC2 & S3",
        accountCode: "5230",
        qty: 1,
        unitPrice: 7500000,
        amount: 7500000,
      },
      {
        description: "Database Services RDS",
        accountCode: "5230",
        qty: 1,
        unitPrice: 3000000,
        amount: 3000000,
      },
    ],
    subtotal: 10500000,
    tax: 1050000,
    total: 11550000,
    issuedAt: "2026-01-05",
    dueAt: "2026-01-20",
  },
  {
    id: "BILL-2026-003",
    vendorName: "Gedung Cyber Mandiri",
    vendorEmail: "finance@cybermandiri.co.id",
    status: "overdue",
    lines: [
      {
        description: "Sewa Kantor Bulanan - Feb",
        accountCode: "5220",
        qty: 1,
        unitPrice: 40000000,
        amount: 40000000,
      },
    ],
    subtotal: 40000000,
    tax: 4000000,
    total: 44000000,
    issuedAt: "2026-01-20",
    dueAt: "2026-02-05",
  },
  {
    id: "BILL-2026-004",
    vendorName: "PLN Persero",
    vendorEmail: "tagihan@pln.co.id",
    status: "received",
    lines: [
      {
        description: "Listrik Kantor Gedung A - Jan",
        accountCode: "5230",
        qty: 1,
        unitPrice: 6200000,
        amount: 6200000,
      },
    ],
    subtotal: 6200000,
    tax: 620000,
    total: 6820000,
    issuedAt: "2026-02-01",
    dueAt: "2026-02-15",
  },
  {
    id: "BILL-2026-005",
    vendorName: "Microsoft Ireland",
    vendorEmail: "billing@microsoft.com",
    status: "draft",
    lines: [
      {
        description: "Lisensi Microsoft 365 Business (10 User)",
        accountCode: "5230",
        qty: 10,
        unitPrice: 250000,
        amount: 2500000,
      },
    ],
    subtotal: 2500000,
    tax: 250000,
    total: 2750000,
    issuedAt: "2026-02-18",
    dueAt: "2026-03-04",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeBillStats(bills: Bill[]): {
  totalPaid: number
  totalUnpaid: number
  totalOverdue: number
  totalAmount: number
} {
  let totalPaid = 0
  let totalUnpaid = 0
  let totalOverdue = 0
  let totalAmount = 0

  for (const bill of bills) {
    totalAmount += bill.total
    if (bill.status === "paid") {
      totalPaid += bill.total
    } else if (bill.status === "overdue") {
      totalOverdue += bill.total
      totalUnpaid += bill.total
    } else if (bill.status === "received") {
      totalUnpaid += bill.total
    }
  }

  return {
    totalPaid,
    totalUnpaid,
    totalOverdue,
    totalAmount,
  }
}
