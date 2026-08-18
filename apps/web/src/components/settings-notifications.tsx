import * as React from "react"
import { Link } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Switch } from "@workspace/ui/components/switch"
import {
  EMAIL_NOTIFICATIONS,
  NOTIFY_OPTIONS,
  type NotifyScope,
} from "@/lib/notifications-settings-data"
import { PageHeader } from "@/components/page-header"

export function SettingsNotifications() {
  const [notifyScope, setNotifyScope] = React.useState<NotifyScope>("none")
  const [emails, setEmails] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(EMAIL_NOTIFICATIONS.map((item) => [item.id, item.defaultOn]))
  )
  const [mobileOverride, setMobileOverride] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Configure how you receive notifications."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">Notify me about...</span>
          <RadioGroup
            value={notifyScope}
            onValueChange={(value) => setNotifyScope(value as NotifyScope)}
            aria-label="Notify me about"
            className="gap-3"
          >
            {NOTIFY_OPTIONS.map((option) => (
              <Label
                key={option.value}
                className="items-center gap-3 font-normal"
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="flex flex-col gap-4">
            {EMAIL_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className="flex flex-row items-center justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.description}
                  </span>
                </div>
                <Switch
                  checked={emails[item.id] ?? false}
                  onCheckedChange={(checked) =>
                    setEmails((prev) => ({ ...prev, [item.id]: checked }))
                  }
                  disabled={item.locked}
                  aria-label={item.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-start gap-3">
          <Checkbox
            id="mobile-override"
            checked={mobileOverride}
            onCheckedChange={(checked) => setMobileOverride(checked === true)}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="mobile-override">
              Use different settings for my mobile devices
            </Label>
            <p className="text-sm text-muted-foreground">
              You can manage your mobile notifications in the{" "}
              <Link
                to="/settings"
                className="underline decoration-dashed underline-offset-4 hover:decoration-solid"
              >
                mobile settings
              </Link>{" "}
              page.
            </p>
          </div>
        </div>

        <Button type="submit" className="w-fit">
          Update notifications
        </Button>
      </form>
    </div>
  )
}
