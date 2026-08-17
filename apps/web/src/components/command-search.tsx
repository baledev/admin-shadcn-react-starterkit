import * as React from "react"
import { useNavigate } from "@tanstack/react-router"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"
import {
  IconSearch,
  IconLayoutDashboard,
  IconUsers,
  IconLayoutKanban,
  IconTerminal,
  IconBrain,
  IconBook,
  IconSettings,
} from "@tabler/icons-react"

const navCommands = [
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    label: "Customers",
    url: "/customers",
    icon: IconUsers,
  },
  {
    label: "Kanban",
    url: "/kanban",
    icon: IconLayoutKanban,
  },
  {
    label: "Playground",
    url: "#",
    icon: IconTerminal,
  },
  {
    label: "Models",
    url: "#",
    icon: IconBrain,
  },
  {
    label: "Documentation",
    url: "#",
    icon: IconBook,
  },
  {
    label: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
]

function CommandSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput
          aria-label="Type a command or search"
          placeholder="Type a command or search…"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navCommands.map((command) => (
              <CommandItem
                key={command.label}
                onSelect={() => {
                  onOpenChange(false)
                  if (command.url !== "#") {
                    navigate({ to: command.url })
                  }
                }}
              >
                <command.icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{command.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

function CommandSearchTrigger({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden h-8 w-56 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs text-muted-foreground transition-colors hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none sm:inline-flex"
    >
      <IconSearch className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 text-left">Search…</span>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  )
}

export { CommandSearchDialog, CommandSearchTrigger }
