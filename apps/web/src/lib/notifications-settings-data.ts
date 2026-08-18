// 1. Type definitions
export type NotifyScope = "all" | "mentions" | "none"

export type EmailNotification = {
  id: string
  label: string
  description: string
  defaultOn: boolean
  /** Always-on notifications the user cannot turn off. */
  locked?: boolean
}

// 2. Filter / choice options
export const NOTIFY_OPTIONS: { value: NotifyScope; label: string }[] = [
  { value: "all", label: "All new messages" },
  { value: "mentions", label: "Direct messages and mentions" },
  { value: "none", label: "Nothing" },
]

// 3. Static data
export const EMAIL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: "communication",
    label: "Communication emails",
    description: "Receive emails about your account activity.",
    defaultOn: false,
  },
  {
    id: "marketing",
    label: "Marketing emails",
    description: "Receive emails about new products, features, and more.",
    defaultOn: false,
  },
  {
    id: "social",
    label: "Social emails",
    description: "Receive emails for friend requests, follows, and more.",
    defaultOn: true,
  },
  {
    id: "security",
    label: "Security emails",
    description: "Receive emails about your account activity and security.",
    defaultOn: true,
    locked: true,
  },
]
