import { Link } from "@tanstack/react-router"
import {
  IconApps,
  IconCreditCard,
  IconNotification,
  IconShieldLock,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react"

import { cn } from "@workspace/ui/lib/utils"

const sections = [
  { id: "profile", label: "Profile", icon: IconUser, to: "/settings/profile" },
  {
    id: "account",
    label: "Account",
    icon: IconShieldLock,
    to: "/settings/account",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: IconNotification,
    to: "/settings/notifications",
  },
  {
    id: "billing",
    label: "Billing",
    icon: IconCreditCard,
    to: "/settings/billing",
  },
  { id: "plans", label: "Plans", icon: IconSparkles, to: "/settings/plans" },
  {
    id: "connected-apps",
    label: "Connected Apps",
    icon: IconApps,
    to: "/settings/connected-apps",
  },
]

export function SettingsSideNav() {
  return (
    <nav
      className="flex shrink-0 flex-col gap-1"
      aria-label="Settings sections"
    >
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <Link
            key={section.id}
            to={section.to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-muted font-medium text-foreground" }}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors",
              "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {section.label}
          </Link>
        )
      })}
    </nav>
  )
}
