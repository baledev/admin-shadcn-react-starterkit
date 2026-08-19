import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { IconCalculator, IconCoins } from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { MonthYearPicker } from "@workspace/ui/components/month-year-picker"
import { PageHeader } from "@/components/page-header"
import { initialTeamMembers } from "@/lib/team-data"
import { initialAttendanceRecords } from "@/lib/attendance-data"
import {
  computePayrollFromAttendance,
  type EmployeePayrollSummary,
} from "@/lib/payroll-data"
import { PayrollSummaryCards } from "@/components/payroll/payroll-summary-cards"
import { PayrollDataTable } from "@/components/payroll/payroll-data-table"
import { PayrollDetailSheet } from "@/components/payroll/payroll-detail-sheet"
import { RunPayrollDialog } from "@/components/payroll/run-payroll-dialog"

export const Route = createFileRoute("/_auth/payroll")({
  component: PayrollPage,
})

function PayrollPage() {
  const [period, setPeriod] = React.useState("2026-08")

  // In-memory store for payroll records per period
  const [payrollStore, setPayrollStore] = React.useState<
    Record<string, EmployeePayrollSummary[]>
  >({})

  // UI state
  const [selectedSummary, setSelectedSummary] =
    React.useState<EmployeePayrollSummary | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [runDialogOpen, setRunDialogOpen] = React.useState(false)

  // Derived / computed summaries on demand (memoized to avoid recalculation on render)
  const summaries = React.useMemo(() => {
    if (!payrollStore[period]) {
      return computePayrollFromAttendance(
        initialTeamMembers,
        initialAttendanceRecords,
        period
      )
    }
    return payrollStore[period]
  }, [period, payrollStore])

  // Check if payroll has been run for this period
  const isProcessed =
    summaries.length > 0 && summaries.some((s) => s.status === "paid")

  // Handlers
  function handleViewDetails(summary: EmployeePayrollSummary) {
    setSelectedSummary(summary)
    setDetailOpen(true)
  }

  function handleMarkPaid(summary: EmployeePayrollSummary) {
    setPayrollStore((prev) => {
      const current =
        prev[period] ||
        computePayrollFromAttendance(
          initialTeamMembers,
          initialAttendanceRecords,
          period
        )
      const updated = current.map((item) =>
        item.id === summary.id
          ? {
              ...item,
              status: "paid" as const,
              runAt: item.runAt || new Date().toISOString(),
              paidAt: new Date().toISOString(),
            }
          : item
      )
      return {
        ...prev,
        [period]: updated,
      }
    })
    toast.success(`Payroll for ${summary.employeeName} marked as Paid`)
  }

  function handleCancelPayroll(summary: EmployeePayrollSummary) {
    setPayrollStore((prev) => {
      const current =
        prev[period] ||
        computePayrollFromAttendance(
          initialTeamMembers,
          initialAttendanceRecords,
          period
        )
      const updated = current.map((item) =>
        item.id === summary.id
          ? {
              ...item,
              status: "cancelled" as const,
            }
          : item
      )
      return {
        ...prev,
        [period]: updated,
      }
    })
    toast.error(`Payroll for ${summary.employeeName} has been cancelled`)
  }

  function handleRunBulkPayroll() {
    setPayrollStore((prev) => {
      const current =
        prev[period] ||
        computePayrollFromAttendance(
          initialTeamMembers,
          initialAttendanceRecords,
          period
        )
      const updated = current.map((item) =>
        item.status === "draft" || item.status === "processing"
          ? {
              ...item,
              status: "paid" as const,
              runAt: new Date().toISOString(),
              paidAt: new Date().toISOString(),
            }
          : item
      )
      return {
        ...prev,
        [period]: updated,
      }
    })
    setRunDialogOpen(false)
    toast.success(`Successfully ran payroll for period ${period}`)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Payroll"
            description="Manage employee payroll, calculate salaries, and review work/overtime hours."
          >
            {!isProcessed ? (
              <Button size="sm" onClick={() => setRunDialogOpen(true)}>
                <IconCalculator className="size-4" aria-hidden="true" />
                Run Payroll
              </Button>
            ) : (
              <Button size="sm" variant="secondary" disabled>
                <IconCoins className="size-4" aria-hidden="true" />
                Payroll Processed
              </Button>
            )}
          </PageHeader>

          {/* Period selector */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Period:
              </span>
              <MonthYearPicker
                value={period}
                onChange={setPeriod}
                className="h-9 w-48"
              />
            </div>
            <div className="hidden text-xs text-muted-foreground sm:block">
              Showing calculations for active employee roster
            </div>
          </div>

          {/* KPI Summary Cards */}
          <PayrollSummaryCards summaries={summaries} />

          {/* Data Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Employee Salary Breakdown
              </h3>
            </div>
            <PayrollDataTable
              data={summaries}
              onViewDetails={handleViewDetails}
              onMarkPaid={handleMarkPaid}
              onCancel={handleCancelPayroll}
            />
          </div>
        </div>
      </div>

      {/* Sheets and Dialogs rendered outside as siblings */}
      <PayrollDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        summary={selectedSummary}
      />

      <RunPayrollDialog
        open={runDialogOpen}
        onOpenChange={setRunDialogOpen}
        period={period}
        summaries={summaries}
        onConfirm={handleRunBulkPayroll}
      />
    </div>
  )
}
