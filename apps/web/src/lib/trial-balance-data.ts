export interface TrialBalanceLine {
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

export interface TrialBalanceData {
  asOfDate: string
  totalDebit: number
  totalCredit: number
  items: TrialBalanceLine[]
}

export const initialTrialBalance: TrialBalanceData = {
  asOfDate: "2026-08-31",
  totalDebit: 1390000000,
  totalCredit: 1390000000,
  items: [
    {
      accountCode: "1000",
      accountName: "Kas & Setara Kas",
      debit: 250000000,
      credit: 0,
    },
    {
      accountCode: "1100",
      accountName: "Piutang Usaha (AR)",
      debit: 120000000,
      credit: 0,
    },
    {
      accountCode: "1200",
      accountName: "Persediaan Barang",
      debit: 80000000,
      credit: 0,
    },
    {
      accountCode: "1500",
      accountName: "Aset Tetap - Peralatan",
      debit: 150000000,
      credit: 0,
    },
    {
      accountCode: "1510",
      accountName: "Aset Tetap - Properti",
      debit: 750000000,
      credit: 0,
    },
    {
      accountCode: "1590",
      accountName: "Akumulasi Penyusutan Aset",
      debit: 0,
      credit: 100000000,
    },
    {
      accountCode: "2000",
      accountName: "Utang Usaha (AP)",
      debit: 0,
      credit: 90000000,
    },
    {
      accountCode: "2100",
      accountName: "Utang Gaji & Pajak",
      debit: 0,
      credit: 40000000,
    },
    {
      accountCode: "2200",
      accountName: "Utang Biaya Akrual",
      debit: 0,
      credit: 20000000,
    },
    {
      accountCode: "2500",
      accountName: "Utang Bank Jangka Panjang",
      debit: 0,
      credit: 300000000,
    },
    {
      accountCode: "3000",
      accountName: "Modal Disetor",
      debit: 0,
      credit: 500000000,
    },
    {
      accountCode: "3100",
      accountName: "Laba Ditahan",
      debit: 0,
      credit: 195000000,
    },
    {
      accountCode: "4000",
      accountName: "Pendapatan Penjualan",
      debit: 0,
      credit: 250000000,
    },
    {
      accountCode: "5000",
      accountName: "Harga Pokok Penjualan (HPP)",
      debit: 80000000,
      credit: 0,
    },
    {
      accountCode: "6000",
      accountName: "Beban Gaji & Tunjangan",
      debit: 45000000,
      credit: 0,
    },
    {
      accountCode: "6100",
      accountName: "Beban Sewa & Utilitas",
      debit: 12000000,
      credit: 0,
    },
    {
      accountCode: "6200",
      accountName: "Beban Pemasaran",
      debit: 8000000,
      credit: 0,
    },
  ],
}
