import { type AttendanceReportItem } from "@/lib/attendance-report-data"
import { Progress } from "@workspace/ui/components/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

interface AttendanceReportTableProps {
  items: AttendanceReportItem[]
}

export function AttendanceReportTable({ items }: AttendanceReportTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
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
            <TableRow key={item.employeeId} className="hover:bg-muted/10 text-sm">
              <TableCell className="font-medium">{item.employeeName}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{item.department}</TableCell>
              <TableCell className="text-center tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                {item.presentCount}
              </TableCell>
              <TableCell className="text-center tabular-nums text-amber-600 dark:text-amber-400">
                {item.lateCount}
              </TableCell>
              <TableCell className="text-center tabular-nums text-rose-600 dark:text-rose-400">
                {item.absentCount}
              </TableCell>
              <TableCell className="text-center tabular-nums text-muted-foreground">
                {item.permitCount}
              </TableCell>
              <TableCell className="text-center tabular-nums text-muted-foreground">
                {item.sickCount}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={item.attendanceRate} className="h-2" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold tabular-nums min-w-[32px] text-right",
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

