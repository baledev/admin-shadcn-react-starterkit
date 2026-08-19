import * as React from "react"
import { IconSearch, IconEye, IconBan, IconPlus } from "@tabler/icons-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  type JournalEntry,
  JOURNAL_TYPE_META,
  ENTRY_STATUS_META,
} from "@/lib/journal-entries-data"
import { formatRupiah } from "@/lib/accounts-data"

interface JournalEntryDataTableProps {
  data: JournalEntry[]
  onAddEntry: () => void
  onViewDetail: (entry: JournalEntry) => void
  onCancelEntry: (entry: JournalEntry) => void
}

export function JournalEntryDataTable({
  data,
  onAddEntry,
  onViewDetail,
  onCancelEntry,
}: JournalEntryDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredEntries = React.useMemo(() => {
    return data.filter((entry) => {
      const matchesSearch =
        entry.id.toLowerCase().includes(search.toLowerCase()) ||
        (entry.reference && entry.reference.toLowerCase().includes(search.toLowerCase())) ||
        (entry.note && entry.note.toLowerCase().includes(search.toLowerCase()))

      const matchesType = typeFilter === "all" || entry.type === typeFilter
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [data, search, typeFilter, statusFilter])

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID, referensi, catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Jurnal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jurnal</SelectItem>
              <SelectItem value="general">Jurnal Umum</SelectItem>
              <SelectItem value="sales">Jurnal Penjualan</SelectItem>
              <SelectItem value="purchase">Jurnal Pembelian</SelectItem>
              <SelectItem value="cash">Jurnal Kas/Bank</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="cancelled">Batal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onAddEntry}>
          <IconPlus className="size-4 mr-2" />
          Input Jurnal Manual
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">ID Jurnal</TableHead>
              <TableHead className="w-[120px]">Tanggal</TableHead>
              <TableHead className="w-[150px]">Referensi</TableHead>
              <TableHead>Keterangan / Catatan</TableHead>
              <TableHead className="w-[130px]">Jurnal</TableHead>
              <TableHead className="text-right w-[150px]">Total Debit/Kredit</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Tidak ada transaksi jurnal ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => {
                const typeMeta = JOURNAL_TYPE_META[entry.type]
                const statusMeta = ENTRY_STATUS_META[entry.status]

                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm font-medium">
                      <button
                        type="button"
                        className="text-primary hover:underline font-semibold"
                        onClick={() => onViewDetail(entry)}
                      >
                        {entry.id}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{entry.date}</TableCell>
                    <TableCell className="font-medium max-w-[150px] truncate">
                      {entry.reference || <span className="text-muted-foreground/50 italic">-</span>}
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate" title={entry.note}>
                      {entry.note}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${typeMeta.color} font-medium`}>
                        {typeMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums font-semibold">
                      {formatRupiah(entry.totalDebit)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`ring-1 ${statusMeta.chip}`}>
                        {statusMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => onViewDetail(entry)}
                          aria-label="Lihat detail"
                        >
                          <IconEye className="size-4" />
                        </Button>
                        {entry.status === "posted" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:bg-destructive/15"
                            onClick={() => onCancelEntry(entry)}
                            aria-label="Batalkan jurnal"
                          >
                            <IconBan className="size-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
