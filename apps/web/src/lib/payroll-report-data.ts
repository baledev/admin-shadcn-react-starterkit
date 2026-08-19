export interface PayrollReportItem {
  employeeId: string
  employeeName: string
  department: string
  baseSalary: number
  allowance: number
  deductions: number
  netPay: number
  paymentStatus: "paid" | "processing" | "unpaid"
}

export interface PayrollReportSummary {
  period: string
  totalPayroll: number
  employeeCount: number
  avgNetPay: number
  totalDeductions: number
  items: PayrollReportItem[]
}

export const initialPayrollReport: PayrollReportSummary = {
  period: "2026-08",
  totalPayroll: 62500000,
  employeeCount: 5,
  avgNetPay: 12500000,
  totalDeductions: 1500000,
  items: [
    { employeeId: "USR-001", employeeName: "Budi Santoso", department: "Engineering", baseSalary: 15000000, allowance: 2500000, deductions: 500000, netPay: 17000000, paymentStatus: "paid" },
    { employeeId: "USR-002", employeeName: "Siti Rahma", department: "HR & Finance", baseSalary: 12000000, allowance: 1500000, deductions: 200000, netPay: 13300000, paymentStatus: "paid" },
    { employeeId: "USR-003", employeeName: "Andi Wijaya", department: "Sales & Marketing", baseSalary: 10000000, allowance: 3000000, deductions: 300000, netPay: 12700000, paymentStatus: "paid" },
    { employeeId: "USR-004", employeeName: "Rudi Hermawan", department: "Operations", baseSalary: 10000000, allowance: 1000000, deductions: 500000, netPay: 10500000, paymentStatus: "paid" },
    { employeeId: "USR-005", employeeName: "Dewi Lestari", department: "Design", baseSalary: 8000000, allowance: 1000000, deductions: 0, netPay: 9000000, paymentStatus: "paid" },
  ],
}
