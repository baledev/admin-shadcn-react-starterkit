// ─── Types ────────────────────────────────────────────────────────────────────

export type JournalType = "general" | "sales" | "purchase" | "cash"
export type EntryStatus = "draft" | "posted" | "cancelled"

export type JournalLine = {
  accountCode: string
  accountName: string
  description?: string
  debit: number
  credit: number
}

export type JournalEntry = {
  id: string // e.g. "JV-2026-0001"
  date: string // ISO date string
  reference?: string
  note?: string
  type: JournalType
  status: EntryStatus
  lines: JournalLine[]
  totalDebit: number
  totalCredit: number
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const JOURNAL_TYPE_META: Record<
  JournalType,
  { label: string; color: string }
> = {
  general: {
    label: "Umum",
    color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  },
  sales: {
    label: "Penjualan",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  purchase: {
    label: "Pembelian",
    color:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  cash: {
    label: "Kas/Bank",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
}

export const ENTRY_STATUS_META: Record<
  EntryStatus,
  { label: string; chip: string }
> = {
  draft: {
    label: "Draft",
    chip: "bg-muted text-muted-foreground ring-border",
  },
  posted: {
    label: "Posted",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  cancelled: {
    label: "Batal",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const JOURNAL_TYPE_OPTIONS: { value: JournalType; label: string }[] = [
  { value: "general", label: "Jurnal Umum" },
  { value: "sales", label: "Jurnal Penjualan" },
  { value: "purchase", label: "Jurnal Pembelian" },
  { value: "cash", label: "Jurnal Kas/Bank" },
]

export const ENTRY_STATUS_OPTIONS: { value: EntryStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "posted", label: "Posted" },
  { value: "cancelled", label: "Batal" },
]

// ─── Static Data ──────────────────────────────────────────────────────────────

export const initialJournalEntries: JournalEntry[] = [
  {
    id: "JV-2026-0001",
    date: "2026-01-01",
    reference: "INV-EQUITY-01",
    note: "Setoran Modal Awal Pemilik",
    type: "general",
    status: "posted",
    totalDebit: 800000000,
    totalCredit: 800000000,
    lines: [
      {
        accountCode: "1112",
        accountName: "Bank BCA",
        description: "Setoran modal pemegang saham",
        debit: 800000000,
        credit: 0,
      },
      {
        accountCode: "3100",
        accountName: "Modal Disetor",
        description: "Setoran modal pemegang saham",
        debit: 0,
        credit: 800000000,
      },
    ],
  },
  {
    id: "JV-2026-0002",
    date: "2026-01-02",
    reference: "RENT-2026",
    note: "Pembayaran Sewa Kantor Tahunan",
    type: "cash",
    status: "posted",
    totalDebit: 40000000,
    totalCredit: 40000000,
    lines: [
      {
        accountCode: "5220",
        accountName: "Beban Sewa Kantor",
        description: "Sewa kantor tahun 2026",
        debit: 40000000,
        credit: 0,
      },
      {
        accountCode: "1112",
        accountName: "Bank BCA",
        description: "Pembayaran sewa via BCA",
        debit: 0,
        credit: 40000000,
      },
    ],
  },
  {
    id: "JV-2026-0003",
    date: "2026-01-05",
    reference: "INV-2026-001",
    note: "Pendapatan Jasa Web Design - Alice Johnson",
    type: "sales",
    status: "posted",
    totalDebit: 25000000,
    totalCredit: 25000000,
    lines: [
      {
        accountCode: "1120",
        accountName: "Piutang Usaha",
        description: "Tagihan Web Design Alice",
        debit: 25000000,
        credit: 0,
      },
      {
        accountCode: "4110",
        accountName: "Pendapatan Jasa",
        description: "Pendapatan jasa web design",
        debit: 0,
        credit: 25000000,
      },
    ],
  },
  {
    id: "JV-2026-0004",
    date: "2026-01-06",
    reference: "KASBON-001",
    note: "Kasbon Karyawan - Budi Utomo",
    type: "cash",
    status: "posted",
    totalDebit: 5000000,
    totalCredit: 5000000,
    lines: [
      {
        accountCode: "1130",
        accountName: "Piutang Karyawan",
        description: "Pinjaman kasbon Budi Utomo",
        debit: 5000000,
        credit: 0,
      },
      {
        accountCode: "1111",
        accountName: "Kas Tunai",
        description: "Pengeluaran kasbon tunai",
        debit: 0,
        credit: 5000000,
      },
    ],
  },
  {
    id: "JV-2026-0005",
    date: "2026-01-10",
    reference: "BILL-2026-001",
    note: "Beban Pokok Penjualan - Lisensi Software",
    type: "purchase",
    status: "posted",
    totalDebit: 15000000,
    totalCredit: 15000000,
    lines: [
      {
        accountCode: "5110",
        accountName: "Beban Pokok Penjualan",
        description: "Membeli lisensi dev tool",
        debit: 15000000,
        credit: 0,
      },
      {
        accountCode: "2110",
        accountName: "Hutang Usaha",
        description: "Kewajiban bayar tagihan lisensi",
        debit: 0,
        credit: 15000000,
      },
    ],
  },
  {
    id: "JV-2026-0006",
    date: "2026-01-15",
    reference: "MUT-BCA-BRI-01",
    note: "Transfer BCA ke BRI (Mutasi Rekening)",
    type: "cash",
    status: "posted",
    totalDebit: 100000000,
    totalCredit: 100000000,
    lines: [
      {
        accountCode: "1113",
        accountName: "Bank BRI",
        description: "Penerimaan mutasi ke BRI",
        debit: 100000000,
        credit: 0,
      },
      {
        accountCode: "1112",
        accountName: "Bank BCA",
        description: "Pengiriman mutasi dari BCA",
        debit: 0,
        credit: 100000000,
      },
    ],
  },
  {
    id: "JV-2026-0007",
    date: "2026-01-20",
    reference: "PAY-INV-001",
    note: "Pelunasan Invoice - Alice Johnson",
    type: "cash",
    status: "posted",
    totalDebit: 25000000,
    totalCredit: 25000000,
    lines: [
      {
        accountCode: "1112",
        accountName: "Bank BCA",
        description: "Terima transfer Alice",
        debit: 25000000,
        credit: 0,
      },
      {
        accountCode: "1120",
        accountName: "Piutang Usaha",
        description: "Penerimaan piutang Alice",
        debit: 0,
        credit: 25000000,
      },
    ],
  },
  {
    id: "JV-2026-0008",
    date: "2026-01-25",
    reference: "PRIVE-01",
    note: "Prive / Penarikan Modal Pemilik",
    type: "general",
    status: "posted",
    totalDebit: 10000000,
    totalCredit: 10000000,
    lines: [
      {
        accountCode: "3200",
        accountName: "Prive / Penarikan",
        description: "Keperluan pribadi pemilik",
        debit: 10000000,
        credit: 0,
      },
      {
        accountCode: "1112",
        accountName: "Bank BCA",
        description: "Penarikan tunai BCA",
        debit: 0,
        credit: 10000000,
      },
    ],
  },
  {
    id: "JV-2026-0009",
    date: "2026-01-28",
    reference: "PAY-BUDI-01",
    note: "Potongan Kasbon Gaji Karyawan - Budi Utomo",
    type: "general",
    status: "posted",
    totalDebit: 1000000,
    totalCredit: 1000000,
    lines: [
      {
        accountCode: "5210",
        accountName: "Beban Gaji Karyawan",
        description: "Potongan gaji cicilan kasbon",
        debit: 1000000,
        credit: 0,
      },
      {
        accountCode: "1130",
        accountName: "Piutang Karyawan",
        description: "Pelunasan cicilan kasbon Budi",
        debit: 0,
        credit: 1000000,
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeJournalStats(entries: JournalEntry[]): {
  totalDebitSum: number
  totalCreditSum: number
  postedCount: number
  draftCount: number
} {
  let totalDebitSum = 0
  let totalCreditSum = 0
  let postedCount = 0
  let draftCount = 0

  for (const entry of entries) {
    if (entry.status === "posted") {
      totalDebitSum += entry.totalDebit
      totalCreditSum += entry.totalCredit
      postedCount++
    } else if (entry.status === "draft") {
      draftCount++
    }
  }

  return {
    totalDebitSum,
    totalCreditSum,
    postedCount,
    draftCount,
  }
}
