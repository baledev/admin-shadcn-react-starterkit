import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { CashFlowTable } from "@/components/reports/cash-flow-table"
import { initialCashFlow } from "@/lib/cash-flow-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/cash-flow")({
  component: CashFlowPage,
})

function CashFlowPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialCashFlow

  const summaryItems = [
    {
      label: "Kas Aktivitas Operasi",
      value: formatRupiah(data.netOperating),
      description: "Arus kas bersih operasional",
    },
    {
      label: "Kas Aktivitas Investasi",
      value: formatRupiah(data.netInvesting),
      description: "Pembelian/penjualan aset",
    },
    {
      label: "Kas Aktivitas Pendanaan",
      value: formatRupiah(data.netFinancing),
      description: "Modal disetor, pinjaman",
    },
    {
      label: "Saldo Akhir Kas",
      value: formatRupiah(data.closingBalance),
      description: "Total kas siap pakai",
      trend: { value: "+100%", isPositive: true },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Arus Kas (Cash Flow Statement)"
            description="Laporan yang melacak aliran masuk dan keluar kas dari aktivitas operasi, investasi, dan pendanaan selama periode tertentu."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <CashFlowTable data={data} />
        </div>
      </div>
    </div>
  )
}
