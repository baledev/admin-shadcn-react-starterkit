import * as React from "react"
import { IconSearch, IconEye, IconPlus, IconWallet } from "@tabler/icons-react"
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
  type Kasbon,
  KASBON_STATUS_META,
} from "@/lib/kasbon-data"
import { formatRupiah } from "@/lib/accounts-data"

interface KasbonDataTableProps {
  data: Kasbon[]
  onAddKasbon: () => void
  onViewDetail: (kasbon: Kasbon) => void
  onRecordRepayment?: (kasbon: Kasbon) => void
}

export function KasbonDataTable({
  data,
  onAddKasbon,
  onViewDetail,
  onRecordRepayment,
}: KasbonDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredKasbons = React.useMemo(() => {
    return data.filter((k) => {
      const matchesSearch =
        k.id.toLowerCase().includes(search.toLowerCase()) ||
        k.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        k.purpose.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "all" || k.status === statusFilter

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
              placeholder="Cari ID kasbon, nama karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onAddKasbon}>
          <IconPlus className="size-4 mr-2" />
          Pengajuan Kasbon
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">ID Kasbon</TableHead>
              <TableHead>Karyawan</TableHead>
              <TableHead className="w-[110px]">Tanggal</TableHead>
              <TableHead>Tujuan / Keperluan</TableHead>
              <TableHead className="text-right w-[130px]">Plafon Kasbon</TableHead>
              <TableHead className="text-right w-[130px]">Sisa Tagihan</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKasbons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Tidak ada data kasbon ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredKasbons.map((k) => {
                const statusMeta = KASBON_STATUS_META[k.status]

                return (
                  <TableRow key={k.id}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">
                      <button
                        type="button"
                        className="hover:underline"
                        onClick={() => onViewDetail(k)}
                      >
                        {k.id}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{k.employeeName}</span>
                        <span className="text-xs text-muted-foreground">{k.employeeEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{k.date}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={k.purpose}>
                      {k.purpose}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {formatRupiah(k.amount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                      {formatRupiah(k.remainingAmount)}
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
                          onClick={() => onViewDetail(k)}
                          title="Lihat Detail"
                        >
                          <IconEye className="size-4" />
                        </Button>
                        {k.status === "active" && k.remainingAmount > 0 && onRecordRepayment && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs flex items-center gap-1"
                            onClick={() => onRecordRepayment(k)}
                            title="Bayar Cicilan"
                          >
                            <IconWallet className="size-3" />
                            Bayar
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
