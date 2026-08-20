import * as React from "react"
import { IconSearch, IconPencil, IconTrash } from "@tabler/icons-react"
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
  type Account,
  ACCOUNT_TYPE_META,
  formatRupiah,
} from "@/lib/accounts-data"

interface AccountsDataTableProps {
  data: Account[]
  onEditAccount: (account: Account) => void
  onDeleteAccount: (account: Account) => void
}

export function AccountsDataTable({
  data,
  onEditAccount,
  onDeleteAccount,
}: AccountsDataTableProps) {
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")

  const filteredAccounts = React.useMemo(() => {
    return data.filter((acc) => {
      const matchesSearch =
        acc.code.includes(search) ||
        acc.name.toLowerCase().includes(search.toLowerCase())

      const matchesType = typeFilter === "all" || acc.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [data, search, typeFilter])

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <IconSearch className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari kode atau nama akun..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(val) => setTypeFilter(val || "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipe Akun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="asset">Aset</SelectItem>
            <SelectItem value="liability">Kewajiban</SelectItem>
            <SelectItem value="equity">Ekuitas</SelectItem>
            <SelectItem value="revenue">Pendapatan</SelectItem>
            <SelectItem value="expense">Beban</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hierarchical Table */}
      <div className="overflow-hidden rounded-md border border-border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[120px]">Kode</TableHead>
              <TableHead>Nama Akun</TableHead>
              <TableHead className="w-[150px]">Tipe</TableHead>
              <TableHead className="w-[200px] text-right">Saldo</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada akun ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((acc) => {
                const typeMeta = ACCOUNT_TYPE_META[acc.type]

                const indentClass =
                  acc.level === 1 ? "pl-2" : acc.level === 2 ? "pl-6" : "pl-12"
                let rowBgClass = ""
                if (acc.level === 1) {
                  rowBgClass = "bg-muted/30 font-bold"
                } else if (acc.level === 2) {
                  rowBgClass = "font-semibold"
                }
                const nameClass =
                  acc.level === 1
                    ? "font-bold text-foreground text-base"
                    : acc.level === 2
                      ? "font-semibold text-foreground/90"
                      : "font-normal text-muted-foreground"

                return (
                  <TableRow key={acc.code} className={rowBgClass}>
                    <TableCell className="font-mono text-sm font-medium">
                      {acc.code}
                    </TableCell>
                    <TableCell className={indentClass}>
                      <div className="flex flex-col">
                        <span className={nameClass}>{acc.name}</span>
                        {acc.description && acc.level === 3 && (
                          <span className="text-xs font-normal text-muted-foreground/80">
                            {acc.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {acc.level === 3 ? (
                        <Badge
                          variant="outline"
                          className={`ring-1 ${typeMeta.chip}`}
                        >
                          {typeMeta.label}
                        </Badge>
                      ) : (
                        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                          {typeMeta.label}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {formatRupiah(acc.balance)}
                    </TableCell>
                    <TableCell className="text-right">
                      {acc.level === 3 ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => onEditAccount(acc)}
                          >
                            <IconPencil className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:bg-destructive/15"
                            onClick={() => onDeleteAccount(acc)}
                          >
                            <IconTrash className="size-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">
                          -
                        </span>
                      )}
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
