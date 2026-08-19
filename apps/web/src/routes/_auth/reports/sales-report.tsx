import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { SalesReportChart } from "@/components/reports/sales-report-chart"
import { SalesReportTable } from "@/components/reports/sales-report-table"
import { initialSalesReport } from "@/lib/sales-report-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/sales-report")({
  component: SalesReportPage,
})

function SalesReportPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialSalesReport

  const summaryItems = [
    { label: "Total Omset Penjualan", value: formatRupiah(data.totalSales), description: "Pendapatan kotor penjualan" },
    { label: "Jumlah Transaksi (Order)", value: `${data.totalOrders} Order`, description: "Total pesanan masuk" },
    { label: "Rata-Rata Nilai Order", value: formatRupiah(data.avgOrderValue), description: "AOV per transaksi" },
    {
      label: "Produk Terlaris",
      value: data.topProduct,
      description: "Paling banyak menghasilkan",
      trend: { value: "Top", isPositive: true },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Penjualan (Sales Report)"
            description="Informasi analitik performa penjualan produk dan jasa, jumlah order, tren transaksi, dan kontribusi pelanggan terbaik."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <SalesReportChart data={data.trend} />

          <SalesReportTable products={data.products} customers={data.customers} />
        </div>
      </div>
    </div>
  )
}
