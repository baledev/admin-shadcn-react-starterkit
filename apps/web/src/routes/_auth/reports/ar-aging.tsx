import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { ARAgingTable } from "@/components/reports/ar-aging-table"
import { initialARAging } from "@/lib/ar-aging-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/ar-aging")({
  component: ARAgingPage,
})

function ARAgingPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialARAging

  const summaryItems = [
    { label: "Total Piutang Usaha (AR)", value: formatRupiah(data.totalAR), description: "Semua invoice belum lunas" },
    { label: "Belum Jatuh Tempo (Current)", value: formatRupiah(data.totalCurrent), description: "Invoice dalam masa kredit" },
    { label: "Tertunggak (1 - 60 Hari)", value: formatRupiah(data.total1to30 + data.total31to60), description: "Tunggakan jangka pendek" },
    {
      label: "Kritis (&gt; 60 Hari)",
      value: formatRupiah(data.total61to90 + data.totalOver90),
      description: "Perlu segera ditagih",
      trend: { value: "Perhatian", isPositive: false },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Aging Piutang (AR Aging)"
            description="Analisis umur piutang usaha yang mengelompokkan tagihan kepada pelanggan berdasarkan rentang waktu keterlambatan pembayaran."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <ARAgingTable data={data} />
        </div>
      </div>
    </div>
  )
}
