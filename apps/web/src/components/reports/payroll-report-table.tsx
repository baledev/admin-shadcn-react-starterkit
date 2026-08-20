import { type PayrollReportItem } from "@/lib/payroll-report-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface PayrollReportTableProps {
  items: PayrollReportItem[]
}

export function PayrollReportTable({ items }: PayrollReportTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Karyawan</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead className="text-right">Gaji Pokok</TableHead>
            <TableHead className="text-right">Tunjangan</TableHead>
            <TableHead className="text-right">Potongan</TableHead>
            <TableHead className="text-right">Gaji Bersih (Net)</TableHead>
            <TableHead className="text-center">Status Bayar</TableHead>
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
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {formatRupiah(item.baseSalary)}
              </TableCell>
              <TableCell className="text-right text-emerald-600 tabular-nums dark:text-emerald-400">
                {item.allowance > 0 ? `+${formatRupiah(item.allowance)}` : "-"}
              </TableCell>
              <TableCell className="text-right text-rose-600 tabular-nums dark:text-rose-400">
                {item.deductions > 0
                  ? `-${formatRupiah(item.deductions)}`
                  : "-"}
              </TableCell>
              <TableCell className="text-right font-bold text-foreground tabular-nums">
                {formatRupiah(item.netPay)}
              </TableCell>
              <TableCell className="text-center">
                {item.paymentStatus === "paid" && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30"
                  >
                    Dibayar
                  </Badge>
                )}
                {item.paymentStatus === "processing" && (
                  <Badge
                    variant="outline"
                    className="bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30"
                  >
                    Diproses
                  </Badge>
                )}
                {item.paymentStatus === "unpaid" && (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground ring-border/50"
                  >
                    Belum Dibayar
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
