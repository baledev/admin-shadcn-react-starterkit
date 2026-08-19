import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import {
  addDays,
  startOfWeek,
  startOfMonth,
  toIsoDate,
  isToday,
} from "@/lib/date-utils"
import { ROLE_META, type TeamMember } from "@/lib/team-data"
import { STATUS_META, type AttendanceRecord } from "@/lib/attendance-data"
import { AttendanceStatusCell } from "./attendance-status-cell"

interface AttendanceTableProps {
  view: "daily" | "weekly" | "monthly"
  anchorDate: Date
  records: AttendanceRecord[]
  employees: TeamMember[]
  onEditRecord?: (employeeId: string, date: string) => void
}

export function AttendanceTable({
  view,
  anchorDate,
  records,
  employees,
  onEditRecord,
}: AttendanceTableProps) {
  // Helper to find a record for a specific employee and date string
  const findRecord = (employeeId: string, dateStr: string) => {
    return records.find((r) => r.employeeId === employeeId && r.date === dateStr)
  }

  // Get initials for Avatar Fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Helper to calculate work duration
  const getDuration = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return "—"
    const [inH, inM] = checkIn.split(":").map(Number)
    const [outH, outM] = checkOut.split(":").map(Number)
    const diffMs =
      new Date(2000, 0, 1, outH, outM).getTime() -
      new Date(2000, 0, 1, inH, inM).getTime()
    if (diffMs <= 0) return "—"
    const hrs = Math.floor(diffMs / (1000 * 60 * 60))
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hrs}j ${mins}m`
  }

  // 1. DAILY VIEW
  if (view === "daily") {
    const dateStr = toIsoDate(anchorDate)

    return (
      <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Jam Masuk</th>
                <th className="px-4 py-3 text-center">Jam Keluar</th>
                <th className="px-4 py-3 text-center">Durasi Kerja</th>
                <th className="px-4 py-3">Keterangan</th>
                {onEditRecord && <th className="px-4 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((emp) => {
                const record = findRecord(emp.id, dateStr)
                const status = record?.status || "absent"
                const meta = STATUS_META[status]

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={emp.avatarUrl} alt={emp.name} />
                          <AvatarFallback className="text-xs">
                            {getInitials(emp.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm leading-none">
                            {emp.name}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {ROLE_META[emp.role].label}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="outline"
                        className={cn("px-2 py-0.5", meta.chip)}
                      >
                        <meta.icon className="mr-1 size-3" />
                        {meta.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs">
                      {record?.checkIn || "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs">
                      {record?.checkOut || "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-xs">
                      {getDuration(record?.checkIn, record?.checkOut)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                      {record?.note || "—"}
                    </td>
                    {onEditRecord && (
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onEditRecord(emp.id, dateStr)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Ubah
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // 2. WEEKLY VIEW
  if (view === "weekly") {
    const start = startOfWeek(anchorDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i))
    const weekdayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

    return (
      <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 min-w-56">Nama Karyawan</th>
                {weekDays.map((date, idx) => {
                  const isDayToday = isToday(date)
                  const dayNum = date.getDate()
                  return (
                    <th
                      key={idx}
                      className={cn(
                        "px-2 py-3 text-center min-w-16",
                        isDayToday && "bg-primary/5 text-primary"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] font-medium">
                          {weekdayNames[idx]}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 items-center justify-center text-xs rounded-full font-bold",
                            isDayToday && "bg-primary text-primary-foreground"
                          )}
                        >
                          {dayNum}
                        </span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarImage src={emp.avatarUrl} alt={emp.name} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs leading-none">
                          {emp.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {ROLE_META[emp.role].label}
                        </span>
                      </div>
                    </div>
                  </td>
                  {weekDays.map((date, idx) => {
                    const dateStr = toIsoDate(date)
                    const record = findRecord(emp.id, dateStr)
                    return (
                      <td
                        key={idx}
                        className={cn(
                          "px-2 py-2.5 text-center vertical-middle",
                          isToday(date) && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-center justify-center">
                          <AttendanceStatusCell record={record} date={date} />
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // 3. MONTHLY VIEW
  const startDay = startOfMonth(anchorDate)
  const daysInMonth = new Date(
    anchorDate.getFullYear(),
    anchorDate.getMonth() + 1,
    0
  ).getDate()
  const monthDays = Array.from({ length: daysInMonth }, (_, i) =>
    addDays(startDay, i)
  )

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-foreground">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 min-w-56 sticky left-0 z-10 bg-card/95 backdrop-blur-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Nama Karyawan
              </th>
              {monthDays.map((date, idx) => {
                const isDayToday = isToday(date)
                const dayNum = date.getDate()
                return (
                  <th
                    key={idx}
                    className={cn(
                      "px-1 py-2 text-center min-w-8 text-[10px]",
                      isDayToday && "bg-primary/5 text-primary"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 mx-auto items-center justify-center rounded-full font-bold",
                        isDayToday && "bg-primary text-primary-foreground"
                      )}
                    >
                      {dayNum}
                    </span>
                  </th>
                )
              })}
              <th className="px-3 py-3 text-center min-w-16 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
                Hadir
              </th>
              <th className="px-3 py-3 text-center min-w-16 bg-destructive/5 text-destructive">
                Alpa
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((emp) => {
              let presentCount = 0
              let absentCount = 0

              monthDays.forEach((date) => {
                const dateStr = toIsoDate(date)
                const record = findRecord(emp.id, dateStr)
                const dayOfWeek = date.getDay()
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                if (record) {
                  if (record.status === "present" || record.status === "late") {
                    presentCount++
                  } else if (record.status === "absent") {
                    absentCount++
                  }
                } else if (!isWeekend && date <= new Date()) {
                  absentCount++
                }
              })

              return (
                <tr
                  key={emp.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium sticky left-0 z-10 bg-card/95 backdrop-blur-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarImage src={emp.avatarUrl} alt={emp.name} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs leading-none">
                          {emp.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {ROLE_META[emp.role].label}
                        </span>
                      </div>
                    </div>
                  </td>
                  {monthDays.map((date, idx) => {
                    const dateStr = toIsoDate(date)
                    const record = findRecord(emp.id, dateStr)
                    return (
                      <td
                        key={idx}
                        className={cn(
                          "px-1 py-2 text-center",
                          isToday(date) && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-center justify-center">
                          <AttendanceStatusCell record={record} date={date} />
                        </div>
                      </td>
                    )
                  })}
                  <td className="px-3 py-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 tabular-nums text-xs">
                    {presentCount}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-destructive bg-destructive/5 tabular-nums text-xs">
                    {absentCount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
