import { type APAgingSummary } from "@/lib/ap-aging-data"
import { formatRupiah } from "@/lib/payroll-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface APAgingTableProps {
  data: APAgingSummary
}

export function APAgingTable({ data }: APAgingTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Nama Vendor</TableHead>
            <TableHead className="w-[10%] text-center">Bill Count</TableHead>
            <TableHead className="w-[12%] text-right">Current</TableHead>
            <TableHead className="w-[12%] text-right">1 - 30 Hari</TableHead>
            <TableHead className="w-[12%] text-right">31 - 60 Hari</TableHead>
            <TableHead className="w-[12%] text-right">61 - 90 Hari</TableHead>
            <TableHead className="w-[12%] text-right">&gt; 90 Hari</TableHead>
            <TableHead className="w-[12%] text-right font-semibold">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.entries.map((entry) => (
            <TableRow
              key={entry.vendorId}
              className="text-sm hover:bg-muted/10"
            >
              <TableCell className="font-medium">{entry.vendorName}</TableCell>
              <TableCell className="text-center text-muted-foreground tabular-nums">
                {entry.billCount}
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {entry.current > 0 ? formatRupiah(entry.current) : "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {entry.aging1to30 > 0 ? formatRupiah(entry.aging1to30) : "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {entry.aging31to60 > 0 ? formatRupiah(entry.aging31to60) : "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {entry.aging61to90 > 0 ? formatRupiah(entry.aging61to90) : "-"}
              </TableCell>
              <TableCell className="text-right text-rose-600 tabular-nums dark:text-rose-400">
                {entry.agingOver90 > 0 ? formatRupiah(entry.agingOver90) : "-"}
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatRupiah(entry.total)}
              </TableCell>
            </TableRow>
          ))}

          {/* Totals Row */}
          <TableRow className="border-t-2 border-border bg-primary/5 text-sm font-bold">
            <TableCell colSpan={2}>TOTAL HUTANG</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatRupiah(data.totalCurrent)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatRupiah(data.total1to30)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatRupiah(data.total31to60)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatRupiah(data.total61to90)}
            </TableCell>
            <TableCell className="text-right text-rose-600 tabular-nums dark:text-rose-400">
              {formatRupiah(data.totalOver90)}
            </TableCell>
            <TableCell className="text-right text-primary tabular-nums">
              {formatRupiah(data.totalAP)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
