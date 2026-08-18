import { createRouter } from "@tanstack/react-router"

import type { AuthContext } from "@/lib/auth"
import { routeTree } from "@/routeTree.gen"
import { NotFoundPage } from "@/routes/404"

export function createAppRouter(auth: AuthContext) {
  return createRouter({
    routeTree,
    context: { auth },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: NotFoundPage,
  })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}