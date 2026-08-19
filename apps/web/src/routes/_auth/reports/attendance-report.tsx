import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { AttendanceReportTable } from "@/components/reports/attendance-report-table"
import { initialAttendanceReport } from "@/lib/attendance-report-data"

export const Route = createFileRoute("/_auth/reports/attendance-report")({
  component: AttendanceReportPage,
})

function AttendanceReportPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialAttendanceReport

  const summaryItems = [
    { label: "Total Karyawan Aktif", value: `${data.totalActiveEmployees} Orang`, description: "Karyawan wajib absensi" },
    {
      label: "Rata-Rata Kehadiran",
      value: `${data.avgAttendanceRate}%`,
      description: "Tingkat persentase hadir",
      trend: { value: "Sangat Baik", isPositive: true },
    },
    { label: "Total Kasus Terlambat", value: `${data.totalLate} Kali`, description: "Keterlambatan jam masuk kerja" },
    {
      label: "Total Alpa / Absen",
      value: `${data.totalAbsent} Hari`,
      description: "Ketidakhadiran tanpa keterangan",
      trend: data.totalAbsent > 0 ? { value: "Perhatian", isPositive: false } : undefined,
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Kehadiran Karyawan (Attendance Report)"
            description="Informasi rekap tingkat absensi karyawan, kepatuhan jam kerja, kasus keterlambatan, alpa, sakit, dan persentase kehadiran berkala."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <AttendanceReportTable items={data.items} />
        </div>
      </div>
    </div>
  )
}
