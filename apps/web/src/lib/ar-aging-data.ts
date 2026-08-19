export interface ARAgingEntry {
  customerId: string
  customerName: string
  invoiceCount: number
  current: number
  aging1to30: number
  aging31to60: number
  aging61to90: number
  agingOver90: number
  total: number
}

export interface ARAgingSummary {
  asOfDate: string
  totalAR: number
  totalCurrent: number
  total1to30: number
  total31to60: number
  total61to90: number
  totalOver90: number
  entries: ARAgingEntry[]
}

export const initialARAging: ARAgingSummary = {
  asOfDate: "2026-08-31",
  totalAR: 120000000,
  totalCurrent: 50000000,
  total1to30: 35000000,
  total31to60: 20000000,
  total61to90: 10000000,
  totalOver90: 5000000,
  entries: [
    {
      customerId: "CUST-001",
      customerName: "PT Maju Bersama",
      invoiceCount: 3,
      current: 30000000,
      aging1to30: 15000000,
      aging31to60: 10000000,
      aging61to90: 0,
      agingOver90: 0,
      total: 55000000,
    },
    {
      customerId: "CUST-002",
      customerName: "CV Harapan Baru",
      invoiceCount: 2,
      current: 20000000,
      aging1to30: 10000000,
      aging31to60: 5000000,
      aging61to90: 5000000,
      agingOver90: 0,
      total: 40000000,
    },
    {
      customerId: "CUST-003",
      customerName: "Toko Sinar Jaya",
      invoiceCount: 2,
      current: 0,
      aging1to30: 10000000,
      aging31to60: 5000000,
      aging61to90: 5000000,
      agingOver90: 5000000,
      total: 25000000,
    },
  ],
}
