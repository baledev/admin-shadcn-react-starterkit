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
  type Bill,
  BILL_STATUS_META,
} from "@/lib/bills-data"
import { formatRupiah } from "@/lib/accounts-data"

interface BillsDataTableProps {
  data: Bill[]
  onAddBill: () => void
  onViewDetail: (bill: Bill) => void
  onPayBill?: (bill: Bill) => void
}

export function BillsDataTable({
  data,
  onAddBill,
  onViewDetail,
  onPayBill,
}: BillsDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredBills = React.useMemo(() => {
    return data.filter((bill) => {
      const matchesSearch =
        bill.id.toLowerCase().includes(search.toLowerCase()) ||
        bill.vendorName.toLowerCase().includes(search.toLowerCase()) ||
        (bill.notes && bill.notes.toLowerCase().includes(search.toLowerCase()))

      const matchesStatus = statusFilter === "all" || bill.status === statusFilter

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
              placeholder="Cari ID bill, vendor..."
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
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onAddBill}>
          <IconPlus className="size-4 mr-2" />
          Catat Bill Baru
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">No. Bill</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="w-[120px]">Tanggal</TableHead>
              <TableHead className="w-[120px]">Jatuh Tempo</TableHead>
              <TableHead className="text-right w-[150px]">Total</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Tidak ada bill vendor ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((bill) => {
                const statusMeta = BILL_STATUS_META[bill.status]

                return (
                  <TableRow key={bill.id}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">
                      <button
                        type="button"
                        className="hover:underline"
                        onClick={() => onViewDetail(bill)}
                      >
                        {bill.id}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{bill.vendorName}</span>
                        <span className="text-xs text-muted-foreground">{bill.vendorEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{bill.issuedAt}</TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{bill.dueAt}</TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums font-semibold">
                      {formatRupiah(bill.total)}
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
                          onClick={() => onViewDetail(bill)}
                          title="Lihat Detail"
                        >
                          <IconEye className="size-4" />
                        </Button>
                        {bill.status !== "paid" && onPayBill && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => onPayBill(bill)}
                          >
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
