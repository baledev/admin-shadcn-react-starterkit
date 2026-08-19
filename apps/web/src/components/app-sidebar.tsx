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
import {
  IconBell,
  IconBriefcase,
  IconCalendar,
  IconChartBar,
  IconClipboardCheck,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconPackage,
  IconReceipt,
  IconShoppingCart,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react"

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
      label: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboardIcon />,
        },
      ],
    },
    {
      label: "Commerce",
      items: [
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
          title: "Invoices",
          url: "/invoices",
          icon: <IconReceipt />,
        },
      ],
    },
    {
      label: "Workspace",
      items: [
        {
          title: "My Workspace",
          url: "/workspace",
          icon: <IconUserCheck />,
        },
        {
          title: "Team",
          url: "/team",
          icon: <IconUsers />,
        },
        {
          title: "Notifications",
          url: "/notifications",
          icon: <IconBell />,
        },
        {
          title: "Messages",
          url: "/messages",
          icon: <IconMessage />,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: <IconChartBar />,
        },
        {
          title: "Files",
          url: "/files",
          icon: <IconFolder />,
        },
        {
          title: "Projects",
          url: "/projects",
          icon: <IconBriefcase />,
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
      ],
    },
    {
      label: "HR",
      items: [
        {
          title: "Attendance",
          url: "/attendance",
          icon: <IconClipboardCheck />,
        },
        {
          title: "Payroll",
          url: "/payroll",
          icon: <IconReceipt />,
        },
      ],
    },
    {
      label: "Other",
      items: [
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
          title: "Documentation",
          url: "#",
          icon: <BookOpenIcon />,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: <Settings2Icon />,
        },
      ],
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
        <NavMain groups={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
