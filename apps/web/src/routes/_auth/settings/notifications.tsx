import { createFileRoute } from "@tanstack/react-router"

import { SettingsNotifications } from "@/components/settings-notifications"

export const Route = createFileRoute("/_auth/settings/notifications")({
  component: SettingsNotifications,
})
