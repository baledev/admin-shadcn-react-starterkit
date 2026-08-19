import * as React from "react"
import { IconSearch, IconEye, IconPlus, IconCheck } from "@tabler/icons-react"
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
  type Expense,
  EXPENSE_STATUS_META,
  EXPENSE_CATEGORY_META,
} from "@/lib/expenses-finance-data"
import { formatRupiah } from "@/lib/accounts-data"

interface ExpensesFinanceDataTableProps {
  data: Expense[]
  onAddExpense: () => void
  onViewDetail: (expense: Expense) => void
  onApproveExpense?: (expense: Expense) => void
  onReimburseExpense?: (expense: Expense) => void
}

export function ExpensesFinanceDataTable({
  data,
  onAddExpense,
  onViewDetail,
  onApproveExpense,
  onReimburseExpense,
}: ExpensesFinanceDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")

  const filteredExpenses = React.useMemo(() => {
    return data.filter((exp) => {
      const matchesSearch =
        exp.id.toLowerCase().includes(search.toLowerCase()) ||
        exp.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        exp.description.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "all" || exp.status === statusFilter
      const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [data, search, statusFilter, categoryFilter])

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID expense, karyawan, keterangan..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Diajukan</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="reimbursed">Dibayar</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="travel">Perjalanan Dinas</SelectItem>
              <SelectItem value="meals">Konsumsi / Makan</SelectItem>
              <SelectItem value="office">Keperluan Kantor</SelectItem>
              <SelectItem value="marketing">Iklan & Pemasaran</SelectItem>
              <SelectItem value="other">Lain-lain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onAddExpense}>
          <IconPlus className="size-4 mr-2" />
          Klaim Expense
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">ID Klaim</TableHead>
              <TableHead>Karyawan</TableHead>
              <TableHead className="w-[150px]">Kategori</TableHead>
              <TableHead className="w-[110px]">Tanggal</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right w-[130px]">Jumlah</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[130px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Tidak ada klaim expense ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((exp) => {
                const statusMeta = EXPENSE_STATUS_META[exp.status]
                const catMeta = EXPENSE_CATEGORY_META[exp.category]

                return (
                  <TableRow key={exp.id}>
                    <TableCell className="font-mono text-sm font-semibold text-primary">
                      <button
                        type="button"
                        className="hover:underline"
                        onClick={() => onViewDetail(exp)}
                      >
                        {exp.id}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{exp.employeeName}</span>
                        <span className="text-xs text-muted-foreground">{exp.employeeEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-foreground/80">
                        {catMeta.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">{exp.date}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={exp.description}>
                      {exp.description}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums font-semibold">
                      {formatRupiah(exp.amount)}
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
                          onClick={() => onViewDetail(exp)}
                          title="Lihat Detail"
                        >
                          <IconEye className="size-4" />
                        </Button>
                        {exp.status === "submitted" && onApproveExpense && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold text-violet-700 border-violet-200 hover:bg-violet-50 dark:text-violet-300 dark:border-violet-800"
                            onClick={() => onApproveExpense(exp)}
                          >
                            Setujui
                          </Button>
                        )}
                        {exp.status === "approved" && onReimburseExpense && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800"
                            onClick={() => onReimburseExpense(exp)}
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
