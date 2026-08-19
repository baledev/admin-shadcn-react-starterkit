import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconCalendar,
  IconChartBar,
  IconClock,
  IconDownload,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { PageHeader } from "@/components/page-header"
import {
  computeAnalyticsSummary,
  dailyMetrics,
  trafficSources,
  weeklyOrders,
} from "@/lib/analytics-data"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const Route = createFileRoute("/_auth/analytics")({
  component: AnalyticsPage,
})

// ─── Chart Configs ────────────────────────────────────────────────────────────

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const ordersChartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const growthChartConfig = {
  newCustomers: {
    label: "New Customers",
    color: "var(--chart-3)",
  },
  churnedCustomers: {
    label: "Churned",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const pieChartConfig = {
  sessions: {
    label: "Sessions",
  },
} satisfies ChartConfig

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

// ─── Stat Cards Component ─────────────────────────────────────────────────────

function AnalyticsStatCards() {
  const { totalRevenue, totalOrders, avgOrderValue, netCustomerGrowth } =
    computeAnalyticsSummary(dailyMetrics)

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n)

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:overflow-visible *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtCurrency(totalRevenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-3.5" aria-hidden="true" />
              Growth
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Accumulated past 30 days
          </div>
          <div className="text-muted-foreground">Excludes returns & tax</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOrders}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconChartBar className="size-3.5" aria-hidden="true" />
              Volume
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders processed
          </div>
          <div className="text-muted-foreground">Avg. 23.3 orders/day</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Order Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtCurrency(avgOrderValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3.5" aria-hidden="true" />
              Basket
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Per-transaction average
          </div>
          <div className="text-muted-foreground">Up 4.2% from last month</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Net Customer Growth</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            +{netCustomerGrowth}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-3.5" aria-hidden="true" />
              Audience
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Acquisitions vs Churn
          </div>
          <div className="text-muted-foreground">
            {dailyMetrics.reduce((sum, m) => sum + m.newCustomers, 0)} new,{" "}
            {dailyMetrics.reduce((sum, m) => sum + m.churnedCustomers, 0)} left
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState("30d")

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Analytics"
            description="Detailed charts, reports, and performance metrics."
          >
            <div className="flex items-center gap-2">
              <Select
                value={dateRange}
                onValueChange={(val) => setDateRange(val ?? "30d")}
              >
                <SelectTrigger className="h-8 w-36 gap-1.5 text-xs">
                  <IconCalendar className="size-3.5" />
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("CSV Export not yet implemented.")}
              >
                <IconDownload className="size-4" aria-hidden="true" />
                Export CSV
              </Button>
            </div>
          </PageHeader>

          {/* Stat Cards */}
          <AnalyticsStatCards />

          {/* Charts grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Area Chart: Revenue */}
            <Card>
              <CardHeader>
                <CardDescription>Revenue Trend</CardDescription>
                <CardTitle className="text-lg font-semibold">
                  Daily Sales Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={revenueChartConfig}
                  className="aspect-auto h-full w-full"
                >
                  <AreaChart data={dailyMetrics}>
                    <defs>
                      <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      dataKey="revenue"
                      type="natural"
                      fill="url(#fillRev)"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Bar Chart: Orders */}
            <Card>
              <CardHeader>
                <CardDescription>Order Volume</CardDescription>
                <CardTitle className="text-lg font-semibold">
                  Weekly Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={ordersChartConfig}
                  className="aspect-auto h-full w-full"
                >
                  <BarChart data={weeklyOrders}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="orders"
                      fill="var(--chart-2)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Line Chart: Customers */}
            <Card>
              <CardHeader>
                <CardDescription>User Growth</CardDescription>
                <CardTitle className="text-lg font-semibold">
                  Acquisitions & Churn
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={growthChartConfig}
                  className="aspect-auto h-full w-full"
                >
                  <LineChart data={dailyMetrics}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Line
                      dataKey="newCustomers"
                      type="monotone"
                      stroke="var(--chart-3)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey="churnedCustomers"
                      type="monotone"
                      stroke="var(--chart-4)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pie Chart: Traffic Source */}
            <Card>
              <CardHeader>
                <CardDescription>Acquisition Channels</CardDescription>
                <CardTitle className="text-lg font-semibold">
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-[300px] items-center justify-center">
                <ChartContainer
                  config={pieChartConfig}
                  className="mx-auto aspect-square max-h-[250px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={trafficSources}
                      dataKey="sessions"
                      nameKey="source"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {trafficSources.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-wrap justify-center gap-x-4 gap-y-1.5 pb-4 text-xs">
                {trafficSources.map((src, i) => (
                  <div key={src.source} className="flex items-center gap-1.5">
                    <div
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    <span className="text-muted-foreground">{src.source}</span>
                    <span className="font-semibold tabular-nums">
                      ({src.percentage}%)
                    </span>
                  </div>
                ))}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
