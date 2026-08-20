import {
  type InvoiceReportItem,
  type InvoiceReportStatus,
} from "@/lib/invoice-summary-data"
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

interface InvoiceSummaryTableProps {
  items: InvoiceReportItem[]
}

const statusBadgeStyles: Record<InvoiceReportStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  partially_paid:
    "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
  sent: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
  draft: "bg-muted text-muted-foreground ring-border/50",
  overdue: "bg-destructive text-destructive-foreground",
  cancelled: "bg-muted text-muted-foreground ring-border/50 line-through",
}

const statusLabels: Record<InvoiceReportStatus, string> = {
  paid: "Terbayar",
  partially_paid: "Sebagian",
  sent: "Terkirim",
  draft: "Draft",
  overdue: "Terlambat",
  cancelled: "Batal",
}

export function InvoiceSummaryTable({ items }: InvoiceSummaryTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Invoice</TableHead>
            <TableHead className="w-[25%]">Pelanggan</TableHead>
            <TableHead>Tgl Terbit</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead className="text-right">Nominal</TableHead>
            <TableHead className="text-right">Terbayar</TableHead>
            <TableHead className="text-right">Sisa Piutang</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.invoiceId}
              className="text-sm hover:bg-muted/10"
            >
              <TableCell className="font-mono text-xs font-semibold">
                {item.invoiceNumber}
              </TableCell>
              <TableCell className="font-medium">{item.customerName}</TableCell>
              <TableCell className="text-xs text-muted-foreground tabular-nums">
                {item.issueDate}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground tabular-nums">
                {item.dueDate}
              </TableCell>
              <TableCell className="text-right text-foreground tabular-nums">
                {formatRupiah(item.amount)}
              </TableCell>
              <TableCell className="text-right text-emerald-600 tabular-nums dark:text-emerald-400">
                {item.paidAmount > 0 ? formatRupiah(item.paidAmount) : "-"}
              </TableCell>
              <TableCell className="text-right font-medium text-rose-600 tabular-nums dark:text-rose-400">
                {item.outstandingAmount > 0
                  ? formatRupiah(item.outstandingAmount)
                  : "-"}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={statusBadgeStyles[item.status]}
                >
                  {statusLabels[item.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
