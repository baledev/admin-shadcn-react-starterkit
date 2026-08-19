"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@workspace/ui/components/chart"
import { type SalesTrendData } from "@/lib/sales-report-data"

interface SalesReportChartProps {
  data: SalesTrendData[]
}

const chartConfig = {
  sales: {
    label: "Penjualan (IDR)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SalesReportChart({ data }: SalesReportChartProps) {
  return (
    <Card className="col-span-full">
      <CardHeader className="px-6 py-5">
        <CardTitle className="text-base font-semibold">Tren Penjualan Mingguan</CardTitle>
        <CardDescription>Visualisasi grafik pendapatan penjualan per minggu untuk periode ini</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value / 1000000}jt`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
