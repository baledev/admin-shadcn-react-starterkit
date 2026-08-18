"use client"

import * as React from "react"
import { useRouter } from "@tanstack/react-router"
import { AnnouncementContext } from "@/routes/__root"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  AudioLinesIcon,
  BookOpenIcon,
  BotIcon,
  FolderIcon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  TerminalIcon,
  TerminalSquareIcon,
  UsersIcon,
} from "lucide-react"
import { IconCalendar, IconLayoutKanban, IconPackage, IconShoppingCart } from "@tabler/icons-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: <UsersIcon />,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: <IconShoppingCart />,
    },
    {
      title: "Products",
      url: "/products",
      icon: <IconPackage />,
    },
    {
      title: "Kanban",
      url: "/kanban",
      icon: <IconLayoutKanban />,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: <IconCalendar />,
    },
    {
      title: "Playground",
      url: "#",
      icon: <TerminalSquareIcon />,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: <BotIcon />,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FolderIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const authUser = router.options.context.auth.user
  const announcementVisible = React.useContext(AnnouncementContext)

  const user = authUser
    ? {
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar ?? "",
      }
    : data.user

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={announcementVisible ? "pt-4" : ""}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}