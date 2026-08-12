import { createRouter } from "@tanstack/react-router"

import type { AuthContext } from "@/lib/auth"
import { routeTree } from "@/routeTree.gen"

export function createAppRouter(auth: AuthContext) {
  return createRouter({
    routeTree,
    context: { auth },
    defaultPreload: "intent",
    scrollRestoration: true,
  })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}