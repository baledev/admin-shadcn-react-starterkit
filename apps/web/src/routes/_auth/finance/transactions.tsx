import { createFileRoute, Outlet } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { TransactionsTabNav } from "@/components/finance/transactions-tab-nav"

export const Route = createFileRoute("/_auth/finance/transactions")({
  component: TransactionsLayout,
})

function TransactionsLayout() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Finance Operations"
            description="Kelola transaksi penjualan (AR), pembelian (AP), kasbon, reimbursement expense, penambahan modal, dan mutasi kas."
          />
          <div className="space-y-4">
            <TransactionsTabNav />
            <div className="min-w-0 flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
