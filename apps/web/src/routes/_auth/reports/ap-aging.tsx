import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { APAgingTable } from "@/components/reports/ap-aging-table"
import { initialAPAging } from "@/lib/ap-aging-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/ap-aging")({
  component: APAgingPage,
})

function APAgingPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialAPAging

  const summaryItems = [
    {
      label: "Total Hutang Usaha (AP)",
      value: formatRupiah(data.totalAP),
      description: "Semua tagihan vendor belum dibayar",
    },
    {
      label: "Belum Jatuh Tempo (Current)",
      value: formatRupiah(data.totalCurrent),
      description: "Tagihan dalam masa termin",
    },
    {
      label: "Tertunggak (1 - 30 Hari)",
      value: formatRupiah(data.total1to30),
      description: "Tunggakan jangka pendek",
    },
    {
      label: "Tertunggak (&gt; 30 Hari)",
      value: formatRupiah(
        data.total31to60 + data.total61to90 + data.totalOver90
      ),
      description: "Jatuh tempo kritis",
      trend: { value: "Perhatian", isPositive: false },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Aging Hutang (AP Aging)"
            description="Analisis umur kewajiban hutang usaha yang mengelompokkan tagihan dari pemasok/vendor berdasarkan rentang waktu jatuh tempo."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <APAgingTable data={data} />
        </div>
      </div>
    </div>
  )
}
