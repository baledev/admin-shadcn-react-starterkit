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
  type Payment,
  PAYMENT_DIRECTION_META,
  PAYMENT_STATUS_META,
  PAYMENT_METHOD_META,
} from "@/lib/payments-data"
import { formatRupiah } from "@/lib/accounts-data"

interface PaymentsDataTableProps {
  data: Payment[]
  onAddPayment: () => void
  onViewDetail: (payment: Payment) => void
  onVoidPayment?: (payment: Payment) => void
}

export function PaymentsDataTable({
  data,
  onAddPayment,
  onViewDetail,
  onVoidPayment,
}: PaymentsDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [directionFilter, setDirectionFilter] = React.useState<string>("all")

  const filteredPayments = React.useMemo(() => {
    return data.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.partnerName.toLowerCase().includes(search.toLowerCase()) ||
        (p.reference && p.reference.toLowerCase().includes(search.toLowerCase())) ||
        (p.note && p.note.toLowerCase().includes(search.toLowerCase()))

      const matchesDirection = directionFilter === "all" || p.direction === directionFilter

      return matchesSearch && matchesDirection
    })
  }, [data, search, directionFilter])

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID payment, mitra, referensi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={directionFilter} onValueChange={setDirectionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Transaksi</SelectItem>
              <SelectItem value="incoming">Masuk (Penerimaan)</SelectItem>
              <SelectItem value="outgoing">Keluar (Pengeluaran)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onAddPayment}>
          <IconPlus className="size-4 mr-2" />
          Catat Pembayaran
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">No. Payment</TableHead>
              <TableHead className="w-[110px]">Tanggal</TableHead>
              <TableHead>Mitra Bisnis / Partner</TableHead>
              <TableHead>Akun Kas/Bank</TableHead>
              <TableHead>Referensi</TableHead>
              <TableHead className="w-[180px]">Tipe Aliran</TableHead>
              <TableHead className="text-right w-[150px]">Nominal</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  Tidak ada transaksi pembayaran ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((p) => {
                const dirMeta = PAYMENT_DIRECTION_META[p.direction]
                const statusMeta = PAYMENT_STATUS_META[p.status]

                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">
                      <button
                        type="button"
                        className="hover:underline"
                        onClick={() => onViewDetail(p)}
                      >
                        {p.id}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{p.date}</TableCell>
                    <TableCell className="font-medium text-foreground">{p.partnerName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{p.accountName}</span>
                        <span className="font-mono text-muted-foreground">{p.accountCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                      {p.reference || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`ring-1 ${dirMeta.chip}`}>
                        {dirMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-mono text-sm tabular-nums font-semibold ${p.direction === "outgoing" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {p.direction === "outgoing" ? "-" : ""}
                      {formatRupiah(p.amount)}
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
                          onClick={() => onViewDetail(p)}
                          title="Lihat Detail"
                        >
                          <IconEye className="size-4" />
                        </Button>
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
