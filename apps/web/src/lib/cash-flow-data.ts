export type CashFlowLine = {
  id: string
  name: string
  amount: number
}

export type CashFlowSection = {
  title: string
  total: number
  items: CashFlowLine[]
}

export interface CashFlowData {
  period: string
  netOperating: number
  netInvesting: number
  netFinancing: number
  netChange: number
  openingBalance: number
  closingBalance: number
  sections: CashFlowSection[]
}

export const initialCashFlow: CashFlowData = {
  period: "2026-08",
  netOperating: 120000000,
  netInvesting: -45000000,
  netFinancing: 50000000,
  netChange: 125000000,
  openingBalance: 125000000,
  closingBalance: 250000000,
  sections: [
    {
      title: "Arus Kas dari Aktivitas Operasi (Operating Activities)",
      total: 120000000,
      items: [
        {
          id: "cf-op-1",
          name: "Penerimaan Kas dari Pelanggan",
          amount: 240000000,
        },
        {
          id: "cf-op-2",
          name: "Pembayaran Kas kepada Pemasok",
          amount: -75000000,
        },
        {
          id: "cf-op-3",
          name: "Pembayaran Kas untuk Gaji Karyawan",
          amount: -35000000,
        },
        {
          id: "cf-op-4",
          name: "Pembayaran Pajak dan Beban Bunga",
          amount: -10000000,
        },
      ],
    },
    {
      title: "Arus Kas dari Aktivitas Investasi (Investing Activities)",
      total: -45000000,
      items: [
        {
          id: "cf-inv-1",
          name: "Pembelian Peralatan Kantor",
          amount: -45000000,
        },
        { id: "cf-inv-2", name: "Penjualan Aset Tetap", amount: 0 },
      ],
    },
    {
      title: "Arus Kas dari Aktivitas Pendanaan (Financing Activities)",
      total: 50000000,
      items: [
        { id: "cf-fin-1", name: "Penerimaan Pinjaman Bank", amount: 50000000 },
        { id: "cf-fin-2", name: "Pembayaran Dividen", amount: 0 },
      ],
    },
  ],
}
