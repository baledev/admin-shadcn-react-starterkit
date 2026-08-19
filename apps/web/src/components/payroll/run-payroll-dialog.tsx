import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { formatRupiah, type EmployeePayrollSummary } from "@/lib/payroll-data"
import { IconAlertCircle } from "@tabler/icons-react"

interface RunPayrollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: string
  summaries: EmployeePayrollSummary[]
  onConfirm: () => void
}

export function RunPayrollDialog({
  open,
  onOpenChange,
  period,
  summaries,
  onConfirm,
}: RunPayrollDialogProps) {
  const activeSummaries = summaries.filter((s) => s.status !== "cancelled")
  const totalEmployees = activeSummaries.length
  const totalNetPay = activeSummaries.reduce((sum, s) => sum + s.netPay, 0)

  // Format period for display, e.g. "2026-08" -> "August 2026"
  const formatPeriod = (periodStr: string) => {
    const [year, month] = periodStr.split("-").map(Number)
    if (!year || !month) return periodStr
    const date = new Date(year, month - 1, 1)
    return date.toLocaleString("en-US", { month: "long", year: "numeric" })
  }

  const previewCount = 5
  const previewItems = activeSummaries.slice(0, previewCount)
  const remainingCount = Math.max(0, totalEmployees - previewCount)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Run Payroll — {formatPeriod(period)}</DialogTitle>
          <DialogDescription>
            You are about to run and process payroll calculations for this
            period.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <IconAlertCircle className="mt-0.5 size-5 shrink-0" />
            <div>
              <span className="block font-semibold">Calculation Source</span>
              Payroll is calculated automatically based on employee attendance
              records (hours worked and overtime rules) for the active roster in{" "}
              {formatPeriod(period)}.
            </div>
          </div>

          {/* Preview List */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Salary Preview
            </span>
            <div className="max-h-[200px] divide-y overflow-y-auto rounded-lg border bg-muted/20 text-xs">
              {previewItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5"
                >
                  <div className="min-w-0">
                    <span className="block truncate font-medium text-foreground">
                      {item.employeeName}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      {item.workDays} days worked ({item.overtimeHours} hrs OT)
                    </span>
                  </div>
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatRupiah(item.netPay)}
                  </span>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="bg-muted/10 p-2 text-center text-[11px] text-muted-foreground italic">
                  and {remainingCount} other employee
                  {remainingCount > 1 ? "s" : ""}...
                </div>
              )}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <span className="block text-xs font-medium text-muted-foreground uppercase">
                Total Employees
              </span>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {totalEmployees} Active
              </span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-medium text-muted-foreground uppercase">
                Total Net Payroll
              </span>
              <span className="text-lg font-bold text-primary tabular-nums">
                {formatRupiah(totalNetPay)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" />}>
            Cancel
          </DialogClose>
          <Button type="button" onClick={onConfirm}>
            Run Payroll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
