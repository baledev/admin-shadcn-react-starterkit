import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { ReportSummaryCards } from "@/components/reports/report-summary-cards"
import { InventoryReportTable } from "@/components/reports/inventory-report-table"
import { initialInventoryReport } from "@/lib/inventory-report-data"
import { formatRupiah } from "@/lib/payroll-data"

export const Route = createFileRoute("/_auth/reports/inventory-report")({
  component: InventoryReportPage,
})

function InventoryReportPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const data = initialInventoryReport

  const summaryItems = [
    { label: "Total SKU Terdaftar", value: `${data.totalSKUs} SKU`, description: "Jenis produk terdaftar" },
    { label: "Total Nilai Aset Stok", value: formatRupiah(data.totalValue), description: "Jumlah stok × harga pokok" },
    {
      label: "Stok Menipis (Low Stock)",
      value: `${data.lowStockItems} Item`,
      description: "Mencapai titik pemesanan ulang",
      trend: data.lowStockItems > 0 ? { value: "Reorder", isPositive: false } : undefined,
    },
    {
      label: "Stok Habis (Out of Stock)",
      value: `${data.outOfStockItems} Item`,
      description: "Stok kosong/nol",
      trend: data.outOfStockItems > 0 ? { value: "Segera", isPositive: false } : undefined,
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Inventori & Stok (Inventory Report)"
            description="Detail persediaan barang dagang, nilai valuasi persediaan, indikator sisa stok, serta alarm reorder point."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar date={date} onDateChange={setDate} />

          <ReportSummaryCards items={summaryItems} />

          <InventoryReportTable items={data.items} />
        </div>
      </div>
    </div>
  )
}
