// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentDirection = "incoming" | "outgoing"
export type PaymentMethod = "cash" | "bank_transfer" | "check"
export type PaymentStatus = "posted" | "voided"

export type Payment = {
  id: string // "PMT-2026-001"
  direction: PaymentDirection
  method: PaymentMethod
  amount: number
  date: string // ISO date string
  accountCode: string // Cash/Bank account code, e.g. "1112"
  accountName: string
  partnerName: string // Customer or Vendor name
  reference?: string // Invoice ID, Bill ID, or external ref
  status: PaymentStatus
  note?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const PAYMENT_DIRECTION_META: Record<
  PaymentDirection,
  { label: string; chip: string }
> = {
  incoming: {
    label: "Masuk (Penerimaan)",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  outgoing: {
    label: "Keluar (Pengeluaran)",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300",
  },
}

export const PAYMENT_METHOD_META: Record<PaymentMethod, { label: string }> = {
  cash: { label: "Tunai" },
  bank_transfer: { label: "Transfer Bank" },
  check: { label: "Cek / Giro" },
}

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; chip: string }
> = {
  posted: {
    label: "Posted",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  voided: {
    label: "Batal (Void)",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const PAYMENT_DIRECTION_OPTIONS: {
  value: PaymentDirection
  label: string
}[] = [
  { value: "incoming", label: "Masuk (Penerimaan)" },
  { value: "outgoing", label: "Keluar (Pengeluaran)" },
]

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] =
  [
    { value: "cash", label: "Tunai" },
    { value: "bank_transfer", label: "Transfer Bank" },
    { value: "check", label: "Cek / Giro" },
  ]

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] =
  [
    { value: "posted", label: "Posted" },
    { value: "voided", label: "Batal (Void)" },
  ]

// ─── Static Data ──────────────────────────────────────────────────────────────

export const initialPayments: Payment[] = [
  {
    id: "PMT-2026-001",
    direction: "incoming",
    method: "bank_transfer",
    amount: 1705000, // Pelunasan INV-2026-001
    date: "2026-01-20",
    accountCode: "1112",
    accountName: "Bank BCA",
    partnerName: "Alice Johnson",
    reference: "INV-2026-001",
    status: "posted",
    note: "Pelunasan Invoice Web Design",
  },
  {
    id: "PMT-2026-002",
    direction: "outgoing",
    method: "bank_transfer",
    amount: 5500000, // Pembayaran BILL-2026-001
    date: "2026-01-15",
    accountCode: "1112",
    accountName: "Bank BCA",
    partnerName: "Biznet Networks",
    reference: "BILL-2026-001",
    status: "posted",
    note: "Pembayaran tagihan internet",
  },
  {
    id: "PMT-2026-003",
    direction: "incoming",
    method: "bank_transfer",
    amount: 1870000, // Pelunasan INV-2026-005
    date: "2026-02-20",
    accountCode: "1112",
    accountName: "Bank BCA",
    partnerName: "Eva Chen",
    reference: "INV-2026-005",
    status: "posted",
    note: "Pelunasan Invoice Logo Design",
  },
  {
    id: "PMT-2026-004",
    direction: "outgoing",
    method: "bank_transfer",
    amount: 11550000, // Pembayaran BILL-2026-002
    date: "2026-01-20",
    accountCode: "1112",
    accountName: "Bank BCA",
    partnerName: "Amazon Web Services",
    reference: "BILL-2026-002",
    status: "posted",
    note: "Pembayaran AWS Hosting",
  },
  {
    id: "PMT-2026-005",
    direction: "incoming",
    method: "cash",
    amount: 2000000, // Pelunasan Kasbon KSB-2026-002
    date: "2026-01-28",
    accountCode: "1111",
    accountName: "Kas Tunai",
    partnerName: "Dewi Lestari",
    reference: "KSB-2026-002",
    status: "posted",
    note: "Pengembalian kasbon darurat tunai",
  },
  {
    id: "PMT-2026-006",
    direction: "outgoing",
    method: "bank_transfer",
    amount: 450000, // Reimburse EXP-2026-001
    date: "2026-01-15",
    accountCode: "1112",
    accountName: "Bank BCA",
    partnerName: "Budi Utomo",
    reference: "EXP-2026-001",
    status: "posted",
    note: "Pembayaran reimburse dinas Bandung",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computePaymentStats(payments: Payment[]): {
  totalIncoming: number
  totalOutgoing: number
  netCashFlow: number
} {
  let totalIncoming = 0
  let totalOutgoing = 0

  for (const p of payments) {
    if (p.status === "posted") {
      if (p.direction === "incoming") {
        totalIncoming += p.amount
      } else {
        totalOutgoing += p.amount
      }
    }
  }

  return {
    totalIncoming,
    totalOutgoing,
    netCashFlow: totalIncoming - totalOutgoing,
  }
}
