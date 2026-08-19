import * as React from "react"
import { RouterProvider } from "@tanstack/react-router"

import { AppErrorBoundary } from "@/components/app-error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import type { AuthContext, AuthUser } from "@/lib/auth"
import { loadStoredUser, persistUser } from "@/lib/auth"
import { createAppRouter } from "@/router"

export function App() {
  const [user, setUser] = React.useState<AuthUser | null>(loadStoredUser)

  const auth = React.useMemo<AuthContext>(
    () => ({
      user,
      signIn: async (nextUser) => {
        persistUser(nextUser)
        setUser(nextUser)
      },
      signOut: async () => {
        persistUser(null)
        setUser(null)
      },
    }),
    [user]
  )

  const [router] = React.useState(() =>
    createAppRouter({
      user: loadStoredUser(),
      signIn: async () => {},
      signOut: async () => {},
    })
  )

  const prevUser = React.useRef<AuthUser | null>(user)

  React.useEffect(() => {
    if (prevUser.current !== user) {
      prevUser.current = user
      router.invalidate()
    }
  }, [user, router])

  return (
    <ThemeProvider>
      <AppErrorBoundary>
        <RouterProvider router={router} context={{ auth }} />
      </AppErrorBoundary>
    </ThemeProvider>
  )
}
