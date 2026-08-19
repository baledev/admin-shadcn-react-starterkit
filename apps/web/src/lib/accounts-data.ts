// ─── Types ────────────────────────────────────────────────────────────────────

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense"

export type Account = {
  code: string // unique code, e.g., "1111"
  name: string
  type: AccountType
  level: 1 | 2 | 3
  parentCode?: string
  balance: number
  description?: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const ACCOUNT_TYPE_META: Record<
  AccountType,
  { label: string; chip: string; dot: string }
> = {
  asset: {
    label: "Aset",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
    dot: "bg-blue-500",
  },
  liability: {
    label: "Kewajiban",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
    dot: "bg-amber-500",
  },
  equity: {
    label: "Ekuitas",
    chip: "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:bg-violet-400/15 dark:text-violet-300 dark:ring-violet-400/30",
    dot: "bg-violet-500",
  },
  revenue: {
    label: "Pendapatan",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    dot: "bg-emerald-500",
  },
  expense: {
    label: "Beban",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
    dot: "bg-destructive",
  },
}

export const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "asset", label: "Aset" },
  { value: "liability", label: "Kewajiban" },
  { value: "equity", label: "Ekuitas" },
  { value: "revenue", label: "Pendapatan" },
  { value: "expense", label: "Beban" },
]

// ─── Static Data (CoA 3 Level) ────────────────────────────────────────────────

export const initialAccounts: Account[] = [
  // 1000 - ASET (Level 1)
  { code: "1000", name: "Aset", type: "asset", level: 1, balance: 1350000000 },
  
  // 1100 - Aset Lancar (Level 2)
  { code: "1100", name: "Aset Lancar", type: "asset", level: 2, parentCode: "1000", balance: 850000000 },
  
  // Kas & Bank (Level 3)
  { code: "1111", name: "Kas Tunai", type: "asset", level: 3, parentCode: "1100", balance: 50000000, description: "Kas tunai di kantor" },
  { code: "1112", name: "Bank BCA", type: "asset", level: 3, parentCode: "1100", balance: 450000000, description: "Rekening Operasional BCA" },
  { code: "1113", name: "Bank BRI", type: "asset", level: 3, parentCode: "1100", balance: 200000000, description: "Rekening Cadangan BRI" },
  
  // Piutang (Level 3)
  { code: "1120", name: "Piutang Usaha", type: "asset", level: 3, parentCode: "1100", balance: 120000000, description: "Piutang dari invoice customer" },
  { code: "1130", name: "Piutang Karyawan", type: "asset", level: 3, parentCode: "1100", balance: 30000000, description: "Kasbon / pinjaman karyawan" },
  
  // 1200 - Aset Tetap (Level 2)
  { code: "1200", name: "Aset Tetap", type: "asset", level: 2, parentCode: "1000", balance: 500000000 },
  { code: "1210", name: "Peralatan Kantor", type: "asset", level: 3, parentCode: "1200", balance: 150000000, description: "Komputer, meja, kursi" },
  { code: "1220", name: "Kendaraan", type: "asset", level: 3, parentCode: "1200", balance: 350000000, description: "Mobil/motor operasional" },

  // 2000 - KEWAJIBAN (Level 1)
  { code: "2000", name: "Kewajiban", type: "liability", level: 1, balance: 280000000 },
  
  // 2100 - Kewajiban Lancar (Level 2)
  { code: "2100", name: "Kewajiban Lancar", type: "liability", level: 2, parentCode: "2000", balance: 280000000 },
  { code: "2110", name: "Hutang Usaha", type: "liability", level: 3, parentCode: "2100", balance: 250000000, description: "Hutang pembelian (Bills)" },
  { code: "2120", name: "Hutang Reimbursement", type: "liability", level: 3, parentCode: "2100", balance: 30000000, description: "Expense karyawan belum dibayar" },

  // 3000 - EKUITAS (Level 1)
  { code: "3000", name: "Ekuitas", type: "equity", level: 1, balance: 1070000000 },
  { code: "3100", name: "Modal Disetor", type: "equity", level: 2, parentCode: "3000", balance: 800000000, description: "Modal awal dari pemilik" },
  { code: "3200", name: "Prive / Penarikan", type: "equity", level: 3, parentCode: "3100", balance: -50000000, description: "Pengambilan modal pribadi" },
  { code: "3300", name: "Laba Ditahan", type: "equity", level: 2, parentCode: "3000", balance: 220000000, description: "Akumulasi laba tahun-tahun sebelumnya" },
  { code: "3400", name: "Laba Tahun Berjalan", type: "equity", level: 2, parentCode: "3000", balance: 100000000, description: "Laba bersih periode berjalan" },

  // 4000 - PENDAPATAN (Level 1)
  { code: "4000", name: "Pendapatan", type: "revenue", level: 1, balance: 350000000 },
  { code: "4100", name: "Pendapatan Operasional", type: "revenue", level: 2, parentCode: "4000", balance: 320000000 },
  { code: "4110", name: "Pendapatan Jasa", type: "revenue", level: 3, parentCode: "4100", balance: 320000000, description: "Pendapatan dari jasa / invoice" },
  { code: "4200", name: "Pendapatan Non-Operasional", type: "revenue", level: 2, parentCode: "4000", balance: 30000000 },
  { code: "4210", name: "Pendapatan Bunga Bank", type: "revenue", level: 3, parentCode: "4200", balance: 30000000, description: "Bunga dari rekening bank" },

  // 5000 - BEBAN (Level 1)
  { code: "5000", name: "Beban", type: "expense", level: 1, balance: 250000000 },
  { code: "5100", name: "Beban HPP / Biaya Langsung", type: "expense", level: 2, parentCode: "5000", balance: 100000000 },
  { code: "5110", name: "Beban Pokok Penjualan", type: "expense", level: 3, parentCode: "5100", balance: 100000000, description: "Harga Pokok Penjualan" },
  { code: "5200", name: "Beban Operasional", type: "expense", level: 2, parentCode: "5000", balance: 150000000 },
  { code: "5210", name: "Beban Gaji Karyawan", type: "expense", level: 3, parentCode: "5200", balance: 90000000, description: "Gaji & tunjangan payroll" },
  { code: "5220", name: "Beban Sewa Kantor", type: "expense", level: 3, parentCode: "5200", balance: 40000000, description: "Sewa gedung kantor" },
  { code: "5230", name: "Beban Listrik & Internet", type: "expense", level: 3, parentCode: "5200", balance: 15000000, description: "Operasional utilitas bulanan" },
  { code: "5240", name: "Beban Transportasi", type: "expense", level: 3, parentCode: "5200", balance: 5000000, description: "Bensin, parkir, dinas luar" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Format currency Rupiah
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Rekalkulasi balance level 1 & 2 dari total level 3
export function computeAccountBalances(accounts: Account[]): Account[] {
  const accountMap = new Map(accounts.map((a) => [a.code, { ...a }]))

  // 1. Reset level 1 & 2
  for (const acc of accountMap.values()) {
    if (acc.level !== 3) {
      acc.balance = 0
    }
  }

  // 2. Roll up level 3 to parent (level 2) and grandparent (level 1)
  for (const acc of accountMap.values()) {
    if (acc.level === 3 && acc.parentCode) {
      const parent = accountMap.get(acc.parentCode)
      if (parent) {
        parent.balance += acc.balance
        
        if (parent.parentCode) {
          const grandparent = accountMap.get(parent.parentCode)
          if (grandparent) {
            grandparent.balance += acc.balance
          }
        }
      }
    }
  }

  return Array.from(accountMap.values())
}
