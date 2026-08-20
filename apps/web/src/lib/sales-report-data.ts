export interface SalesTrendData {
  period: string // e.g. "2026-08-01" or "August"
  sales: number
  orders: number
}

export interface SalesProductData {
  productId: string
  productName: string
  category: string
  quantitySold: number
  totalRevenue: number
}

export interface SalesCustomerData {
  customerId: string
  customerName: string
  orderCount: number
  totalSpent: number
}

export interface SalesReportSummary {
  period: string
  totalSales: number
  totalOrders: number
  avgOrderValue: number
  topProduct: string
  trend: SalesTrendData[]
  products: SalesProductData[]
  customers: SalesCustomerData[]
}

export const initialSalesReport: SalesReportSummary = {
  period: "2026-08",
  totalSales: 250000000,
  totalOrders: 125,
  avgOrderValue: 2000000,
  topProduct: "MacBook Pro M3",
  trend: [
    { period: "Minggu 1", sales: 50000000, orders: 25 },
    { period: "Minggu 2", sales: 70000000, orders: 35 },
    { period: "Minggu 3", sales: 65000000, orders: 30 },
    { period: "Minggu 4", sales: 65000000, orders: 35 },
  ],
  products: [
    {
      productId: "PRD-001",
      productName: "MacBook Pro M3",
      category: "Electronics",
      quantitySold: 10,
      totalRevenue: 200000000,
    },
    {
      productId: "PRD-002",
      productName: "iPhone 15 Pro",
      category: "Electronics",
      quantitySold: 3,
      totalRevenue: 45000000,
    },
    {
      productId: "PRD-003",
      productName: "Magic Keyboard",
      category: "Accessories",
      quantitySold: 5,
      totalRevenue: 5000000,
    },
  ],
  customers: [
    {
      customerId: "CUST-001",
      customerName: "PT Maju Bersama",
      orderCount: 5,
      totalSpent: 120000000,
    },
    {
      customerId: "CUST-002",
      customerName: "CV Harapan Baru",
      orderCount: 3,
      totalSpent: 80000000,
    },
    {
      customerId: "CUST-003",
      customerName: "Toko Sinar Jaya",
      orderCount: 2,
      totalSpent: 50000000,
    },
  ],
}
