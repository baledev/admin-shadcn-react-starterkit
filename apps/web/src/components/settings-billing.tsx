import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { PageHeader } from "@/components/page-header"

export function SettingsBilling() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Billing"
        description="Manage your subscription and payment methods."
      />
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Pro plan</span>
          <span className="text-xs text-muted-foreground">
            $29 / month, renews Aug 1, 2026
          </span>
        </div>
        <Button variant="outline" size="sm">
          Change plan
        </Button>
      </div>
      <Separator />
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Payment method</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            Visa •••• 4242, expires 08/27
          </span>
        </div>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </div>
      <div className="mt-2">
        <Button>Save changes</Button>
      </div>
    </div>
  )
}
