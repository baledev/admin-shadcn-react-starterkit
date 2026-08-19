import * as React from "react"
import { type CashFlowData } from "@/lib/cash-flow-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

interface CashFlowTableProps {
  data: CashFlowData
}

export function CashFlowTable({ data }: CashFlowTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
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
                <TableRow key={item.id} className="hover:bg-muted/10 text-muted-foreground">
                  <TableCell className="pl-8 py-2">{item.name}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right py-2 tabular-nums",
                      item.amount < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {formatRupiah(item.amount)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Section Total */}
              <TableRow className="font-semibold text-foreground border-b border-border">
                <TableCell className="pl-4 py-3">Total Arus Kas Bersih {section.title.split(" (")[0]}</TableCell>
                <TableCell
                  className={cn(
                    "text-right py-3 tabular-nums",
                    section.total < 0 ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"
                  )}
                >
                  {formatRupiah(section.total)}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}

          {/* Net Change in Cash */}
          <TableRow className="border-t-2 border-border font-bold bg-muted/30">
            <TableCell className="py-4">Kenaikan / (Penurunan) Bersih Kas</TableCell>
            <TableCell
              className={cn(
                "text-right py-4 tabular-nums",
                data.netChange < 0 ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"
              )}
            >
              {formatRupiah(data.netChange)}
            </TableCell>
          </TableRow>

          {/* Opening and Closing Balance */}
          <TableRow className="text-muted-foreground">
            <TableCell className="pl-4 py-2">Saldo Awal Kas & Setara Kas</TableCell>
            <TableCell className="text-right py-2 tabular-nums">
              {formatRupiah(data.openingBalance)}
            </TableCell>
          </TableRow>
          <TableRow className="font-bold text-foreground bg-primary/5 text-lg">
            <TableCell className="py-4">Saldo Akhir Kas & Setara Kas</TableCell>
            <TableCell className="text-right py-4 tabular-nums text-primary">
              {formatRupiah(data.closingBalance)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

