import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

export interface ReportSummaryCardItem {
  label: string
  value: string | number
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

interface ReportSummaryCardsProps {
  items: ReportSummaryCardItem[]
}

export function ReportSummaryCards({ items }: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item, index) => (
        <Card key={index} className="data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              {item.label}
            </CardDescription>
            {item.trend && (
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full ring-1",
                  item.trend.isPositive
                    ? "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30"
                    : "bg-destructive/15 text-destructive ring-destructive/30"
                )}
              >
                {item.trend.value}
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-2xl font-bold tabular-nums">
              {item.value}
            </CardTitle>
            {item.description && (
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
