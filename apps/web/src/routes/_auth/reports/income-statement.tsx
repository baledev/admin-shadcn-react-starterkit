import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { IncomeStatementTable } from "@/components/reports/income-statement-table"
import { initialIncomeStatement } from "@/lib/income-statement-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/income-statement")({
  component: IncomeStatementPage,
})

function IncomeStatementPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1), // Aug 1, 2026
    to: new Date(2026, 7, 31), // Aug 31, 2026
  })

  const data = initialIncomeStatement

  const summaryItems = [
    { label: "Total Pendapatan", value: formatRupiah(data.revenue), description: "Pendapatan usaha kotor" },
    { label: "Total Beban & HPP", value: formatRupiah(data.expense), description: "Harga pokok + pengeluaran" },
    { label: "Laba Bersih", value: formatRupiah(data.netProfit), description: "Laba sebelum pajak" },
    {
      label: "Margin Laba Bersih",
      value: `${data.margin}%`,
      description: "Rasio profitabilitas",
      trend: { value: "+4.2%", isPositive: true },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Laba Rugi (Income Statement)"
            description="Ringkasan kinerja keuangan perusahaan yang menunjukkan pendapatan, harga pokok penjualan, beban operasional, dan laba bersih."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <IncomeStatementTable
            details={data.details}
            revenue={data.revenue}
            expense={data.expense}
            netProfit={data.netProfit}
          />
        </div>
      </div>
    </div>
  )
}
