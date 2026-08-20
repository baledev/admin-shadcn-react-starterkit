import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { BalanceSheetTable } from "@/components/reports/balance-sheet-table"
import { initialBalanceSheet } from "@/lib/balance-sheet-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/balance-sheet")({
  component: BalanceSheetPage,
})

function BalanceSheetPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialBalanceSheet

  const summaryItems = [
    {
      label: "Total Aset (Aktiva)",
      value: formatRupiah(data.totalAssets),
      description: "Kas, piutang, persediaan, aset tetap",
    },
    {
      label: "Total Liabilitas",
      value: formatRupiah(data.totalLiabilities),
      description: "Hutang usaha, utang bank",
    },
    {
      label: "Total Ekuitas",
      value: formatRupiah(data.totalEquity),
      description: "Modal disetor & laba ditahan",
    },
    {
      label: "Rasio Lancar (Current Ratio)",
      value: "3.0x",
      description: "Kemampuan bayar kewajiban lancar",
      trend: { value: "Sehat", isPositive: true },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Neraca Keuangan (Balance Sheet)"
            description="Informasi mengenai posisi keuangan perusahaan pada tanggal tertentu, menyajikan total aset, kewajiban, dan ekuitas pemegang saham."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <BalanceSheetTable data={data} />
        </div>
      </div>
    </div>
  )
}
