import { type APAgingSummary } from "@/lib/ap-aging-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

interface APAgingTableProps {
  data: APAgingSummary
}

export function APAgingTable({ data }: APAgingTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Nama Vendor</TableHead>
            <TableHead className="w-[10%] text-center">Bill Count</TableHead>
            <TableHead className="text-right w-[12%]">Current</TableHead>
            <TableHead className="text-right w-[12%]">1 - 30 Hari</TableHead>
            <TableHead className="text-right w-[12%]">31 - 60 Hari</TableHead>
            <TableHead className="text-right w-[12%]">61 - 90 Hari</TableHead>
            <TableHead className="text-right w-[12%]">&gt; 90 Hari</TableHead>
            <TableHead className="text-right w-[12%] font-semibold">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.entries.map((entry) => (
            <TableRow key={entry.vendorId} className="hover:bg-muted/10 text-sm">
              <TableCell className="font-medium">{entry.vendorName}</TableCell>
              <TableCell className="text-center tabular-nums text-muted-foreground">{entry.billCount}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {entry.current > 0 ? formatRupiah(entry.current) : "-"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {entry.aging1to30 > 0 ? formatRupiah(entry.aging1to30) : "-"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {entry.aging31to60 > 0 ? formatRupiah(entry.aging31to60) : "-"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {entry.aging61to90 > 0 ? formatRupiah(entry.aging61to90) : "-"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-rose-600 dark:text-rose-400">
                {entry.agingOver90 > 0 ? formatRupiah(entry.agingOver90) : "-"}
              </TableCell>
              <TableCell className="text-right tabular-nums font-semibold">
                {formatRupiah(entry.total)}
              </TableCell>
            </TableRow>
          ))}

          {/* Totals Row */}
          <TableRow className="border-t-2 border-border font-bold bg-primary/5 text-sm">
            <TableCell colSpan={2}>TOTAL HUTANG</TableCell>
            <TableCell className="text-right tabular-nums">{formatRupiah(data.totalCurrent)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatRupiah(data.total1to30)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatRupiah(data.total31to60)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatRupiah(data.total61to90)}</TableCell>
            <TableCell className="text-right tabular-nums text-rose-600 dark:text-rose-400">
              {formatRupiah(data.totalOver90)}
            </TableCell>
            <TableCell className="text-right tabular-nums text-primary">{formatRupiah(data.totalAP)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

