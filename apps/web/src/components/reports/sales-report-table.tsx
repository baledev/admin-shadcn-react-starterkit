import {
  type SalesCustomerData,
  type SalesProductData,
} from "@/lib/sales-report-data"
import { formatRupiah } from "@/lib/payroll-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface SalesReportTableProps {
  products: SalesProductData[]
  customers: SalesCustomerData[]
}

export function SalesReportTable({
  products,
  customers,
}: SalesReportTableProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top Products */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground">
          Penjualan Produk Terbaik (Top Products)
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Total Pendapatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.productId} className="text-sm hover:bg-muted/10">
                <TableCell className="font-medium">{p.productName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.category}
                </TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">
                  {p.quantitySold}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatRupiah(p.totalRevenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Top Customers */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground">
          Pelanggan Teraktif (Top Customers)
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pelanggan</TableHead>
              <TableHead className="text-center">Jumlah Order</TableHead>
              <TableHead className="text-right">Total Belanja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow
                key={c.customerId}
                className="text-sm hover:bg-muted/10"
              >
                <TableCell className="font-medium">{c.customerName}</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">
                  {c.orderCount}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatRupiah(c.totalSpent)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
