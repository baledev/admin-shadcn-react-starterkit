import * as React from "react"
import { IconArrowUpRight, IconCheck } from "@tabler/icons-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/plans-data"
import { PageHeader } from "@/components/page-header"

export function SettingsPlans() {
  const [selected, setSelected] = React.useState<PlanId>("monthly")
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const plan =
    SUBSCRIPTION_PLANS.find((p) => p.id === selected) ?? SUBSCRIPTION_PLANS[0]!

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Plans"
        description="Your subscription will begin today with a free 14-day trial."
      />
      <Separator />

      {/* Plan picker */}
      <RadioGroup
        value={selected}
        onValueChange={(value) => setSelected(value as PlanId)}
        aria-label="Subscription plan"
        className="flex flex-wrap gap-4"
      >
        {SUBSCRIPTION_PLANS.map((item) => (
          <label
            key={item.id}
            className={cn(
              "flex min-w-fit shrink-0 grow basis-0 cursor-pointer flex-col rounded-lg border border-border transition-colors",
              "has-data-checked:border-primary has-data-checked:ring-1 has-data-checked:ring-primary"
            )}
          >
            <div className="flex items-center justify-between gap-6 p-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value={item.id} />
                <span className="text-sm font-semibold tracking-tight">
                  {item.name}
                </span>
              </div>
              {item.badge ? (
                <Badge variant="outline">{item.badge}</Badge>
              ) : null}
            </div>
            <Separator />
            <div className="flex flex-col items-start gap-1 p-4">
              <p className="text-sm tabular-nums">{item.price}</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {item.billingNote}
              </p>
            </div>
          </label>
        ))}
      </RadioGroup>

      {/* Overview */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Overview</h2>
        <p className="text-sm leading-5 text-muted-foreground">
          {plan.overview}
        </p>
      </div>

      <PlanPerkList title="Features" items={plan.features} />
      <PlanPerkList title="Additional Resources" items={plan.resources} />

      <Button className="ml-auto w-fit" onClick={() => setConfirmOpen(true)}>
        Start Subscribe
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Start your subscription?"
        description={
          <>
            You are about to subscribe to the{" "}
            <span className="font-medium text-foreground">{plan.name}</span>{" "}
            plan at{" "}
            <span className="font-medium text-foreground tabular-nums">
              {plan.price}
            </span>
            . The first 14 days are free — you can cancel any time before the
            trial ends.
          </>
        }
        confirmLabel="Start trial"
        variant="default"
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  )
}

// ─── Perk list ────────────────────────────────────────────────────────────────

interface PlanPerkListProps {
  title: string
  items: string[]
}

function PlanPerkList({ title, items }: PlanPerkListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button variant="link" size="sm" className="text-xs font-semibold">
          Learn More
          <IconArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <ul className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <IconCheck
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
