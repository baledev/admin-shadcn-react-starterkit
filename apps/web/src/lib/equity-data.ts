// ─── Types ────────────────────────────────────────────────────────────────────

export type EquityType =
  | "initial_capital"
  | "capital_addition"
  | "prive"
  | "retained_earnings_distribution"

export type EquityStatus = "draft" | "approved" | "cancelled"

export type EquityTransaction = {
  id: string // "EQT-2026-001"
  type: EquityType
  investorName: string
  amount: number
  date: string // ISO date string
  status: EquityStatus
  note?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const EQUITY_TYPE_META: Record<
  EquityType,
  { label: string; chip: string; drAccount: string; crAccount: string }
> = {
  initial_capital: {
    label: "Modal Awal",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
    drAccount: "1112", // Bank BCA
    crAccount: "3100", // Modal Disetor
  },
  capital_addition: {
    label: "Penambahan Modal",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300",
    drAccount: "1112", // Bank BCA
    crAccount: "3100", // Modal Disetor
  },
  prive: {
    label: "Prive / Penarikan",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300",
    drAccount: "3200", // Prive
    crAccount: "1112", // Bank BCA
  },
  retained_earnings_distribution: {
    label: "Pencairan Laba Ditahan",
    chip: "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:bg-violet-400/15 dark:text-violet-300",
    drAccount: "3300", // Laba Ditahan
    crAccount: "1112", // Bank BCA
  },
}

export const EQUITY_STATUS_META: Record<
  EquityStatus,
  { label: string; chip: string }
> = {
  draft: {
    label: "Draft",
    chip: "bg-muted text-muted-foreground ring-border",
  },
  approved: {
    label: "Approved",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  cancelled: {
    label: "Batal",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const EQUITY_TYPE_OPTIONS: { value: EquityType; label: string }[] = [
  { value: "initial_capital", label: "Modal Awal" },
  { value: "capital_addition", label: "Penambahan Modal" },
  { value: "prive", label: "Prive / Penarikan" },
  { value: "retained_earnings_distribution", label: "Pencairan Laba Ditahan" },
]

export const EQUITY_STATUS_OPTIONS: { value: EquityStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "cancelled", label: "Batal" },
]

// ─── Static Data ──────────────────────────────────────────────────────────────

export const initialEquityTransactions: EquityTransaction[] = [
  {
    id: "EQT-2026-001",
    type: "initial_capital",
    investorName: "Hendra Wijaya (Founder)",
    amount: 500000000,
    date: "2026-01-01",
    status: "approved",
    note: "Setoran modal pendirian perseroan",
  },
  {
    id: "EQT-2026-002",
    type: "initial_capital",
    investorName: "Surya Kencana (Co-Founder)",
    amount: 300000000,
    date: "2026-01-01",
    status: "approved",
    note: "Setoran modal pendirian perseroan",
  },
  {
    id: "EQT-2026-003",
    type: "prive",
    investorName: "Hendra Wijaya",
    amount: 10000000,
    date: "2026-01-25",
    status: "approved",
    note: "Penarikan keperluan berobat pribadi",
  },
  {
    id: "EQT-2026-004",
    type: "capital_addition",
    investorName: "Hendra Wijaya",
    amount: 100000000,
    date: "2026-02-10",
    status: "approved",
    note: "Suntikan modal kerja ekspansi usaha",
  },
  {
    id: "EQT-2026-005",
    type: "retained_earnings_distribution",
    investorName: "Hendra & Surya",
    amount: 50000000,
    date: "2026-02-15",
    status: "draft",
    note: "Rencana pencairan dividen dari Laba Ditahan",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeEquityStats(transactions: EquityTransaction[]): {
  totalEquityInjected: number
  totalPrive: number
  totalRetainedDistributed: number
} {
  let totalEquityInjected = 0
  let totalPrive = 0
  let totalRetainedDistributed = 0

  for (const t of transactions) {
    if (t.status === "approved") {
      if (t.type === "initial_capital" || t.type === "capital_addition") {
        totalEquityInjected += t.amount
      } else if (t.type === "prive") {
        totalPrive += t.amount
      } else if (t.type === "retained_earnings_distribution") {
        totalRetainedDistributed += t.amount
      }
    }
  }

  return {
    totalEquityInjected,
    totalPrive,
    totalRetainedDistributed,
  }
}
