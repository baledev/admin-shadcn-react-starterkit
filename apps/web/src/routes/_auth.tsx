import * as React from "react"
import {
  useRouterState,
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router"

import { AppSidebar } from "@/components/app-sidebar"
import { AnnouncementContext } from "@/routes/__root"
import {
  CommandSearchDialog,
  CommandSearchTrigger,
} from "@/components/command-search"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import NotificationsBlock from "@/components/notifications"
import { ANNOUNCEMENT_HEIGHT } from "@/components/announcement"

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/sign-in" })
    }
  },
  component: AuthLayout,
})

function titleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function AuthLayout() {
  const [commandOpen, setCommandOpen] = React.useState(false)
  const announcementVisible = React.useContext(AnnouncementContext)
  const matches = useRouterState({ select: (state) => state.matches })
  const leaf = matches[matches.length - 1]
  const crumbLabel = leaf
    ? titleCase(leaf.routeId.split("/").filter(Boolean).pop() ?? "Home")
    : "Home"

  return (
    <SidebarProvider
      style={
        {
          "--announcement-offset": announcementVisible
            ? `${ANNOUNCEMENT_HEIGHT}px`
            : "0px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink render={<Link to="/dashboard" />}>
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{crumbLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ms-auto flex items-center gap-2">
              <CommandSearchTrigger onClick={() => setCommandOpen(true)} />
              <NotificationsBlock />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
      <CommandSearchDialog open={commandOpen} onOpenChange={setCommandOpen} />
      </SidebarProvider>
  )
}