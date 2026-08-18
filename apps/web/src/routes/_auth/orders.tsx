import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconDownload,
  IconPackage,
  IconShoppingCart,
  IconTrendingUp,
  IconClock,
} from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import { OrderDataTable } from "@/components/order-data-table"
import { type Order, computeStats, initialOrders, STATUS_META } from "@/lib/orders-data"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"

export const Route = createFileRoute("/_auth/orders")({
  component: OrdersPage,
})

// ─── Stat cards ───────────────────────────────────────────────────────────────

function OrderStatCards({ orders }: { orders: Order[] }) {
  const { totalOrders, pendingCount, revenueThisMonth, avgOrderValue } =
    computeStats(orders)

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n)

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOrders}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconShoppingCart className="size-3.5" aria-hidden="true" />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across all statuses
          </div>
          <div className="text-muted-foreground">
            {orders.filter((o) => o.status === "delivered").length} delivered
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock className="size-3.5" aria-hidden="true" />
              Awaiting
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders awaiting action
          </div>
          <div className="text-muted-foreground">
            {orders.filter((o) => o.status === "processing").length} currently processing
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmt(revenueThisMonth)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-3.5" aria-hidden="true" />
              This month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Excluding cancelled orders
          </div>
          <div className="text-muted-foreground">
            Based on order creation date
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Order Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmt(avgOrderValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconPackage className="size-3.5" aria-hidden="true" />
              Per order
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Non-cancelled orders
          </div>
          <div className="text-muted-foreground">
            {orders.filter((o) => o.status !== "cancelled").length} orders counted
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// ─── Order detail sheet ───────────────────────────────────────────────────────

function OrderDetailSheet({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!order) return null

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n)

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  )

  const statusMeta = STATUS_META[order.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <SheetTitle className="font-mono text-lg">{order.id}</SheetTitle>
            <Badge variant="outline" className={`ring-1 ${statusMeta.chip}`}>
              {statusMeta.label}
            </Badge>
          </div>
          <SheetDescription>
            Order details, line items, and timeline.
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
          {/* Customer info */}
          <section>
            <h2 className="mb-3 text-sm font-medium">Customer</h2>
            <div className="rounded-lg border bg-muted/30 px-4 py-3">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">
                {order.customerEmail}
              </p>
            </div>
          </section>

          {/* Line items */}
          <section>
            <h2 className="mb-3 text-sm font-medium">Line Items</h2>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Product
                    </th>
                    <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">
                      Qty
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                      Unit
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.productId}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums">
                        {item.qty}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {fmt(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        {fmt(item.qty * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-3 space-y-1.5 rounded-lg border bg-muted/30 px-4 py-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Free</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="tabular-nums">{fmt(order.total)}</span>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="mb-3 text-sm font-medium">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">Order placed</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-muted-foreground/40" />
                  <div>
                    <p className="text-sm font-medium">Last updated</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  function handleViewDetail(order: Order) {
    setSelectedOrder(order)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Orders"
            description="Manage and track all customer orders."
          >
            <Button variant="outline" size="sm">
              <IconDownload className="size-4" aria-hidden="true" />
              Export
            </Button>
          </PageHeader>

          <OrderStatCards orders={initialOrders} />

          <OrderDataTable
            data={initialOrders}
            onViewDetail={handleViewDetail}
          />
        </div>
      </div>

      <OrderDetailSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
