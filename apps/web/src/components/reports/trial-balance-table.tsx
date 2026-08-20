import { type TrialBalanceData } from "@/lib/trial-balance-data"
import { formatRupiah } from "@/lib/payroll-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface TrialBalanceTableProps {
  data: TrialBalanceData
}

export function TrialBalanceTable({ data }: TrialBalanceTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Kode Akun</TableHead>
            <TableHead className="w-[45%]">Nama Akun</TableHead>
            <TableHead className="w-[20%] text-right">Debit</TableHead>
            <TableHead className="w-[20%] text-right">Kredit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item) => (
            <TableRow
              key={item.accountCode}
              className="text-sm hover:bg-muted/10"
            >
              <TableCell className="font-mono text-xs">
                {item.accountCode}
              </TableCell>
              <TableCell className="font-medium">{item.accountName}</TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {item.debit > 0 ? formatRupiah(item.debit) : "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {item.credit > 0 ? formatRupiah(item.credit) : "-"}
              </TableCell>
            </TableRow>
          ))}

          {/* Totals */}
          <TableRow className="border-t-2 border-border bg-primary/5 text-base font-bold text-foreground">
            <TableCell colSpan={2}>TOTAL</TableCell>
            <TableCell className="py-4 text-right text-primary tabular-nums">
              {formatRupiah(data.totalDebit)}
            </TableCell>
            <TableCell className="py-4 text-right text-primary tabular-nums">
              {formatRupiah(data.totalCredit)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
