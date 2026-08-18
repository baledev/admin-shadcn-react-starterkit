import * as React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  IconActivity,
  IconCheck,
  IconCreditCard,
  IconInbox,
  IconLock,
  IconSettings,
  IconX,
} from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import {
  type Notification,
  type NotificationType,
  initialNotifications,
} from "@/lib/notifications-data"
import { Button } from "@workspace/ui/components/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

export const Route = createFileRoute("/_auth/notifications")({
  component: NotificationsPage,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "system":
      return <IconSettings className="size-5 text-gray-500 dark:text-gray-400" />
    case "activity":
      return <IconActivity className="size-5 text-blue-500 dark:text-blue-400" />
    case "billing":
      return <IconCreditCard className="size-5 text-emerald-500 dark:text-emerald-400" />
    case "security":
      return <IconLock className="size-5 text-destructive" />
  }
}

function getNotificationBg(type: NotificationType) {
  switch (type) {
    case "system":
      return "bg-muted"
    case "activity":
      return "bg-blue-500/10 dark:bg-blue-500/20"
    case "billing":
      return "bg-emerald-500/10 dark:bg-emerald-500/20"
    case "security":
      return "bg-destructive/10 dark:bg-destructive/20"
  }
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "Yesterday"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>(
    initialNotifications
  )
  const [activeTab, setActiveTab] = React.useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filteredNotifications = React.useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read)
      case "system":
        return notifications.filter((n) => n.type === "system")
      case "activity":
        return notifications.filter((n) => n.type === "activity" || n.type === "billing" || n.type === "security")
      default:
        return notifications
    }
  }, [notifications, activeTab])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Notifications"
            description="Manage your system updates, activities, and alerts."
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <IconCheck className="size-4" aria-hidden="true" />
              Mark All Read
            </Button>
          </PageHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col gap-4"
          >
            <TabsList>
              <TabsTrigger value="all">
                All
                {notifications.length > 0 && (
                  <span className="ml-1 rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {notifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary dark:bg-primary/20 dark:text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="activity">Activities & Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center bg-card">
                  <IconInbox className="size-12 text-muted-foreground/40" />
                  <div>
                    <p className="text-sm font-medium">No notifications</p>
                    <p className="text-sm text-muted-foreground">
                      You are all caught up!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card">
                  <div className="divide-y divide-border">
                    {filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/40 ${
                          !notif.read ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                      >
                        {/* Icon Container */}
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${getNotificationBg(
                            notif.type
                          )}`}
                        >
                          {getNotificationIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                            <span className="font-medium text-foreground">
                              {notif.title}
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                              {formatRelativeTime(notif.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notif.description}
                          </p>

                          {/* Action Button */}
                          {notif.actionUrl && (
                            <div className="mt-2.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                render={
                                  <Link
                                    to={notif.actionUrl}
                                  />
                                }
                              >
                                View Details
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Read/Delete Actions */}
                        <div className="flex items-center gap-1.5 self-center">
                          {!notif.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleMarkRead(notif.id)}
                              aria-label="Mark as read"
                            >
                              <IconCheck className="size-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(notif.id)}
                            aria-label="Dismiss notification"
                          >
                            <IconX className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
