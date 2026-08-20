import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { IncomeStatementTable } from "@/components/reports/income-statement-table"
import { IncomeStatementChart } from "@/components/reports/income-statement-chart"
import {
  initialIncomeStatement,
  monthlyIncomeTrendData,
  generateDetails,
  getChartData,
} from "@/lib/income-statement-data"
import { formatRupiah } from "@/lib/accounts-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

export const Route = createFileRoute("/_auth/reports/income-statement")({
  component: IncomeStatementPage,
})

function IncomeStatementPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1), // Aug 1, 2026
    to: new Date(2026, 7, 31), // Aug 31, 2026
  })

  const [selectedYear, setSelectedYear] = React.useState<number>(2026)
  const [granularity, setGranularity] = React.useState<
    "weekly" | "monthly" | "quarterly" | "yearly"
  >("monthly")

  // Handle Date Selection Change
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    if (newDate?.from) {
      const year = newDate.from.getFullYear()
      if (year !== selectedYear && [2024, 2025, 2026].includes(year)) {
        setSelectedYear(year)
      }
    }
  }

  // Handle Year Change dropdown
  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    // Update the date picker selection range to cover the whole year selected
    setDate({
      from: new Date(year, 0, 1),
      to: new Date(year, 11, 31),
    })
  }

  // Compute active statement data for table and summary cards based on selected Date Range
  const data = React.useMemo(() => {
    if (!date?.from) return initialIncomeStatement

    const fromDate = date.from
    const toDate = date.to || date.from

    // Filter matching months within date range boundary
    const matchingMonths = monthlyIncomeTrendData.filter((item) => {
      const itemDate = new Date(item.year, item.month - 1, 15) // Use middle of month to avoid TZ edge cases
      return itemDate >= fromDate && itemDate <= toDate
    })

    if (matchingMonths.length === 0) {
      return {
        period: "-",
        revenue: 0,
        expense: 0,
        netProfit: 0,
        margin: 0,
        details: generateDetails(0, 0),
      }
    }

    const revenue = matchingMonths.reduce((sum, m) => sum + m.revenue, 0)
    const expense = matchingMonths.reduce((sum, m) => sum + m.expense, 0)
    const netProfit = revenue - expense
    const margin = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0

    // Format Period Label nicely (e.g. "Agu 2026" or "Jan 2026 - Des 2026")
    const startMonth = fromDate.toLocaleDateString("id-ID", { month: "short" })
    const startYear = fromDate.getFullYear()
    const endMonth = toDate.toLocaleDateString("id-ID", { month: "short" })
    const endYear = toDate.getFullYear()

    const period =
      startMonth === endMonth && startYear === endYear
        ? `${startMonth} ${startYear}`
        : `${startMonth} ${startYear} - ${endMonth} ${endYear}`

    return {
      period,
      revenue,
      expense,
      netProfit,
      margin,
      details: generateDetails(revenue, expense),
    }
  }, [date])

  const chartData = React.useMemo(() => {
    return getChartData(selectedYear, granularity, date)
  }, [selectedYear, granularity, date])

  const summaryItems = [
    {
      label: "Total Pendapatan",
      value: formatRupiah(data.revenue),
      description: `Total untuk periode ${data.period}`,
    },
    {
      label: "Total Beban & HPP",
      value: formatRupiah(data.expense),
      description: "Harga pokok + pengeluaran",
    },
    {
      label: "Laba Bersih",
      value: formatRupiah(data.netProfit),
      description: "Laba sebelum pajak",
    },
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

          <ReportFilterBar date={date} onDateChange={handleDateChange}>
            <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
              {/* Year Select dropdown */}
              {granularity !== "yearly" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Tahun:
                  </span>
                  <Select
                    value={String(selectedYear)}
                    onValueChange={(val) => handleYearChange(Number(val))}
                  >
                    <SelectTrigger className="h-9 w-24">
                      <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Granularity Selector ToggleGroup */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Tren:
                </span>
                <ToggleGroup
                  value={[granularity]}
                  onValueChange={(val) => {
                    const selected = val.at(-1)
                    if (
                      selected === "weekly" ||
                      selected === "monthly" ||
                      selected === "quarterly" ||
                      selected === "yearly"
                    ) {
                      setGranularity(selected)
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  <ToggleGroupItem value="weekly">Mingguan</ToggleGroupItem>
                  <ToggleGroupItem value="monthly">Bulanan</ToggleGroupItem>
                  <ToggleGroupItem value="quarterly">Kuartalan</ToggleGroupItem>
                  <ToggleGroupItem value="yearly">Tahunan</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </ReportFilterBar>

          <ReportSummaryCards items={summaryItems} />

          <IncomeStatementChart
            data={chartData}
            granularity={granularity}
            year={selectedYear}
          />

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
