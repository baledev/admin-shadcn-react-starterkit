import * as React from "react"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { type IncomeStatementSection } from "@/lib/income-statement-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
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
                    "cursor-pointer hover:bg-muted/40 font-medium",
                    section.type === "revenue" ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
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
                  <TableCell className="text-right py-3 tabular-nums">
                    {formatRupiah(section.amount)}
                  </TableCell>
                </TableRow>

                {/* Children Rows */}
                {hasChildren &&
                  isExpanded &&
                  section.children?.map((child) => (
                    <TableRow key={child.id} className="hover:bg-muted/20 text-muted-foreground">
                      <TableCell className="pl-8 py-2">
                        {child.name}
                      </TableCell>
                      <TableCell className="text-right py-2 tabular-nums">
                        {formatRupiah(child.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            )
          })}

          {/* Totals Summary */}
          <TableRow className="border-t-2 border-border font-semibold text-foreground bg-muted/20">
            <TableCell className="py-3 pl-4">Total Pendapatan (Revenue)</TableCell>
            <TableCell className="text-right py-3 tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatRupiah(revenue)}
            </TableCell>
          </TableRow>
          <TableRow className="font-semibold text-foreground bg-muted/20">
            <TableCell className="py-3 pl-4">Total HPP & Beban (Expenses)</TableCell>
            <TableCell className="text-right py-3 tabular-nums text-rose-700 dark:text-rose-400">
              {formatRupiah(expense)}
            </TableCell>
          </TableRow>
          <TableRow className="border-t-2 border-border font-bold text-foreground bg-primary/5 text-lg">
            <TableCell className="py-4 pl-4">Laba Bersih (Net Profit)</TableCell>
            <TableCell className="text-right py-4 tabular-nums text-primary">
              {formatRupiah(netProfit)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
