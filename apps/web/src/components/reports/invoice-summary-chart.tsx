"use client"

import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@workspace/ui/components/chart"
import { type InvoiceReportStatus } from "@/lib/invoice-summary-data"

interface InvoiceSummaryChartProps {
  statusCounts: { status: InvoiceReportStatus; count: number; value: number }[]
}

const statusLabels: Record<InvoiceReportStatus, string> = {
  paid: "Terbayar",
  partially_paid: "Dibayar Sebagian",
  sent: "Terkirim",
  draft: "Draft",
  overdue: "Jatuh Tempo",
  cancelled: "Dibatalkan",
}

const statusColors: Record<InvoiceReportStatus, string> = {
  paid: "var(--chart-1)",
  sent: "var(--chart-2)",
  overdue: "var(--chart-5)", // destructive red-ish
  draft: "var(--chart-3)",
  partially_paid: "var(--chart-4)",
  cancelled: "var(--muted-foreground)",
}

const chartConfig = {
  value: {
    label: "Nilai (IDR)",
  },
} satisfies ChartConfig

export function InvoiceSummaryChart({ statusCounts }: InvoiceSummaryChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base font-semibold">Proporsi Status Invoice</CardTitle>
        <CardDescription>Pembagian total nilai nominal invoice berdasarkan status saat ini</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[220px]">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={statusCounts}
              dataKey="value"
              nameKey="status"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
            >
              {statusCounts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColors[entry.status]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs pb-6">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {statusCounts.map((entry) => (
            <div key={entry.status} className="flex items-center gap-1.5">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: statusColors[entry.status] }}
              />
              <span className="text-muted-foreground">
                {statusLabels[entry.status]} ({entry.count})
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
