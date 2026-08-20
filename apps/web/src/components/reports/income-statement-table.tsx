import * as React from "react"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { type IncomeStatementSection } from "@/lib/income-statement-data"
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

interface IncomeStatementTableProps {
  details: IncomeStatementSection[]
  revenue: number
  expense: number
  netProfit: number
}

export function IncomeStatementTable({
  details,
  revenue,
  expense,
  netProfit,
}: IncomeStatementTableProps) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    "rev-1": true,
    "exp-1": true,
    "exp-2": true,
  })

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">Akun & Deskripsi</TableHead>
            <TableHead className="text-right">Nilai (IDR)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((section) => {
            const isExpanded = expanded[section.id]
            const hasChildren = section.children && section.children.length > 0

            return (
              <React.Fragment key={section.id}>
                {/* Parent Row */}
                <TableRow
                  className={cn(
                    "cursor-pointer font-medium hover:bg-muted/40",
                    section.type === "revenue"
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-foreground"
                  )}
                  onClick={() => hasChildren && toggleExpand(section.id)}
                >
                  <TableCell className="flex items-center gap-2 py-3">
                    {hasChildren ? (
                      isExpanded ? (
                        <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      )
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    {section.name}
                  </TableCell>
                  <TableCell className="py-3 text-right tabular-nums">
                    {formatRupiah(section.amount)}
                  </TableCell>
                </TableRow>

                {/* Children Rows */}
                {hasChildren &&
                  isExpanded &&
                  section.children?.map((child) => (
                    <TableRow
                      key={child.id}
                      className="text-muted-foreground hover:bg-muted/20"
                    >
                      <TableCell className="py-2 pl-8">{child.name}</TableCell>
                      <TableCell className="py-2 text-right tabular-nums">
                        {formatRupiah(child.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            )
          })}

          {/* Totals Summary */}
          <TableRow className="border-t-2 border-border bg-muted/20 font-semibold text-foreground">
            <TableCell className="py-3 pl-4">
              Total Pendapatan (Revenue)
            </TableCell>
            <TableCell className="py-3 text-right text-emerald-700 tabular-nums dark:text-emerald-400">
              {formatRupiah(revenue)}
            </TableCell>
          </TableRow>
          <TableRow className="bg-muted/20 font-semibold text-foreground">
            <TableCell className="py-3 pl-4">
              Total HPP & Beban (Expenses)
            </TableCell>
            <TableCell className="py-3 text-right text-rose-700 tabular-nums dark:text-rose-400">
              {formatRupiah(expense)}
            </TableCell>
          </TableRow>
          <TableRow className="border-t-2 border-border bg-primary/5 text-lg font-bold text-foreground">
            <TableCell className="py-4 pl-4">
              Laba Bersih (Net Profit)
            </TableCell>
            <TableCell className="py-4 text-right text-primary tabular-nums">
              {formatRupiah(netProfit)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
