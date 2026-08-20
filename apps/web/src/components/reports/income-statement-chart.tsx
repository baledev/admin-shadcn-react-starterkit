"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import { type ChartDataPoint } from "@/lib/income-statement-data"
import { formatRupiah } from "@/lib/accounts-data"

interface IncomeStatementChartProps {
  data: ChartDataPoint[]
  granularity: "weekly" | "monthly" | "quarterly" | "yearly"
  year: number
}

const chartConfig = {
  revenue: {
    label: "Pendapatan (Revenue)",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Total Beban & HPP (Expense)",
    color: "var(--chart-2)",
  },
  netProfit: {
    label: "Laba Bersih (Net Profit)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function IncomeStatementChart({
  data,
  granularity,
  year,
}: IncomeStatementChartProps) {
  // Translate granularity label for description
  const granularityLabels = {
    weekly: "Mingguan",
    monthly: "Bulanan",
    quarterly: "Kuartalan",
    yearly: "Tahunan (YoY)",
  }

  // Format currency tick labels on YAxis (e.g. 100,000,000 -> 100jt, 1,000,000,000 -> 1M)
  const formatYAxisTick = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `${(value / 1000000000).toFixed(1).replace(/\.0$/, "")}M`
    }
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(0)}jt`
    }
    return value.toString()
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-col gap-1.5 px-6 py-5">
        <CardTitle className="text-base font-semibold">
          Tren Laba Rugi ({granularityLabels[granularity]})
        </CardTitle>
        <CardDescription>
          {granularity === "yearly"
            ? "Perbandingan performa keuangan tahunan (YoY) untuk Pendapatan, Beban, dan Laba Bersih."
            : `Perbandingan performa keuangan ${granularityLabels[granularity].toLowerCase()} untuk tahun ${year}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <AreaChart
            data={data}
            margin={{ left: 12, right: 12, top: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.2}
                />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillExp" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.2}
                />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.15}
                />
                <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border/40"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={formatYAxisTick}
              className="text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => {
                    const label =
                      chartConfig[name as keyof typeof chartConfig]?.label ||
                      name
                    return (
                      <div className="flex w-full items-center justify-between gap-6">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatRupiah(Number(value))}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Area
              dataKey="revenue"
              name="revenue"
              type="monotone"
              fill="url(#fillRev)"
              stroke="var(--chart-1)"
              strokeWidth={2}
            />
            <Area
              dataKey="expense"
              name="expense"
              type="monotone"
              fill="url(#fillExp)"
              stroke="var(--chart-2)"
              strokeWidth={2}
            />
            <Area
              dataKey="netProfit"
              name="netProfit"
              type="monotone"
              fill="url(#fillNet)"
              stroke="var(--chart-3)"
              strokeWidth={2.5}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
