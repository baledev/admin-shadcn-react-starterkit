import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { ROLE_META } from "@/lib/team-data"
import {
  formatRupiah,
  STATUS_META,
  type EmployeePayrollSummary,
} from "@/lib/payroll-data"
import { IconCalendar, IconClock, IconCash } from "@tabler/icons-react"

interface PayrollDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: EmployeePayrollSummary | null
}

export function PayrollDetailSheet({
  open,
  onOpenChange,
  summary,
}: PayrollDetailSheetProps) {
  if (!summary) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const roleInfo = ROLE_META[summary.role]
  const statusInfo = STATUS_META[summary.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b p-6 pb-4">
          <SheetTitle>Salary Slip Details</SheetTitle>
          <SheetDescription>
            Detailed payroll calculations and attendance summary for{" "}
            {summary.employeeName}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-6 pt-4">
          {/* Employee Info Header */}
          <div className="flex items-center gap-4 border-b pb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={summary.avatarUrl} alt={summary.employeeName} />
              <AvatarFallback>
                {getInitials(summary.employeeName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-foreground">
                {summary.employeeName}
              </h4>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`px-1.5 py-0 text-[10px] ${roleInfo?.chip}`}
                >
                  {roleInfo?.label || summary.role}
                </Badge>
                <Badge
                  variant="outline"
                  className={`px-1.5 py-0 text-[10px] ${statusInfo?.chip}`}
                >
                  {statusInfo?.label || summary.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xs font-medium text-muted-foreground uppercase">
                Period
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {summary.period}
              </span>
            </div>
          </div>

          {/* Section: Attendance Summary */}
          <div className="space-y-2">
            <h5 className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              <IconCalendar className="size-4" /> Attendance Summary
            </h5>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-center">
              <div>
                <span className="block text-[10px] font-medium text-muted-foreground uppercase">
                  Work Days
                </span>
                <span className="text-lg font-semibold text-foreground tabular-nums">
                  {summary.workDays}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-medium text-muted-foreground uppercase">
                  Absent
                </span>
                <span
                  className={`text-lg font-semibold tabular-nums ${summary.absentDays > 0 ? "text-destructive" : "text-foreground"}`}
                >
                  {summary.absentDays}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-medium text-muted-foreground uppercase">
                  Leave
                </span>
                <span className="text-lg font-semibold text-foreground tabular-nums">
                  {summary.leaveDays}
                </span>
              </div>
              <div className="border-t border-border/30 pt-2">
                <span className="block text-[10px] font-medium text-muted-foreground uppercase">
                  Sick
                </span>
                <span className="text-lg font-semibold text-foreground tabular-nums">
                  {summary.sickDays}
                </span>
              </div>
              <div className="border-t border-border/30 pt-2">
                <span className="block text-[10px] font-medium text-muted-foreground uppercase">
                  Permission
                </span>
                <span className="text-lg font-semibold text-foreground tabular-nums">
                  {summary.permissionDays}
                </span>
              </div>
              <div className="border-t border-border/30 pt-2">
                <span className="block text-[10px] font-medium text-muted-foreground uppercase">
                  Holiday/Off
                </span>
                <span className="text-lg font-semibold text-foreground tabular-nums">
                  {summary.holidayDays + summary.offDays}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Work Hours */}
          <div className="space-y-2">
            <h5 className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              <IconClock className="size-4" /> Work Hours Breakdown
            </h5>
            <div className="space-y-2 rounded-lg bg-muted/40 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Regular Work Hours
                </span>
                <span className="font-semibold tabular-nums">
                  {summary.regularHours} hrs
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Overtime Work Hours
                </span>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  +{summary.overtimeHours} hrs
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-2 text-sm font-semibold">
                <span className="text-foreground">Total Work Hours</span>
                <span className="text-foreground tabular-nums">
                  {summary.totalWorkHours} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Section: Financials Breakdown */}
          <div className="space-y-2">
            <h5 className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              <IconCash className="size-4" /> Financials
            </h5>
            <div className="space-y-3 rounded-lg bg-muted/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Base Salary</span>
                <span className="font-semibold tabular-nums">
                  {formatRupiah(summary.baseSalary)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Overtime Pay</span>
                  <span className="text-[10px] text-muted-foreground/80">
                    ({summary.overtimeHours} hrs @ Rp 75.000/hr)
                  </span>
                </div>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  +{formatRupiah(summary.overtimePay)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">
                    Deductions (Unpaid Absent)
                  </span>
                  <span className="text-[10px] text-muted-foreground/80">
                    ({summary.absentDays} days @ Rp 200.000/day)
                  </span>
                </div>
                <span className="font-semibold text-destructive tabular-nums">
                  -{formatRupiah(summary.deductions)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border/45 pt-3">
                <span className="font-bold text-foreground">
                  Net Take-Home Pay
                </span>
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatRupiah(summary.netPay)}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Run Details */}
          {summary.runAt && (
            <div className="space-y-1 border-t pt-2 text-[11px] text-muted-foreground/60">
              <div className="flex justify-between">
                <span>Calculated on:</span>
                <span className="font-medium tabular-nums">
                  {new Date(summary.runAt).toLocaleString("id-ID")}
                </span>
              </div>
              {summary.paidAt && (
                <div className="flex justify-between">
                  <span>Paid on:</span>
                  <span className="font-medium tabular-nums">
                    {new Date(summary.paidAt).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
