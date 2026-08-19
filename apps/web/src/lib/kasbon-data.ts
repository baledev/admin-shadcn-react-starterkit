// ─── Types ────────────────────────────────────────────────────────────────────

export type KasbonStatus = "pending" | "approved" | "rejected" | "active" | "paid"
export type RepaymentType = "payroll_deduction" | "cash"

export type KasbonRepayment = {
  id: string
  date: string
  amount: number
  type: RepaymentType
  referenceId?: string // e.g. Payroll slip ID or JV ID
  note?: string
}

export type Kasbon = {
  id: string // "KSB-2026-001"
  employeeId: string // "USR-001"
  employeeName: string
  employeeEmail: string
  date: string
  amount: number
  remainingAmount: number
  purpose: string
  status: KasbonStatus
  repayments: KasbonRepayment[]
  notes?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const KASBON_STATUS_META: Record<
  KasbonStatus,
  { label: string; chip: string }
> = {
  pending: {
    label: "Menunggu",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300",
  },
  approved: {
    label: "Disetujui",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300",
  },
  rejected: {
    label: "Ditolak",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
  active: {
    label: "Aktif",
    chip: "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:bg-violet-400/15 dark:text-violet-300",
  },
  paid: {
    label: "Lunas",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
}

export const KASBON_STATUS_OPTIONS: { value: KasbonStatus; label: string }[] = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "active", label: "Aktif" },
  { value: "paid", label: "Lunas" },
]

export const REPAYMENT_TYPE_OPTIONS: { value: RepaymentType; label: string }[] = [
  { value: "payroll_deduction", label: "Potong Gaji (Payroll)" },
  { value: "cash", label: "Tunai / Transfer" },
]

// ─── Static Data ──────────────────────────────────────────────────────────────

export const initialKasbons: Kasbon[] = [
  {
    id: "KSB-2026-001",
    employeeId: "USR-002",
    employeeName: "Budi Utomo",
    employeeEmail: "budi@company.com",
    date: "2026-01-05",
    amount: 5000000,
    remainingAmount: 4000000,
    purpose: "Biaya perbaikan motor pribadi",
    status: "active",
    repayments: [
      {
        id: "PAY-KSB-001",
        date: "2026-01-28",
        amount: 1000000,
        type: "payroll_deduction",
        referenceId: "PAY-2026-01-USR-002",
        note: "Potongan slip gaji Januari 2026",
      },
    ],
    notes: "Dicicil 5 bulan @ 1.000.000",
  },
  {
    id: "KSB-2026-002",
    employeeId: "USR-003",
    employeeName: "Dewi Lestari",
    employeeEmail: "dewi@company.com",
    date: "2026-01-10",
    amount: 2000000,
    remainingAmount: 0,
    purpose: "Biaya pengobatan darurat keluarga",
    status: "paid",
    repayments: [
      {
        id: "PAY-KSB-002",
        date: "2026-01-28",
        amount: 2000000,
        type: "cash",
        note: "Pelunasan tunai via transfer BCA",
      },
    ],
  },
  {
    id: "KSB-2026-003",
    employeeId: "USR-004",
    employeeName: "Rian Wijaya",
    employeeEmail: "rian@company.com",
    date: "2026-02-01",
    amount: 10000000,
    remainingAmount: 10000000,
    purpose: "Uang muka biaya renovasi rumah",
    status: "active",
    repayments: [],
    notes: "Persetujuan Direktur Utama. Dicicil 10 bulan @ 1.000.000 mulai akhir Februari",
  },
  {
    id: "KSB-2026-004",
    employeeId: "USR-005",
    employeeName: "Siti Rahma",
    employeeEmail: "siti@company.com",
    date: "2026-02-15",
    amount: 1500000,
    remainingAmount: 1500000,
    purpose: "Uang pangkal sekolah anak",
    status: "approved",
    repayments: [],
  },
  {
    id: "KSB-2026-005",
    employeeId: "USR-006",
    employeeName: "Eko Prasetyo",
    employeeEmail: "eko@company.com",
    date: "2026-02-18",
    amount: 3000000,
    remainingAmount: 3000000,
    purpose: "Membeli kacamata baru",
    status: "pending",
    repayments: [],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeKasbonStats(kasbons: Kasbon[]): {
  totalActiveLoan: number
  totalDisbursed: number
  totalRepaid: number
  pendingCount: number
} {
  let totalActiveLoan = 0
  let totalDisbursed = 0
  let totalRepaid = 0
  let pendingCount = 0

  for (const k of kasbons) {
    if (k.status === "active" || k.status === "approved" || k.status === "paid") {
      totalDisbursed += k.amount
      totalActiveLoan += k.remainingAmount
      totalRepaid += (k.amount - k.remainingAmount)
    }
    if (k.status === "pending") {
      pendingCount++
    }
  }

  return {
    totalActiveLoan,
    totalDisbursed,
    totalRepaid,
    pendingCount,
  }
}
