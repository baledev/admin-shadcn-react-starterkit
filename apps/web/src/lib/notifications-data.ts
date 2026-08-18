// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = "system" | "activity" | "billing" | "security"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  description: string
  read: boolean
  createdAt: string // ISO date string
  actionUrl?: string
}

// ─── Static mock data ─────────────────────────────────────────────────────────

export const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "system",
    title: "System Update Complete",
    description: "The application has been successfully updated to version v1.2.0. Check out the new dashboard features.",
    read: false,
    createdAt: "2026-08-18T09:30:00Z",
  },
  {
    id: "notif-2",
    type: "billing",
    title: "Invoice Paid",
    description: "Invoice INV-2026-001 has been marked as PAID by Alice Johnson ($1,705.00).",
    read: false,
    createdAt: "2026-08-18T08:15:00Z",
    actionUrl: "/invoices",
  },
  {
    id: "notif-3",
    type: "security",
    title: "New Login Detected",
    description: "A new login was detected from Safari on macOS (IP: 192.168.1.52) at 07:44 AM.",
    read: false,
    createdAt: "2026-08-18T07:44:00Z",
  },
  {
    id: "notif-4",
    type: "activity",
    title: "Product Stock Running Low",
    description: "Product 'USB-C Cable (3-pack)' is running low (5 units left). Restocking is recommended.",
    read: true,
    createdAt: "2026-08-17T14:22:00Z",
    actionUrl: "/products",
  },
  {
    id: "notif-5",
    type: "activity",
    title: "New Customer Registered",
    description: "A new customer accounts has been created for Bob Martinez (bob@example.com).",
    read: true,
    createdAt: "2026-08-17T11:05:00Z",
    actionUrl: "/customers",
  },
  {
    id: "notif-6",
    type: "billing",
    title: "Invoice Overdue Warning",
    description: "Invoice INV-2026-002 for Bob Martinez is 24 hours overdue ($4,180.00).",
    read: false,
    createdAt: "2026-08-16T18:00:00Z",
    actionUrl: "/invoices",
  },
  {
    id: "notif-7",
    type: "system",
    title: "Database Backup Successful",
    description: "Weekly automated database backup has completed successfully without errors. Size: 1.2 GB.",
    read: true,
    createdAt: "2026-08-15T02:00:00Z",
  },
  {
    id: "notif-8",
    type: "security",
    title: "Password Changed",
    description: "Your account password was successfully updated. If you did not make this change, please contact support immediately.",
    read: true,
    createdAt: "2026-08-14T16:30:00Z",
    actionUrl: "/settings",
  },
  {
    id: "notif-9",
    type: "activity",
    title: "New Team Member Joined",
    description: "John Connor accepted your invitation and joined the workspace as an Administrator.",
    read: true,
    createdAt: "2026-08-12T10:15:00Z",
    actionUrl: "/team",
  },
  {
    id: "notif-10",
    type: "billing",
    title: "Subscription Renewed",
    description: "Your Enterprise Plan subscription has been successfully renewed. Thank you for your continued partnership!",
    read: true,
    createdAt: "2026-08-01T00:00:00Z",
    actionUrl: "/settings",
  },
]
