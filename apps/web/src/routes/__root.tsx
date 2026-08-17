import * as React from "react"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import type { AuthContext } from "@/lib/auth"
import { isAnnouncementDismissed } from "@/lib/announcement"
import AnnouncementBlock from "@/components/announcement"

const TanStackRouterDevtools =
  import.meta.env.DEV
    ? React.lazy(() =>
        import("@tanstack/router-devtools").then((module) => ({
          default: module.TanStackRouterDevtools,
        }))
      )
    : () => null

export const AnnouncementContext = React.createContext<boolean>(false)

function RootComponent() {
  const [visible, setVisible] = React.useState(
    () => !isAnnouncementDismissed()
  )

  return (
    <AnnouncementContext.Provider value={visible}>
      <AnnouncementBlock onVisibilityChange={setVisible} />
      <Outlet />
      {import.meta.env.DEV && (
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
      )}
    </AnnouncementContext.Provider>
  )
}

export const Route = createRootRouteWithContext<{ auth: AuthContext }>()({
  component: RootComponent,
})