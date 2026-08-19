import { createFileRoute } from "@tanstack/react-router"

import { SettingsBilling } from "@/components/settings-billing"

export const Route = createFileRoute("/_auth/settings/billing")({
  component: SettingsBilling,
})
