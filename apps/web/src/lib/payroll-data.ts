import { type TeamMember, type TeamRole } from "./team-data"
import { type AttendanceRecord } from "./attendance-data"

export type PayrollStatus = "draft" | "processing" | "paid" | "cancelled"

export interface EmployeePayrollSummary {
  id: string // e.g. "PAY-2026-08-USR-001"
  employeeId: string
  employeeName: string
  avatarUrl?: string
  role: TeamRole
  period: string // e.g. "2026-08"

  // Attendance Breakdown
  workDays: number // present + late
  absentDays: number
  sickDays: number
  leaveDays: number
  permissionDays: number
  holidayDays: number
  offDays: number

  // Work Hours
  totalWorkHours: number
  regularHours: number
  overtimeHours: number

  // Financials
  baseSalary: number
  overtimePay: number
  deductions: number
  grossPay: number
  netPay: number

  status: PayrollStatus
  runAt?: string
  paidAt?: string
}

export const BASE_SALARY: Record<TeamRole, number> = {
  owner: 25_000_000,
  admin: 15_000_000,
  member: 10_000_000,
  viewer: 7_500_000,
}

export const OVERTIME_RATE = 75_000 // per hour
export const ABSENT_PENALTY = 200_000 // per day absent

export const STATUS_META: Record<
  PayrollStatus,
  { label: string; chip: string; dot: string }
> = {
  draft: {
    label: "Draft",
    chip: "bg-muted text-muted-foreground ring-border/50",
    dot: "bg-muted-foreground/40",
  },
  processing: {
    label: "Processing",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
    dot: "bg-blue-500",
  },
  paid: {
    label: "Paid",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
    dot: "bg-destructive",
  },
}

export const STATUS_OPTIONS = (Object.keys(STATUS_META) as PayrollStatus[]).map(
  (key) => ({
    value: key,
    label: STATUS_META[key].label,
  })
)

// Helper to format Rupiah currency
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Utility to parse time string HH:mm into decimal hours
function parseTimeToHours(timeStr?: string): number {
  if (!timeStr) return 0
  const [hours, minutes] = timeStr.split(":").map(Number)
  if (isNaN(hours) || isNaN(minutes)) return 0
  return hours + minutes / 60
}

// Helper to calculate payroll for all active employees for a given period (yyyy-MM)
export function computePayrollFromAttendance(
  employees: TeamMember[],
  attendanceRecords: AttendanceRecord[],
  period: string
): EmployeePayrollSummary[] {
  return employees
    .filter((emp) => emp.status === "active") // only active employees get payroll
    .map((emp) => {
      // Filter records for this employee in this period
      const empRecords = attendanceRecords.filter(
        (rec) => rec.employeeId === emp.id && rec.date.startsWith(period)
      )

      let workDays = 0
      let absentDays = 0
      let sickDays = 0
      let leaveDays = 0
      let permissionDays = 0
      let holidayDays = 0
      let offDays = 0

      let totalWorkHours = 0
      let regularHours = 0
      let overtimeHours = 0

      empRecords.forEach((rec) => {
        switch (rec.status) {
          case "present":
          case "late":
            workDays++
            if (rec.checkIn && rec.checkOut) {
              const inHours = parseTimeToHours(rec.checkIn)
              const outHours = parseTimeToHours(rec.checkOut)
              let duration = Math.max(0, outHours - inHours)

              // Round to 1 decimal place
              duration = Math.round(duration * 10) / 10

              totalWorkHours += duration

              // Standard work hours per day is 8. Overtime is anything above 8 hours.
              const dailyReg = Math.min(duration, 8)
              const dailyOt = Math.max(0, duration - 8)

              regularHours += dailyReg
              overtimeHours += dailyOt
            } else {
              // Default to 8 regular hours if check-in/out is missing but status is present/late
              totalWorkHours += 8
              regularHours += 8
            }
            break
          case "absent":
            absentDays++
            break
          case "sick":
            sickDays++
            break
          case "leave":
            leaveDays++
            break
          case "permission":
            permissionDays++
            break
          case "holiday":
            holidayDays++
            break
          case "off":
            offDays++
            break
        }
      })

      // Calculate financials
      const baseSalary = BASE_SALARY[emp.role] || 0
      const overtimePay = Math.round(overtimeHours * OVERTIME_RATE)
      const deductions = absentDays * ABSENT_PENALTY
      const grossPay = baseSalary + overtimePay
      const netPay = Math.max(0, grossPay - deductions)

      return {
        id: `PAY-${period}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        avatarUrl: emp.avatarUrl,
        role: emp.role,
        period,

        workDays,
        absentDays,
        sickDays,
        leaveDays,
        permissionDays,
        holidayDays,
        offDays,

        totalWorkHours: Math.round(totalWorkHours * 10) / 10,
        regularHours: Math.round(regularHours * 10) / 10,
        overtimeHours: Math.round(overtimeHours * 10) / 10,

        baseSalary,
        overtimePay,
        deductions,
        grossPay,
        netPay,

        status: "draft" as PayrollStatus,
      }
    })
}

export function computePayrollStats(summaries: EmployeePayrollSummary[]) {
  const totalEmployees = summaries.length
  if (totalEmployees === 0) {
    return {
      totalNetPay: 0,
      totalOvertimePay: 0,
      totalDeductions: 0,
      avgWorkHours: 0,
    }
  }

  let totalNetPay = 0
  let totalOvertimePay = 0
  let totalDeductions = 0
  let sumWorkHours = 0

  summaries.forEach((sum) => {
    totalNetPay += sum.netPay
    totalOvertimePay += sum.overtimePay
    totalDeductions += sum.deductions
    sumWorkHours += sum.totalWorkHours
  })

  return {
    totalNetPay,
    totalOvertimePay,
    totalDeductions,
    avgWorkHours: Math.round((sumWorkHours / totalEmployees) * 10) / 10,
  }
}
