import * as React from "react"
import { IconSearch, IconEye, IconPlus } from "@tabler/icons-react"
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
  type Transfer,
  TRANSFER_STATUS_META,
} from "@/lib/transfers-data"
import { formatRupiah } from "@/lib/accounts-data"

interface TransfersDataTableProps {
  data: Transfer[]
  onAddTransfer: () => void
  onViewDetail: (transfer: Transfer) => void
  onCompleteTransfer?: (transfer: Transfer) => void
}

export function TransfersDataTable({
  data,
  onAddTransfer,
  onViewDetail,
  onCompleteTransfer,
}: TransfersDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredData = React.useMemo(() => {
    return data.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.fromAccountName.toLowerCase().includes(search.toLowerCase()) ||
        t.toAccountName.toLowerCase().includes(search.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(search.toLowerCase()))

      const matchesStatus = statusFilter === "all" || t.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID transfer, akun asal/tujuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Batal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onAddTransfer}>
          <IconPlus className="size-4 mr-2" />
          Transfer Dana Baru
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">ID Mutasi</TableHead>
              <TableHead className="w-[110px]">Tanggal</TableHead>
              <TableHead>Dari Akun</TableHead>
              <TableHead>Ke Akun</TableHead>
              <TableHead className="text-right w-[150px]">Jumlah Transfer</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Tidak ada transaksi mutasi/transfer ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((t) => {
                const statusMeta = TRANSFER_STATUS_META[t.status]

                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">
                      <button
                        type="button"
                        className="hover:underline"
                        onClick={() => onViewDetail(t)}
                      >
                        {t.id}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{t.date}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{t.fromAccountName}</span>
                        <span className="font-mono text-xs text-muted-foreground">{t.fromAccountCode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{t.toAccountName}</span>
                        <span className="font-mono text-xs text-muted-foreground">{t.toAccountCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums font-semibold">
                      {formatRupiah(t.amount)}
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
                          onClick={() => onViewDetail(t)}
                          title="Lihat Detail"
                        >
                          <IconEye className="size-4" />
                        </Button>
                        {t.status === "draft" && onCompleteTransfer && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800"
                            onClick={() => onCompleteTransfer(t)}
                          >
                            Kirim
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
