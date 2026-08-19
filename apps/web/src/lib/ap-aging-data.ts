export interface APAgingEntry {
  vendorId: string
  vendorName: string
  billCount: number
  current: number
  aging1to30: number
  aging31to60: number
  aging61to90: number
  agingOver90: number
  total: number
}

export interface APAgingSummary {
  asOfDate: string
  totalAP: number
  totalCurrent: number
  total1to30: number
  total31to60: number
  total61to90: number
  totalOver90: number
  entries: APAgingEntry[]
}

export const initialAPAging: APAgingSummary = {
  asOfDate: "2026-08-31",
  totalAP: 90000000,
  totalCurrent: 40000000,
  total1to30: 25000000,
  total31to60: 15000000,
  total61to90: 10000000,
  totalOver90: 0,
  entries: [
    {
      vendorId: "VND-001",
      vendorName: "Global Tech Supplier",
      billCount: 2,
      current: 25000000,
      aging1to30: 15000000,
      aging31to60: 5000000,
      aging61to90: 0,
      agingOver90: 0,
      total: 45000000,
    },
    {
      vendorId: "VND-002",
      vendorName: "PT Logistik Indonesia",
      billCount: 2,
      current: 15000000,
      aging1to30: 10000000,
      aging31to60: 10000000,
      aging61to90: 10000000,
      agingOver90: 0,
      total: 45000000,
    },
  ],
}
