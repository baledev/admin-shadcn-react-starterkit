export type BalanceSheetLine = {
  id: string
  name: string
  amount: number
  type: "asset" | "liability" | "equity"
}

export type BalanceSheetSection = {
  title: string
  total: number
  items: BalanceSheetLine[]
}

export interface BalanceSheetData {
  asOfDate: string
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  assetsSection: BalanceSheetSection[]
  liabilitiesSection: BalanceSheetSection[]
  equitySection: BalanceSheetSection[]
}

export const initialBalanceSheet: BalanceSheetData = {
  asOfDate: "2026-08-31",
  totalAssets: 1250000000,
  totalLiabilities: 450000000,
  totalEquity: 800000000,
  assetsSection: [
    {
      title: "Aset Lancar (Current Assets)",
      total: 450000000,
      items: [
        { id: "ast-1-1", name: "Kas & Setara Kas", amount: 250000000, type: "asset" },
        { id: "ast-1-2", name: "Piutang Usaha (AR)", amount: 120000000, type: "asset" },
        { id: "ast-1-3", name: "Persediaan Barang Dagang", amount: 80000000, type: "asset" },
      ],
    },
    {
      title: "Aset Tetap (Fixed Assets)",
      total: 800000000,
      items: [
        { id: "ast-2-1", name: "Peralatan & Mesin Kantor", amount: 150000000, type: "asset" },
        { id: "ast-2-2", name: "Properti & Bangunan", amount: 750000000, type: "asset" },
        { id: "ast-2-3", name: "Akumulasi Penyusutan Aset", amount: -100000000, type: "asset" },
      ],
    },
  ],
  liabilitiesSection: [
    {
      title: "Liabilitas Jangka Pendek (Current Liabilities)",
      total: 150000000,
      items: [
        { id: "lia-1-1", name: "Utang Usaha (AP)", amount: 90000000, type: "liability" },
        { id: "lia-1-2", name: "Utang Gaji & Pajak", amount: 40000000, type: "liability" },
        { id: "lia-1-3", name: "Biaya yang Masih Harus Dibayar", amount: 20000000, type: "liability" },
      ],
    },
    {
      title: "Liabilitas Jangka Panjang (Long-term Liabilities)",
      total: 300000000,
      items: [
        { id: "lia-2-1", name: "Utang Bank & Lembaga Keuangan", amount: 300000000, type: "liability" },
      ],
    },
  ],
  equitySection: [
    {
      title: "Ekuitas (Equity)",
      total: 800000000,
      items: [
        { id: "eq-1-1", name: "Modal Disetor", amount: 500000000, type: "equity" },
        { id: "eq-1-2", name: "Laba Ditahan (Retained Earnings)", amount: 195000000, type: "equity" },
        { id: "eq-1-3", name: "Laba Tahun Berjalan", amount: 105000000, type: "equity" },
      ],
    },
  ],
}
