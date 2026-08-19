import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/reports/")({
  loader: () => {
    throw redirect({ to: "/reports/income-statement" })
  },
})
