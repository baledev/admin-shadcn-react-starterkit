import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { Button } from "@workspace/ui/components/button"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import { Separator } from "@workspace/ui/components/separator"
import { CONNECTED_APPS, type ConnectedApp } from "@/lib/connected-apps-data"

export function SettingsConnectedApps() {
  const [apps, setApps] = React.useState<ConnectedApp[]>(CONNECTED_APPS)
  const [pendingDisconnect, setPendingDisconnect] =
    React.useState<ConnectedApp | null>(null)

  function setConnected(id: string, connected: boolean) {
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, connected } : app))
    )
  }

  function handleToggle(app: ConnectedApp) {
    if (app.connected) setPendingDisconnect(app)
    else setConnected(app.id, true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-medium">Connected Apps</h2>
        <p className="text-sm text-muted-foreground">
          Manage and connect different applications.
        </p>
      </div>
      <Separator />

      <div className="text-sm font-medium tracking-tight text-muted-foreground">
        <p>
          To get the best experience, we recommend setting up at least one
          integration.
        </p>
        <p>
          This is necessary for us to have a source to generate reports for you.
        </p>
      </div>

      <Accordion className="flex flex-col gap-4">
        {apps.map((app) => {
          const Icon = app.icon
          return (
            <AccordionItem
              key={app.id}
              value={app.id}
              className="rounded-md border border-border"
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted p-2">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="truncate">{app.name}</span>
                </div>
                <Button
                  variant={app.connected ? "secondary" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs font-semibold"
                  onClick={() => handleToggle(app)}
                >
                  {app.connected ? (
                    <>
                      <IconCheck className="size-3.5" aria-hidden="true" />
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <AccordionTrigger className="flex-none items-center gap-1 py-0 text-xs font-semibold hover:no-underline">
                  Learn More
                </AccordionTrigger>
              </div>
              <AccordionContent className="px-4">
                <p className="text-sm text-muted-foreground">
                  {app.description}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {app.scopes.map((scope) => (
                    <li
                      key={scope}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <IconCheck className="size-4 shrink-0" aria-hidden="true" />
                      {scope}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <ConfirmDialog
        open={pendingDisconnect !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDisconnect(null)
        }}
        title="Disconnect app?"
        description={
          <>
            <span className="font-medium text-foreground">
              {pendingDisconnect?.name}
            </span>{" "}
            will stop syncing and any automation using it will pause until you
            connect it again.
          </>
        }
        confirmLabel="Disconnect"
        onConfirm={() => {
          if (pendingDisconnect) setConnected(pendingDisconnect.id, false)
          setPendingDisconnect(null)
        }}
      />
    </div>
  )
}
