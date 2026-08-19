import { createFileRoute } from "@tanstack/react-router"

import { SettingsPlans } from "@/components/settings-plans"

export const Route = createFileRoute("/_auth/settings/plans")({
  component: SettingsPlans,
})
