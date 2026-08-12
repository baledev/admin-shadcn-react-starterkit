import { createFileRoute } from "@tanstack/react-router"
import {
  Activity,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export const Route = createFileRoute("/_auth/dashboard")({
  component: DashboardPage,
})

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    description: "+180.1% from last month",
    icon: Users,
  },
  {
    title: "Sales",
    value: "+12,234",
    description: "+19% from last month",
    icon: ShoppingCart,
  },
  {
    title: "Active Now",
    value: "+573",
    description: "+201 since last hour",
    icon: Activity,
  },
]

function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-normal">
                {stat.title}
              </CardTitle>
              <CardAction>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid flex-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="flex h-[320px] items-end gap-2">
            {[40, 60, 35, 75, 50, 85, 65, 90, 55, 70, 45, 80].map(
              (height, index) => (
                <div
                  key={index}
                  style={{ height: `${height}%` }}
                  className="flex-1 rounded-md bg-primary/20 transition-colors hover:bg-primary/40"
                />
              )
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[
              { name: "Olivia Martin", email: "olivia@example.com", amount: "+$1,999.00" },
              { name: "Jackson Lee", email: "jackson@example.com", amount: "+$39.00" },
              { name: "Isabella Nguyen", email: "isabella@example.com", amount: "+$299.00" },
              { name: "William Kim", email: "will@example.com", amount: "+$99.00" },
              { name: "Sofia Davis", email: "sofia@example.com", amount: "+$39.00" },
            ].map((sale) => (
              <div key={sale.email} className="flex items-center gap-4">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {sale.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate font-medium">{sale.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {sale.email}
                  </span>
                </div>
                <span className="text-sm font-medium">{sale.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardAction>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent>
          A card uses the surrounding grid to control its width. This card uses a
          subtle background to let you know it contains useful information.
        </CardContent>
      </Card>
    </div>
  )
}