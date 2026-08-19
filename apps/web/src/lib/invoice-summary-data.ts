export type InvoiceReportStatus = "paid" | "partially_paid" | "sent" | "draft" | "overdue" | "cancelled"

export interface InvoiceReportItem {
  invoiceId: string
  invoiceNumber: string
  customerName: string
  issueDate: string
  dueDate: string
  amount: number
  paidAmount: number
  outstandingAmount: number
  status: InvoiceReportStatus
}

export interface InvoiceReportSummary {
  period: string
  totalInvoiced: number
  totalPaid: number
  totalOutstanding: number
  totalOverdue: number
  statusCounts: { status: InvoiceReportStatus; count: number; value: number }[]
  items: InvoiceReportItem[]
}

export const initialInvoiceSummary: InvoiceReportSummary = {
  period: "2026-08",
  totalInvoiced: 350000000,
  totalPaid: 210000000,
  totalOutstanding: 140000000,
  totalOverdue: 25000000,
  statusCounts: [
    { status: "paid", count: 12, value: 210000000 },
    { status: "sent", count: 5, value: 90000000 },
    { status: "overdue", count: 2, value: 25000000 },
    { status: "draft", count: 3, value: 25000000 },
  ],
  items: [
    { invoiceId: "INV-001", invoiceNumber: "INV-2026-001", customerName: "PT Maju Bersama", issueDate: "2026-08-01", dueDate: "2026-08-15", amount: 120000000, paidAmount: 120000000, outstandingAmount: 0, status: "paid" },
    { invoiceId: "INV-002", invoiceNumber: "INV-2026-002", customerName: "CV Harapan Baru", issueDate: "2026-08-05", dueDate: "2026-08-20", amount: 90000000, paidAmount: 90000000, outstandingAmount: 0, status: "paid" },
    { invoiceId: "INV-003", invoiceNumber: "INV-2026-003", customerName: "Toko Sinar Jaya", issueDate: "2026-08-10", dueDate: "2026-09-10", amount: 90000000, paidAmount: 0, outstandingAmount: 90000000, status: "sent" },
    { invoiceId: "INV-004", invoiceNumber: "INV-2026-004", customerName: "PT Maju Bersama", issueDate: "2026-08-15", dueDate: "2026-08-30", amount: 25000000, paidAmount: 0, outstandingAmount: 25000000, status: "overdue" },
    { invoiceId: "INV-005", invoiceNumber: "INV-2026-005", customerName: "CV Harapan Baru", issueDate: "2026-08-25", dueDate: "2026-09-25", amount: 25000000, paidAmount: 0, outstandingAmount: 25000000, status: "draft" },
  ],
}
