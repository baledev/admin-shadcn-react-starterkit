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
  type EquityTransaction,
  EQUITY_TYPE_META,
  EQUITY_STATUS_META,
} from "@/lib/equity-data"
import { formatRupiah } from "@/lib/accounts-data"

interface EquityDataTableProps {
  data: EquityTransaction[]
  onAddTransaction: () => void
  onViewDetail: (tx: EquityTransaction) => void
  onApproveTransaction?: (tx: EquityTransaction) => void
}

export function EquityDataTable({
  data,
  onAddTransaction,
  onViewDetail,
  onApproveTransaction,
}: EquityDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")

  const filteredData = React.useMemo(() => {
    return data.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(search.toLowerCase()) ||
        tx.investorName.toLowerCase().includes(search.toLowerCase()) ||
        (tx.note && tx.note.toLowerCase().includes(search.toLowerCase()))

      const matchesType = typeFilter === "all" || tx.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [data, search, typeFilter])

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID transaksi, pemilik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Semua Tipe Modal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe Modal</SelectItem>
              <SelectItem value="initial_capital">Modal Awal</SelectItem>
              <SelectItem value="capital_addition">Penambahan Modal</SelectItem>
              <SelectItem value="prive">Prive / Penarikan</SelectItem>
              <SelectItem value="retained_earnings_distribution">Pencairan Laba Ditahan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onAddTransaction}>
          <IconPlus className="size-4 mr-2" />
          Input Transaksi Modal
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">ID Transaksi</TableHead>
              <TableHead className="w-[180px]">Jenis Modal</TableHead>
              <TableHead>Pihak / Pemilik</TableHead>
              <TableHead className="w-[110px]">Tanggal</TableHead>
              <TableHead className="text-right w-[150px]">Jumlah</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Tidak ada transaksi ekuitas ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((tx) => {
                const typeMeta = EQUITY_TYPE_META[tx.type]
                const statusMeta = EQUITY_STATUS_META[tx.status]

                return (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">
                      <button
                        type="button"
                        className="hover:underline"
                        onClick={() => onViewDetail(tx)}
                      >
                        {tx.id}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`ring-1 ${typeMeta.chip}`}>
                        {typeMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{tx.investorName}</span>
                        {tx.note && (
                          <span className="text-xs text-muted-foreground max-w-[200px] truncate" title={tx.note}>
                            {tx.note}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{tx.date}</TableCell>
                    <TableCell className={`text-right font-mono text-sm tabular-nums font-semibold ${tx.type === "prive" || tx.type === "retained_earnings_distribution" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {tx.type === "prive" || tx.type === "retained_earnings_distribution" ? "-" : ""}
                      {formatRupiah(tx.amount)}
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
                          onClick={() => onViewDetail(tx)}
                          title="Lihat Detail"
                        >
                          <IconEye className="size-4" />
                        </Button>
                        {tx.status === "draft" && onApproveTransaction && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800"
                            onClick={() => onApproveTransaction(tx)}
                          >
                            Setujui
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
