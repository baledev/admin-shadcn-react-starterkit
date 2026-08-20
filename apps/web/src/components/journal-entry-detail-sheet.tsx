import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@workspace/ui/components/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  type JournalEntry,
  JOURNAL_TYPE_META,
  ENTRY_STATUS_META,
} from "@/lib/journal-entries-data"
import { formatRupiah } from "@/lib/accounts-data"

interface JournalEntryDetailSheetProps {
  entry: JournalEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JournalEntryDetailSheet({
  entry,
  open,
  onOpenChange,
}: JournalEntryDetailSheetProps) {
  if (!entry) return null

  const typeMeta = JOURNAL_TYPE_META[entry.type]
  const statusMeta = ENTRY_STATUS_META[entry.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-mono text-lg">
            Detail Journal Entry: {entry.id}
          </SheetTitle>
          <SheetDescription>
            Tercatat pada tanggal {entry.date}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 space-y-6 overflow-y-auto px-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">
                Status
              </span>
              <Badge variant="outline" className={`ring-1 ${statusMeta.chip}`}>
                {statusMeta.label}
              </Badge>
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">
                Jurnal
              </span>
              <Badge variant="secondary" className={`${typeMeta.color}`}>
                {typeMeta.label}
              </Badge>
            </div>
            <div className="col-span-2">
              <span className="mb-1 block text-xs text-muted-foreground">
                Referensi
              </span>
              <span className="text-sm font-semibold text-foreground">
                {entry.reference || (
                  <span className="font-normal text-muted-foreground/50 italic">
                    -
                  </span>
                )}
              </span>
            </div>
            <div className="col-span-2">
              <span className="mb-1 block text-xs text-muted-foreground">
                Catatan / Deskripsi Utama
              </span>
              <span className="text-sm font-medium text-foreground">
                {entry.note || "-"}
              </span>
            </div>
          </div>

          {/* Ledger Lines */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">
              Rincian Pos Debet / Kredit (Double-Entry)
            </h4>
            <div className="overflow-hidden rounded-md border border-border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px]">Akun</TableHead>
                    <TableHead>Keterangan Line</TableHead>
                    <TableHead className="w-[110px] text-right">
                      Debet
                    </TableHead>
                    <TableHead className="w-[110px] text-right">
                      Kredit
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entry.lines.map((line, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-semibold">
                            {line.accountCode}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {line.accountName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="max-w-[120px] truncate text-xs font-medium"
                        title={line.description}
                      >
                        {line.description || (
                          <span className="text-muted-foreground/30 italic">
                            Sama dengan utama
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {line.debit > 0 ? formatRupiah(line.debit) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {line.credit > 0 ? formatRupiah(line.credit) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Totals Row */}
                  <TableRow className="bg-muted/40 font-bold">
                    <TableCell colSpan={2} className="text-sm">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-foreground tabular-nums">
                      {formatRupiah(entry.totalDebit)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-foreground tabular-nums">
                      {formatRupiah(entry.totalCredit)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto border-t border-border pt-4">
          <SheetClose render={<Button variant="outline" />}>Tutup</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
