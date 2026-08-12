import * as React from "react"
import { RouterProvider } from "@tanstack/react-router"

import { ThemeProvider } from "@/components/theme-provider"
import type { AuthContext, AuthUser } from "@/lib/auth"
import { loadStoredUser, persistUser } from "@/lib/auth"
import { createAppRouter } from "@/router"

export function App() {
  const [user, setUser] = React.useState<AuthUser | null>(loadStoredUser)

  const auth = React.useMemo<AuthContext>(
    () => ({
      user,
      login: async (nextUser) => {
        persistUser(nextUser)
        setUser(nextUser)
      },
      logout: async () => {
        persistUser(null)
        setUser(null)
      },
    }),
    [user]
  )

  const router = React.useMemo(() => createAppRouter(auth), [auth])

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}