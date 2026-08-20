import { type AttendanceReportItem } from "@/lib/attendance-report-data"
import { Progress } from "@workspace/ui/components/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

interface AttendanceReportTableProps {
  items: AttendanceReportItem[]
}

export function AttendanceReportTable({ items }: AttendanceReportTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Karyawan</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead className="text-center">Hadir</TableHead>
            <TableHead className="text-center">Terlambat</TableHead>
            <TableHead className="text-center">Absen (Alpa)</TableHead>
            <TableHead className="text-center">Izin</TableHead>
            <TableHead className="text-center">Sakit</TableHead>
            <TableHead className="w-[25%]">Tingkat Kehadiran (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.employeeId}
              className="text-sm hover:bg-muted/10"
            >
              <TableCell className="font-medium">{item.employeeName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {item.department}
              </TableCell>
              <TableCell className="text-center font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                {item.presentCount}
              </TableCell>
              <TableCell className="text-center text-amber-600 tabular-nums dark:text-amber-400">
                {item.lateCount}
              </TableCell>
              <TableCell className="text-center text-rose-600 tabular-nums dark:text-rose-400">
                {item.absentCount}
              </TableCell>
              <TableCell className="text-center text-muted-foreground tabular-nums">
                {item.permitCount}
              </TableCell>
              <TableCell className="text-center text-muted-foreground tabular-nums">
                {item.sickCount}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={item.attendanceRate} className="h-2" />
                  </div>
                  <span
                    className={cn(
                      "min-w-[32px] text-right text-xs font-bold tabular-nums",
                      item.attendanceRate >= 95
                        ? "text-emerald-600 dark:text-emerald-400"
                        : item.attendanceRate >= 90
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {item.attendanceRate}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
