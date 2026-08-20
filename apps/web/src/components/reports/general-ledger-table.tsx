import { type AccountLedger } from "@/lib/general-ledger-data"
import { formatRupiah } from "@/lib/payroll-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface GeneralLedgerTableProps {
  activeLedger: AccountLedger | undefined
}

export function GeneralLedgerTable({ activeLedger }: GeneralLedgerTableProps) {
  return (
    <div className="space-y-4">
      {activeLedger && (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3 text-sm font-semibold">
            <span>
              Buku Besar: {activeLedger.accountName} ({activeLedger.accountCode}
              )
            </span>
            <span className="font-normal text-muted-foreground">
              Saldo Awal:{" "}
              <strong className="text-foreground tabular-nums">
                {formatRupiah(activeLedger.openingBalance)}
              </strong>
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[12%]">Tanggal</TableHead>
                <TableHead className="w-[12%]">Ref</TableHead>
                <TableHead className="w-[40%]">Keterangan</TableHead>
                <TableHead className="w-[12%] text-right">Debit</TableHead>
                <TableHead className="w-[12%] text-right">Kredit</TableHead>
                <TableHead className="w-[12%] text-right">
                  Saldo Akhir
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLedger.entries.map((entry) => (
                <TableRow key={entry.id} className="text-sm hover:bg-muted/10">
                  <TableCell className="tabular-nums">{entry.date}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {entry.ref}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.description}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {entry.debit > 0 ? formatRupiah(entry.debit) : "-"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {entry.credit > 0 ? formatRupiah(entry.credit) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatRupiah(entry.balance)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="border-t-2 border-border bg-primary/5 font-bold">
                <TableCell colSpan={3}>Saldo Akhir Buku Besar</TableCell>
                <TableCell className="text-right tabular-nums" colSpan={3}>
                  {formatRupiah(activeLedger.closingBalance)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
