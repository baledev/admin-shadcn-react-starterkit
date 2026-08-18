import { createRouter } from "@tanstack/react-router"

import type { AuthContext } from "@/lib/auth"
import { routeTree } from "@/routeTree.gen"
import { ErrorPage } from "@/routes/-error"
import { NotFoundPage } from "@/routes/-404"

export function createAppRouter(auth: AuthContext) {
  return createRouter({
    routeTree,
    context: { auth },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: ErrorPage,
    notFoundMode: "root",
    defaultOnCatch: (error) => {
      if (import.meta.env.DEV) {
        console.error(error)
      }
      // Hook up Sentry / logging here once a real backend is wired in.
    },
  })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}