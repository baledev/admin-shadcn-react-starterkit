import {
  IconCash,
  IconReceipt,
  IconReceiptTax,
  IconTrendingUp,
} from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@workspace/ui/components/card"
import { formatRupiah } from "@/lib/accounts-data"

export function FinanceOverviewCards() {
  // Mock data computed from our initial balances
  const cashAndBank = 700000000 // BCA: 450M, BRI: 200M, Kas: 50M
  const receivables = 150000000 // Customer AR: 120M, Kasbon: 30M
  const payables = 280000000 // Vendor AP: 250M, Reimbursements: 30M
  const netIncome = 100000000 // Revenue: 350M, Expense: 250M

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Cash & Bank */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Kas & Rekening Bank</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatRupiah(cashAndBank)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCash className="mr-1 size-3.5" aria-hidden="true" />
              Liquid
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Saldo Kasir + BCA + BRI
          </div>
          <div className="text-muted-foreground">
            BCA: {formatRupiah(450000000)} • BRI: {formatRupiah(200000000)}
          </div>
        </CardFooter>
      </Card>

      {/* Receivables (AR) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Piutang (AR)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatRupiah(receivables)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconReceipt
                className="mr-1 size-3.5 text-emerald-600"
                aria-hidden="true"
              />
              Inflow
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Piutang Usaha & Kasbon Karyawan
          </div>
          <div className="text-muted-foreground">
            Customer: {formatRupiah(120000000)} • Kasbon:{" "}
            {formatRupiah(30000000)}
          </div>
        </CardFooter>
      </Card>

      {/* Payables (AP) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Hutang (AP)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatRupiah(payables)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-destructive/20 bg-destructive/5 text-destructive"
            >
              <IconReceiptTax className="mr-1 size-3.5" aria-hidden="true" />
              Outflow
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-destructive">
            Hutang Vendor & Klaim Expense
          </div>
          <div className="text-muted-foreground">
            Vendor: {formatRupiah(250000000)} • Reimburse:{" "}
            {formatRupiah(30000000)}
          </div>
        </CardFooter>
      </Card>

      {/* Net Income */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Laba Bersih Bulan Ini</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatRupiah(netIncome)}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
            >
              <IconTrendingUp className="mr-1 size-3.5" aria-hidden="true" />
              +15% vs Jan
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pendapatan dikurangi Beban
          </div>
          <div className="text-muted-foreground">
            Revenue: {formatRupiah(350000000)} • Beban:{" "}
            {formatRupiah(250000000)}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
