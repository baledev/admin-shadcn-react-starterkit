import * as React from "react"
import { type BalanceSheetData } from "@/lib/balance-sheet-data"
import { formatRupiah } from "@/lib/payroll-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

interface BalanceSheetTableProps {
  data: BalanceSheetData
}

export function BalanceSheetTable({ data }: BalanceSheetTableProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Kolom Kiri: Aset */}
      <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden">
        <div className="bg-muted/40 px-4 py-3 font-semibold text-sm border-b border-border text-foreground">
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
                  <TableRow key={item.id} className="hover:bg-muted/10 text-muted-foreground">
                    <TableCell className="pl-6 py-2">{item.name}</TableCell>
                    <TableCell className="text-right py-2 tabular-nums">
                      {formatRupiah(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold text-foreground">
                  <TableCell className="pl-4">Subtotal {section.title.split(" (")[0]}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(section.total)}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            <TableRow className="border-t-2 border-border font-bold text-foreground bg-primary/5 text-base">
              <TableCell className="py-4">TOTAL ASET</TableCell>
              <TableCell className="text-right py-4 tabular-nums text-primary">
                {formatRupiah(data.totalAssets)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Kolom Kanan: Kewajiban & Ekuitas */}
      <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden">
        <div className="bg-muted/40 px-4 py-3 font-semibold text-sm border-b border-border text-foreground">
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
                  <TableRow key={item.id} className="hover:bg-muted/10 text-muted-foreground">
                    <TableCell className="pl-6 py-2">{item.name}</TableCell>
                    <TableCell className="text-right py-2 tabular-nums">
                      {formatRupiah(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold text-foreground">
                  <TableCell className="pl-4">Subtotal {section.title.split(" (")[0]}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(section.total)}</TableCell>
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
                  <TableRow key={item.id} className="hover:bg-muted/10 text-muted-foreground">
                    <TableCell className="pl-6 py-2">{item.name}</TableCell>
                    <TableCell className="text-right py-2 tabular-nums">
                      {formatRupiah(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold text-foreground">
                  <TableCell className="pl-4">Subtotal {section.title.split(" (")[0]}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(section.total)}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}

            <TableRow className="border-t-2 border-border font-bold text-foreground bg-primary/5 text-base">
              <TableCell className="py-4">TOTAL LIABILITAS & EKUITAS</TableCell>
              <TableCell className="text-right py-4 tabular-nums text-primary">
                {formatRupiah(data.totalLiabilities + data.totalEquity)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

