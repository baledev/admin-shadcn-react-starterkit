import { Link } from "@tanstack/react-router"
import {
  IconReceipt,
  IconReceiptTax,
  IconUsers,
  IconWallet,
  IconCoins,
  IconArrowsExchange,
} from "@tabler/icons-react"

import { cn } from "@workspace/ui/lib/utils"

const tabs = [
  {
    id: "invoices",
    label: "Invoices (AR)",
    icon: IconReceipt,
    to: "/finance/transactions/invoices",
  },
  {
    id: "bills",
    label: "Bills (AP)",
    icon: IconReceiptTax,
    to: "/finance/transactions/bills",
  },
  {
    id: "kasbon",
    label: "Kasbon Karyawan",
    icon: IconUsers,
    to: "/finance/transactions/kasbon",
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: IconWallet,
    to: "/finance/transactions/expenses",
  },
  {
    id: "equity",
    label: "Modal / Equity",
    icon: IconCoins,
    to: "/finance/transactions/equity",
  },
  {
    id: "transfers",
    label: "Transfers / Mutasi",
    icon: IconArrowsExchange,
    to: "/finance/transactions/transfers",
  },
]

export function TransactionsTabNav() {
  return (
    <nav
      className="flex border-b border-border overflow-x-auto no-scrollbar gap-1"
      aria-label="Transactions tabs"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Link
            key={tab.id}
            to={tab.to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "border-primary border-b-2 font-medium text-foreground bg-muted/40" }}
            className={cn(
              "flex items-center gap-2 rounded-t-md px-4 py-2.5 text-center text-sm transition-colors whitespace-nowrap",
              "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
