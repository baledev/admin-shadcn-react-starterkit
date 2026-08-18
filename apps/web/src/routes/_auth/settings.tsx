import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconApps,
  IconCreditCard,
  IconNotification,
  IconShieldLock,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { PageHeader } from "@/components/page-header"
import { SettingsConnectedApps } from "@/components/settings-connected-apps"
import { SettingsPlans } from "@/components/settings-plans"

const sections = [
  { id: "profile", label: "Profile", icon: IconUser },
  { id: "account", label: "Account", icon: IconShieldLock },
  { id: "notifications", label: "Notifications", icon: IconNotification },
  { id: "billing", label: "Billing", icon: IconCreditCard },
  { id: "plans", label: "Plans", icon: IconSparkles },
  { id: "connected-apps", label: "Connected Apps", icon: IconApps },
]

export const Route = createFileRoute("/_auth/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  const [active, setActive] = useState<string>("profile")

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="w-full max-w-3xl">
            <PageHeader
              title="Settings"
              description="Manage your account and workspace preferences."
            />

            <div className="mt-8 flex flex-col gap-8 md:flex-row">
              <nav className="flex shrink-0 flex-col gap-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActive(section.id)}
                    aria-current={active === section.id}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      active === section.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {section.label}
                  </button>
                )
              })}
            </nav>

            <div className="min-w-0 flex-1">
              {active === "profile" && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14 border border-border">
                      <AvatarImage
                        src="https://i.pravatar.cc/80?img=45"
                        alt="Elena Duarte"
                        className="grayscale"
                      />
                      <AvatarFallback>ED</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change avatar
                    </Button>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input id="name" defaultValue="Elena Duarte" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="elena@acme.com"
                    />
                  </Field>
                </div>
              )}

              {active === "notifications" && (
                <div className="flex flex-col gap-4">
                  {["Product updates", "Weekly digest", "Security alerts"].map(
                    (label, index) => (
                      <div key={label} className="flex flex-col gap-4">
                        {index > 0 && <Separator />}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{label}</span>
                          <Switch
                            defaultChecked={index !== 1}
                            aria-label={label}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {active === "account" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="font-heading text-sm font-semibold tracking-tight">
                      Password
                    </h2>
                    <Field>
                      <FieldLabel htmlFor="current">Current password</FieldLabel>
                      <Input
                        id="current"
                        type="password"
                        placeholder="••••••••"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="new-password">New password</FieldLabel>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </Field>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        Two-factor authentication
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Add an extra layer of security to your account.
                      </span>
                    </div>
                    <Switch aria-label="Two-factor authentication" />
                  </div>
                </div>
              )}

              {active === "billing" && (
                <div className="flex flex-col gap-6">
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
                </div>
              )}

              {active === "plans" && <SettingsPlans />}

              {active === "connected-apps" && <SettingsConnectedApps />}

              {active !== "plans" && active !== "connected-apps" && (
                <div className="mt-8">
                  <Button>Save changes</Button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
