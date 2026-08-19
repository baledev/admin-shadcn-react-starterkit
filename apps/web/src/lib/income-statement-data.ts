export type IncomeStatementSection = {
  id: string
  name: string
  amount: number
  type: "revenue" | "expense" | "total" | "net"
  children?: IncomeStatementSection[]
}

export interface IncomeStatementData {
  period: string
  revenue: number
  expense: number
  netProfit: number
  margin: number
  details: IncomeStatementSection[]
}

export const initialIncomeStatement: IncomeStatementData = {
  period: "2026-08",
  revenue: 250000000,
  expense: 145000000,
  netProfit: 105000000,
  margin: 42,
  details: [
    {
      id: "rev-1",
      name: "Pendapatan Usaha (Revenue)",
      amount: 250000000,
      type: "revenue",
      children: [
        { id: "rev-1-1", name: "Penjualan Produk", amount: 180000000, type: "revenue" },
        { id: "rev-1-2", name: "Pendapatan Jasa & Layanan", amount: 70000000, type: "revenue" },
      ],
    },
    {
      id: "exp-1",
      name: "Harga Pokok Penjualan (HPP / COGS)",
      amount: 80000000,
      type: "expense",
      children: [
        { id: "exp-1-1", name: "Pembelian Bahan Baku", amount: 55000000, type: "expense" },
        { id: "exp-1-2", name: "Biaya Logistik & Pengiriman", amount: 25000000, type: "expense" },
      ],
    },
    {
      id: "exp-2",
      name: "Beban Operasional (OPEX)",
      amount: 65000000,
      type: "expense",
      children: [
        { id: "exp-2-1", name: "Gaji & Kesejahteraan Karyawan", amount: 45000000, type: "expense" },
        { id: "exp-2-2", name: "Sewa Tempat & Utilitas", amount: 12000000, type: "expense" },
        { id: "exp-2-3", name: "Pemasaran & Iklan", amount: 8000000, type: "expense" },
      ],
    },
  ],
}
