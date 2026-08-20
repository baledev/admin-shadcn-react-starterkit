import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"
import { ChevronRightIcon } from "lucide-react"

function NavLink({
  url,
  ...props
}: { url: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  if (url.startsWith("/")) {
    return <Link to={url} {...props} />
  }
  return <a href={url} {...props} />
}

type NavItem = {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
  exact?: boolean
  activePrefix?: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

function NavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const hasChildren = Boolean(item.items && item.items.length > 0)

  const hasActiveChild =
    item.items?.some(
      (subItem) => subItem.url !== "#" && pathname === subItem.url
    ) ?? false

  const [userOpen, setUserOpen] = React.useState(item.isActive ?? false)
  const open = hasChildren && (hasActiveChild || userOpen)

  if (!hasChildren) {
    const isExact = pathname === item.url
    const isChild = item.exact ? false : pathname.startsWith(item.url + "/")
    const isPrefixActive = item.activePrefix
      ? pathname.startsWith(item.activePrefix)
      : false
    const isActive = isExact || isChild || isPrefixActive

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          render={<NavLink url={item.url} />}
          tooltip={item.title}
        >
          {item.icon}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setUserOpen}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton isActive={hasActiveChild} tooltip={item.title} />
        }
      >
        {item.icon}
        <span>{item.title}</span>
        <ChevronRightIcon className="ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                isActive={pathname === subItem.url}
                render={<NavLink url={subItem.url} />}
              >
                <span>{subItem.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <NavItem key={item.title} item={item} pathname={pathname} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
