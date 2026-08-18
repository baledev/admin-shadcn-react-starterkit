import { createFileRoute } from "@tanstack/react-router"

import { SettingsAccount } from "@/components/settings-account"

export const Route = createFileRoute("/_auth/settings/account")({
  component: SettingsAccount,
})
