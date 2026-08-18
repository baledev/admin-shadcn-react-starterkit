import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/settings/")({
  loader: () => {
    throw redirect({ to: "/settings/profile" })
  },
})
