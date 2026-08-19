import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { TrialBalanceTable } from "@/components/reports/trial-balance-table"
import { initialTrialBalance } from "@/lib/trial-balance-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/trial-balance")({
  component: TrialBalancePage,
})

function TrialBalancePage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialTrialBalance

  const summaryItems = [
    { label: "Total Saldo Debit", value: formatRupiah(data.totalDebit), description: "Jumlah seluruh akun bersaldo debit" },
    { label: "Total Saldo Kredit", value: formatRupiah(data.totalCredit), description: "Jumlah seluruh akun bersaldo kredit" },
    {
      label: "Status Neraca Percobaan",
      value: "Balanced",
      description: "Debit & Kredit sama besar",
      trend: { value: "Sesuai", isPositive: true },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Neraca Saldo / Percobaan (Trial Balance)"
            description="Laporan yang mencantumkan semua saldo debit dan kredit dari setiap akun buku besar pada akhir periode akuntansi untuk memverifikasi akurasi matematis."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <TrialBalanceTable data={data} />
        </div>
      </div>
    </div>
  )
}
