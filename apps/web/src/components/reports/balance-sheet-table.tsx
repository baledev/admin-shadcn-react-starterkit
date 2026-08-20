import * as React from "react"
import { type BalanceSheetData } from "@/lib/balance-sheet-data"
import { formatRupiah } from "@/lib/payroll-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface BalanceSheetTableProps {
  data: BalanceSheetData
}

export function BalanceSheetTable({ data }: BalanceSheetTableProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Kolom Kiri: Aset */}
      <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground">
          AKTIVA (ASSETS)
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Akun</TableHead>
              <TableHead className="text-right">Nilai (IDR)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.assetsSection.map((section, idx) => (
              <React.Fragment key={idx}>
                <TableRow className="bg-muted/20 font-medium hover:bg-muted/20">
                  <TableCell colSpan={2}>{section.title}</TableCell>
                </TableRow>
                {section.items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-muted-foreground hover:bg-muted/10"
                  >
                    <TableCell className="py-2 pl-6">{item.name}</TableCell>
                    <TableCell className="py-2 text-right tabular-nums">
                      {formatRupiah(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold text-foreground">
                  <TableCell className="pl-4">
                    Subtotal {section.title.split(" (")[0]}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatRupiah(section.total)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            <TableRow className="border-t-2 border-border bg-primary/5 text-base font-bold text-foreground">
              <TableCell className="py-4">TOTAL ASET</TableCell>
              <TableCell className="py-4 text-right text-primary tabular-nums">
                {formatRupiah(data.totalAssets)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Kolom Kanan: Kewajiban & Ekuitas */}
      <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground">
          PASIVA (LIABILITIES & EQUITY)
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Akun</TableHead>
              <TableHead className="text-right">Nilai (IDR)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Liabilities */}
            {data.liabilitiesSection.map((section, idx) => (
              <React.Fragment key={idx}>
                <TableRow className="bg-muted/20 font-medium hover:bg-muted/20">
                  <TableCell colSpan={2}>{section.title}</TableCell>
                </TableRow>
                {section.items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-muted-foreground hover:bg-muted/10"
                  >
                    <TableCell className="py-2 pl-6">{item.name}</TableCell>
                    <TableCell className="py-2 text-right tabular-nums">
                      {formatRupiah(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold text-foreground">
                  <TableCell className="pl-4">
                    Subtotal {section.title.split(" (")[0]}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatRupiah(section.total)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}

            {/* Equity */}
            {data.equitySection.map((section, idx) => (
              <React.Fragment key={idx}>
                <TableRow className="bg-muted/20 font-medium hover:bg-muted/20">
                  <TableCell colSpan={2}>{section.title}</TableCell>
                </TableRow>
                {section.items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-muted-foreground hover:bg-muted/10"
                  >
                    <TableCell className="py-2 pl-6">{item.name}</TableCell>
                    <TableCell className="py-2 text-right tabular-nums">
                      {formatRupiah(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold text-foreground">
                  <TableCell className="pl-4">
                    Subtotal {section.title.split(" (")[0]}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatRupiah(section.total)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}

            <TableRow className="border-t-2 border-border bg-primary/5 text-base font-bold text-foreground">
              <TableCell className="py-4">TOTAL LIABILITAS & EKUITAS</TableCell>
              <TableCell className="py-4 text-right text-primary tabular-nums">
                {formatRupiah(data.totalLiabilities + data.totalEquity)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
