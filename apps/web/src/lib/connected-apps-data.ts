import {
  IconBrandDiscord,
  IconBrandDocker,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGmail,
  IconBrandMedium,
  IconBrandNotion,
  IconBrandSkype,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandTelegram,
  IconBrandTrello,
  IconBrandWhatsapp,
  IconBrandZoom,
  type Icon,
} from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConnectedApp = {
  id: string
  name: string
  icon: Icon
  /** Shown when the row is expanded */
  description: string
  /** What the integration is used for, listed in the expanded panel */
  scopes: string[]
  connected: boolean
}

// ─── Static data ──────────────────────────────────────────────────────────────

export const CONNECTED_APPS: ConnectedApp[] = [
  {
    id: "telegram",
    name: "Telegram",
    icon: IconBrandTelegram,
    description:
      "Send alerts and daily summaries straight to a Telegram channel or private chat.",
    scopes: ["Send messages", "Read channel list"],
    connected: false,
  },
  {
    id: "notion",
    name: "Notion",
    icon: IconBrandNotion,
    description:
      "Sync reports and meeting notes into a Notion database so the whole team can browse them.",
    scopes: ["Read databases", "Create pages"],
    connected: true,
  },
  {
    id: "figma",
    name: "Figma",
    icon: IconBrandFigma,
    description:
      "Embed live design frames in your project pages and get notified when a file changes.",
    scopes: ["Read files", "Read comments"],
    connected: true,
  },
  {
    id: "trello",
    name: "Trello",
    icon: IconBrandTrello,
    description:
      "Turn incoming requests into Trello cards and keep their status in sync with your board.",
    scopes: ["Read boards", "Create cards"],
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    icon: IconBrandSlack,
    description:
      "Post notifications to a channel and let your team act on them without leaving Slack.",
    scopes: ["Post to channels", "Read workspace members"],
    connected: false,
  },
  {
    id: "zoom",
    name: "Zoom",
    icon: IconBrandZoom,
    description:
      "Create meeting links from the calendar and attach recordings to the related record.",
    scopes: ["Create meetings", "Read recordings"],
    connected: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: IconBrandStripe,
    description:
      "Pull payments and subscription events so invoices and revenue reports stay accurate.",
    scopes: ["Read charges", "Read subscriptions"],
    connected: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: IconBrandGmail,
    description:
      "Send transactional email from your own address and log replies against each customer.",
    scopes: ["Send mail", "Read thread metadata"],
    connected: true,
  },
  {
    id: "medium",
    name: "Medium",
    icon: IconBrandMedium,
    description:
      "Publish release notes and changelog entries to your Medium publication in one click.",
    scopes: ["Create posts", "Read publications"],
    connected: false,
  },
  {
    id: "skype",
    name: "Skype",
    icon: IconBrandSkype,
    description:
      "Reach customers who still prefer Skype and keep those conversations in your inbox.",
    scopes: ["Send messages", "Read contacts"],
    connected: false,
  },
  {
    id: "docker",
    name: "Docker",
    icon: IconBrandDocker,
    description:
      "Watch image builds and get a heads-up when a deployment pushes a new tag.",
    scopes: ["Read repositories", "Read build events"],
    connected: false,
  },
  {
    id: "github",
    name: "GitHub",
    icon: IconBrandGithub,
    description:
      "Link issues and pull requests to your work items and surface CI results in the dashboard.",
    scopes: ["Read repositories", "Read issues & pull requests"],
    connected: false,
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: IconBrandGitlab,
    description:
      "Mirror pipelines and merge requests from GitLab into your project timeline.",
    scopes: ["Read projects", "Read pipelines"],
    connected: false,
  },
  {
    id: "discord",
    name: "Discord",
    icon: IconBrandDiscord,
    description:
      "Broadcast product updates to your community server and collect feedback in a thread.",
    scopes: ["Post to channels", "Read server roles"],
    connected: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: IconBrandWhatsapp,
    description:
      "Message customers on WhatsApp Business and keep the conversation history attached.",
    scopes: ["Send messages", "Read message status"],
    connected: false,
  },
]
