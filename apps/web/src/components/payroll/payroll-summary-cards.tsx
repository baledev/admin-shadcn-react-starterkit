import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  IconCoins,
  IconClock,
  IconAlertCircle,
  IconUsers,
} from "@tabler/icons-react"
import { formatRupiah, type EmployeePayrollSummary } from "@/lib/payroll-data"

interface PayrollSummaryCardsProps {
  summaries: EmployeePayrollSummary[]
}

export function PayrollSummaryCards({ summaries }: PayrollSummaryCardsProps) {
  const activeSummaries = summaries.filter((s) => s.status !== "cancelled")

  const totalNetPay = activeSummaries.reduce(
    (sum, item) => sum + item.netPay,
    0
  )
  const totalOvertimePay = activeSummaries.reduce(
    (sum, item) => sum + item.overtimePay,
    0
  )
  const totalDeductions = activeSummaries.reduce(
    (sum, item) => sum + item.deductions,
    0
  )
  const totalEmployees = summaries.length

  const avgWorkHours =
    totalEmployees > 0
      ? Math.round(
          (summaries.reduce((sum, item) => sum + item.totalWorkHours, 0) /
            totalEmployees) *
            10
        ) / 10
      : 0

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardDescription className="text-xs font-medium tracking-widest uppercase">
              Total Payroll
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatRupiah(totalNetPay)}
            </CardTitle>
          </div>
          <IconCoins
            className="size-8 text-muted-foreground/50"
            aria-hidden="true"
          />
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardDescription className="text-xs font-medium tracking-widest uppercase">
              Total Overtime Pay
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatRupiah(totalOvertimePay)}
            </CardTitle>
          </div>
          <IconClock
            className="size-8 text-muted-foreground/50"
            aria-hidden="true"
          />
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardDescription className="text-xs font-medium tracking-widest uppercase">
              Total Deductions
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatRupiah(totalDeductions)}
            </CardTitle>
          </div>
          <IconAlertCircle
            className="size-8 text-muted-foreground/50"
            aria-hidden="true"
          />
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardDescription className="text-xs font-medium tracking-widest uppercase">
              Average Hours
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {avgWorkHours} hrs
            </CardTitle>
          </div>
          <IconUsers
            className="size-8 text-muted-foreground/50"
            aria-hidden="true"
          />
        </CardHeader>
      </Card>
    </div>
  )
}
