// ─── Types ────────────────────────────────────────────────────────────────────

export type TransferStatus = "draft" | "completed" | "cancelled"

export type Transfer = {
  id: string // "TRF-2026-001"
  fromAccountCode: string
  fromAccountName: string
  toAccountCode: string
  toAccountName: string
  amount: number
  date: string // ISO date string
  status: TransferStatus
  note?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const TRANSFER_STATUS_META: Record<
  TransferStatus,
  { label: string; chip: string }
> = {
  draft: {
    label: "Draft",
    chip: "bg-muted text-muted-foreground ring-border",
  },
  completed: {
    label: "Selesai",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  cancelled: {
    label: "Batal",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const TRANSFER_STATUS_OPTIONS: {
  value: TransferStatus
  label: string
}[] = [
  { value: "draft", label: "Draft" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Batal" },
]

// ─── Static Data ──────────────────────────────────────────────────────────────

export const initialTransfers: Transfer[] = [
  {
    id: "TRF-2026-001",
    fromAccountCode: "1112",
    fromAccountName: "Bank BCA",
    toAccountCode: "1113",
    toAccountName: "Bank BRI",
    amount: 100000000,
    date: "2026-01-15",
    status: "completed",
    note: "Mutasi dana cadangan operasional",
  },
  {
    id: "TRF-2026-002",
    fromAccountCode: "1112",
    fromAccountName: "Bank BCA",
    toAccountCode: "1111",
    toAccountName: "Kas Tunai",
    amount: 5000000,
    date: "2026-01-20",
    status: "completed",
    note: "Pengisian kas kecil kantor (petty cash)",
  },
  {
    id: "TRF-2026-003",
    fromAccountCode: "1113",
    fromAccountName: "Bank BRI",
    toAccountCode: "1112",
    toAccountName: "Bank BCA",
    amount: 25000000,
    date: "2026-02-05",
    status: "completed",
    note: "Mutasi balik untuk payroll BCA",
  },
  {
    id: "TRF-2026-004",
    fromAccountCode: "1112",
    fromAccountName: "Bank BCA",
    toAccountCode: "1111",
    toAccountName: "Kas Tunai",
    amount: 3000000,
    date: "2026-02-18",
    status: "draft",
    note: "Rencana isi kas kecil operasional",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeTransferStats(transfers: Transfer[]): {
  totalTransferred: number
  completedCount: number
  draftCount: number
} {
  let totalTransferred = 0
  let completedCount = 0
  let draftCount = 0

  for (const t of transfers) {
    if (t.status === "completed") {
      totalTransferred += t.amount
      completedCount++
    } else if (t.status === "draft") {
      draftCount++
    }
  }

  return {
    totalTransferred,
    completedCount,
    draftCount,
  }
}
