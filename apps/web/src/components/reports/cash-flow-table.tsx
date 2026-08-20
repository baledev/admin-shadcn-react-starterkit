import * as React from "react"
import { type CashFlowData } from "@/lib/cash-flow-data"
import { formatRupiah } from "@/lib/payroll-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

interface CashFlowTableProps {
  data: CashFlowData
}

export function CashFlowTable({ data }: CashFlowTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">Aktivitas Arus Kas</TableHead>
            <TableHead className="text-right">Nilai (IDR)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.sections.map((section, idx) => (
            <React.Fragment key={idx}>
              {/* Section Title */}
              <TableRow className="bg-muted/20 font-medium hover:bg-muted/20">
                <TableCell colSpan={2}>{section.title}</TableCell>
              </TableRow>

              {/* Items */}
              {section.items.map((item) => (
                <TableRow
                  key={item.id}
                  className="text-muted-foreground hover:bg-muted/10"
                >
                  <TableCell className="py-2 pl-8">{item.name}</TableCell>
                  <TableCell
                    className={cn(
                      "py-2 text-right tabular-nums",
                      item.amount < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {formatRupiah(item.amount)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Section Total */}
              <TableRow className="border-b border-border font-semibold text-foreground">
                <TableCell className="py-3 pl-4">
                  Total Arus Kas Bersih {section.title.split(" (")[0]}
                </TableCell>
                <TableCell
                  className={cn(
                    "py-3 text-right tabular-nums",
                    section.total < 0
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  )}
                >
                  {formatRupiah(section.total)}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}

          {/* Net Change in Cash */}
          <TableRow className="border-t-2 border-border bg-muted/30 font-bold">
            <TableCell className="py-4">
              Kenaikan / (Penurunan) Bersih Kas
            </TableCell>
            <TableCell
              className={cn(
                "py-4 text-right tabular-nums",
                data.netChange < 0
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-emerald-700 dark:text-emerald-400"
              )}
            >
              {formatRupiah(data.netChange)}
            </TableCell>
          </TableRow>

          {/* Opening and Closing Balance */}
          <TableRow className="text-muted-foreground">
            <TableCell className="py-2 pl-4">
              Saldo Awal Kas & Setara Kas
            </TableCell>
            <TableCell className="py-2 text-right tabular-nums">
              {formatRupiah(data.openingBalance)}
            </TableCell>
          </TableRow>
          <TableRow className="bg-primary/5 text-lg font-bold text-foreground">
            <TableCell className="py-4">Saldo Akhir Kas & Setara Kas</TableCell>
            <TableCell className="py-4 text-right text-primary tabular-nums">
              {formatRupiah(data.closingBalance)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
