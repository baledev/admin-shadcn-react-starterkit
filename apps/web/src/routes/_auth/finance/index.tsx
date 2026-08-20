import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { FinanceOverviewCards } from "@/components/finance/finance-overview-cards"
import { FinanceRevenueChart } from "@/components/finance/finance-revenue-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { initialJournalEntries } from "@/lib/journal-entries-data"
import { formatRupiah } from "@/lib/accounts-data"
import { Badge } from "@workspace/ui/components/badge"

export const Route = createFileRoute("/_auth/finance/")({
  component: FinanceOverviewPage,
})

function FinanceOverviewPage() {
  // Take last 4 journal entries for dashboard widget
  const recentEntries = initialJournalEntries.slice(0, 4)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Finance Overview"
            description="Pantau kesehatan finansial perusahaan, saldo kas/bank, total piutang usaha (AR), hutang usaha (AP), dan profitabilitas bulanan."
          />

          <FinanceOverviewCards />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* Chart Area */}
            <div className="md:col-span-4">
              <FinanceRevenueChart />
            </div>

            {/* Recent Ledger Transactions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Jurnal Ledger Terbaru
                </CardTitle>
                <CardDescription>
                  Transaksi terakhir yang diposting ke buku besar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-1.5 rounded-lg border border-border p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">
                        {entry.id}
                      </span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {entry.date}
                      </span>
                    </div>
                    <p
                      className="truncate font-semibold text-foreground"
                      title={entry.note}
                    >
                      {entry.note}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="origin-left scale-95 text-[10px]"
                      >
                        {entry.type.toUpperCase()}
                      </Badge>
                      <span className="font-mono font-bold text-foreground">
                        {formatRupiah(entry.totalDebit)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
