import { type TrialBalanceData } from "@/lib/trial-balance-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

interface TrialBalanceTableProps {
  data: TrialBalanceData
}

export function TrialBalanceTable({ data }: TrialBalanceTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Kode Akun</TableHead>
            <TableHead className="w-[45%]">Nama Akun</TableHead>
            <TableHead className="text-right w-[20%]">Debit</TableHead>
            <TableHead className="text-right w-[20%]">Kredit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item) => (
            <TableRow key={item.accountCode} className="hover:bg-muted/10 text-sm">
              <TableCell className="font-mono text-xs">{item.accountCode}</TableCell>
              <TableCell className="font-medium">{item.accountName}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {item.debit > 0 ? formatRupiah(item.debit) : "-"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {item.credit > 0 ? formatRupiah(item.credit) : "-"}
              </TableCell>
            </TableRow>
          ))}

          {/* Totals */}
          <TableRow className="border-t-2 border-border font-bold text-foreground bg-primary/5 text-base">
            <TableCell colSpan={2}>TOTAL</TableCell>
            <TableCell className="text-right py-4 tabular-nums text-primary">
              {formatRupiah(data.totalDebit)}
            </TableCell>
            <TableCell className="text-right py-4 tabular-nums text-primary">
              {formatRupiah(data.totalCredit)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

