import { createFileRoute } from "@tanstack/react-router"

import { SettingsProfile } from "@/components/settings-profile"

export const Route = createFileRoute("/_auth/settings/profile")({
  component: SettingsProfile,
})
