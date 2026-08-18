import { createFileRoute } from "@tanstack/react-router"

import { SettingsConnectedApps } from "@/components/settings-connected-apps"

export const Route = createFileRoute("/_auth/settings/connected-apps")({
  component: SettingsConnectedApps,
})