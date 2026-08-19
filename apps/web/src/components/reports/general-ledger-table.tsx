import { type AccountLedger } from "@/lib/general-ledger-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

interface GeneralLedgerTableProps {
  activeLedger: AccountLedger | undefined
}

export function GeneralLedgerTable({ activeLedger }: GeneralLedgerTableProps) {
  return (
    <div className="space-y-4">
      {activeLedger && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="bg-muted/40 px-4 py-3 border-b border-border flex justify-between items-center text-sm font-semibold">
            <span>Buku Besar: {activeLedger.accountName} ({activeLedger.accountCode})</span>
            <span className="text-muted-foreground font-normal">
              Saldo Awal: <strong className="text-foreground tabular-nums">{formatRupiah(activeLedger.openingBalance)}</strong>
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[12%]">Tanggal</TableHead>
                <TableHead className="w-[12%]">Ref</TableHead>
                <TableHead className="w-[40%]">Keterangan</TableHead>
                <TableHead className="text-right w-[12%]">Debit</TableHead>
                <TableHead className="text-right w-[12%]">Kredit</TableHead>
                <TableHead className="text-right w-[12%]">Saldo Akhir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLedger.entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/10 text-sm">
                  <TableCell className="tabular-nums">{entry.date}</TableCell>
                  <TableCell className="font-mono text-xs">{entry.ref}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {entry.debit > 0 ? formatRupiah(entry.debit) : "-"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {entry.credit > 0 ? formatRupiah(entry.credit) : "-"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatRupiah(entry.balance)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="border-t-2 border-border font-bold bg-primary/5">
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
