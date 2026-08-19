import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { InvoiceSummaryChart } from "@/components/reports/invoice-summary-chart"
import { InvoiceSummaryTable } from "@/components/reports/invoice-summary-table"
import { initialInvoiceSummary } from "@/lib/invoice-summary-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/invoice-summary")({
  component: InvoiceSummaryPage,
})

function InvoiceSummaryPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialInvoiceSummary

  const summaryItems = [
    { label: "Total Invoice Diterbitkan", value: formatRupiah(data.totalInvoiced), description: "Total nilai tagihan keluar" },
    { label: "Total Terbayar", value: formatRupiah(data.totalPaid), description: "Tagihan yang sudah dilunasi" },
    { label: "Total Outstanding", value: formatRupiah(data.totalOutstanding), description: "Tagihan terkirim belum dibayar" },
    {
      label: "Total Terlambat (Overdue)",
      value: formatRupiah(data.totalOverdue),
      description: "Melewati tanggal jatuh tempo",
      trend: { value: "Tindak Lanjut", isPositive: false },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Ringkasan Invoice (Invoice Summary)"
            description="Rekapitulasi status tagihan keluar, rasio pelunasan piutang, nominal tagihan outstanding, dan daftar invoice jatuh tempo."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <InvoiceSummaryTable items={data.items} />
            </div>
            <div>
              <InvoiceSummaryChart statusCounts={data.statusCounts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
