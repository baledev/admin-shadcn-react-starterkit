export interface GeneralLedgerEntry {
  id: string
  date: string
  ref: string
  description: string
  debit: number
  credit: number
  balance: number
}

export interface AccountLedger {
  accountCode: string
  accountName: string
  openingBalance: number
  closingBalance: number
  entries: GeneralLedgerEntry[]
}

export const initialGeneralLedger: AccountLedger[] = [
  {
    accountCode: "1000",
    accountName: "Kas & Setara Kas",
    openingBalance: 125000000,
    closingBalance: 250000000,
    entries: [
      { id: "gl-1-1", date: "2026-08-01", ref: "JE-001", description: "Penerimaan modal awal investor", debit: 50000000, credit: 0, balance: 175000000 },
      { id: "gl-1-2", date: "2026-08-05", ref: "INV-001", description: "Pembayaran Invoice INV-2026-001", debit: 120000000, credit: 0, balance: 295000000 },
      { id: "gl-1-3", date: "2026-08-10", ref: "BIL-001", description: "Pembayaran Bill BIL-2026-001", debit: 0, credit: 35000000, balance: 260000000 },
      { id: "gl-1-4", date: "2026-08-25", ref: "PAY-001", description: "Pembayaran Gaji Karyawan Agustus", debit: 0, credit: 45000000, balance: 215000000 },
      { id: "gl-1-5", date: "2026-08-28", ref: "EXP-001", description: "Pembelian Utilitas Kantor", debit: 0, credit: 15000000, balance: 200000000 },
      { id: "gl-1-6", date: "2026-08-30", ref: "INV-002", description: "Pembayaran Invoice INV-2026-002", debit: 50000000, credit: 0, balance: 250000000 },
    ],
  },
  {
    accountCode: "1100",
    accountName: "Piutang Usaha",
    openingBalance: 150000000,
    closingBalance: 120000000,
    entries: [
      { id: "gl-2-1", date: "2026-08-02", ref: "INV-003", description: "Penjualan Kredit ke Customer A", debit: 90000000, credit: 0, balance: 240000000 },
      { id: "gl-2-2", date: "2026-08-05", ref: "INV-001", description: "Pelunasan Invoice dari Customer B", debit: 0, credit: 120000000, balance: 120000000 },
    ],
  },
]
