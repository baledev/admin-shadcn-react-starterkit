import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { PayrollReportTable } from "@/components/reports/payroll-report-table"
import { initialPayrollReport } from "@/lib/payroll-report-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/payroll-report")({
  component: PayrollReportPage,
})

function PayrollReportPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialPayrollReport

  const summaryItems = [
    { label: "Total Pengeluaran Gaji", value: formatRupiah(data.totalPayroll), description: "Jumlah payroll bersih" },
    { label: "Total Karyawan Dibayar", value: `${data.employeeCount} Karyawan`, description: "Karyawan dalam daftar gaji" },
    { label: "Rata-Rata Gaji Bersih", value: formatRupiah(data.avgNetPay), description: "Rata-rata take home pay" },
    {
      label: "Total Potongan",
      value: formatRupiah(data.totalDeductions),
      description: "Denda absensi/pajak",
      trend: { value: "Sesuai", isPositive: true },
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Penggajian Karyawan (Payroll Report)"
            description="Informasi total belanja upah/gaji karyawan, tunjangan jabatan, potongan denda alpa, serta slip status pembayaran gaji per divisi."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <PayrollReportTable items={data.items} />
        </div>
      </div>
    </div>
  )
}
