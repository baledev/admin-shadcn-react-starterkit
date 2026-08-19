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
  type ChartConfig,
} from "@workspace/ui/components/chart"

const chartData = [
  { month: "Januari", pendapatan: 180000000, pengeluaran: 120000000 },
  { month: "Februari", pendapatan: 220000000, pengeluaran: 150000000 },
  { month: "Maret", pendapatan: 250000000, pengeluaran: 180000000 },
  { month: "April", pendapatan: 290000000, pengeluaran: 170000000 },
  { month: "Mei", pendapatan: 310000000, pengeluaran: 210000000 },
  { month: "Juni", pendapatan: 350000000, pengeluaran: 250000000 },
]

const chartConfig = {
  pendapatan: {
    label: "Pendapatan (In)",
    color: "var(--chart-1)",
  },
  pengeluaran: {
    label: "Pengeluaran/Beban (Out)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function FinanceRevenueChart() {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Arus Kas & Kinerja Keuangan</CardTitle>
          <CardDescription>
            Grafik perbandingan Pendapatan Jasa vs Beban Operasional bulanan (Semester I - 2026)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillPendapatan" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pendapatan)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pendapatan)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillPengeluaran" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pengeluaran)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pengeluaran)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value / 1000000}jt`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pendapatan"
              type="monotone"
              fill="url(#fillPendapatan)"
              stroke="var(--color-pendapatan)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="pengeluaran"
              type="monotone"
              fill="url(#fillPengeluaran)"
              stroke="var(--color-pengeluaran)"
              strokeWidth={2}
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
