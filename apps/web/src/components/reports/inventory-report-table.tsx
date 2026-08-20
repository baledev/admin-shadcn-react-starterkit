import { type InventoryItem } from "@/lib/inventory-report-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface InventoryReportTableProps {
  items: InventoryItem[]
}

export function InventoryReportTable({ items }: InventoryReportTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead className="w-[30%]">Nama Produk</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-center">Stok</TableHead>
            <TableHead className="text-center">Titik Reorder</TableHead>
            <TableHead className="text-right">Harga Satuan</TableHead>
            <TableHead className="text-right">Total Nilai</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="text-sm hover:bg-muted/10">
              <TableCell className="font-mono text-xs text-muted-foreground">
                {item.sku}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {item.category}
              </TableCell>
              <TableCell className="text-center font-semibold tabular-nums">
                {item.stockLevel}
              </TableCell>
              <TableCell className="text-center text-muted-foreground tabular-nums">
                {item.reorderPoint}
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {formatRupiah(item.unitCost)}
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatRupiah(item.totalValue)}
              </TableCell>
              <TableCell className="text-center">
                {item.status === "in_stock" && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30"
                  >
                    Ada Stok
                  </Badge>
                )}
                {item.status === "low_stock" && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30"
                  >
                    Stok Menipis
                  </Badge>
                )}
                {item.status === "out_of_stock" && (
                  <Badge variant="destructive">Stok Habis</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
