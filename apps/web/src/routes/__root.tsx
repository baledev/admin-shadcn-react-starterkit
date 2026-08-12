import * as React from "react"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import type { AuthContext } from "@/lib/auth"

const TanStackRouterDevtools =
  import.meta.env.DEV
    ? React.lazy(() =>
        import("@tanstack/router-devtools").then((module) => ({
          default: module.TanStackRouterDevtools,
        }))
      )
    : () => null

function RootComponent() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && (
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<{ auth: AuthContext }>()({
  component: RootComponent,
})