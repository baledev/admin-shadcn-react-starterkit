// ─── Types ────────────────────────────────────────────────────────────────────

export type IssueStatus = "backlog" | "todo" | "in_progress" | "review" | "done"

export type IssuePriority = "high" | "medium" | "low"

export type WorkspaceTab =
  "overview" | "assigned" | "reported" | "watching" | "updates"

export type WorkspaceIssue = {
  id: string // "RFC-NNN"
  title: string
  status: IssueStatus
  priority: IssuePriority
  assignee: { name: string; avatar: string } | null
  reporter: string
  watching: boolean
  hasUpdates: boolean
  labels: string[]
  dueDate: string // ISO date
}

export type MeetingCategory = "roadmap" | "design" | "launch"

export type WorkspaceMeeting = {
  id: string
  title: string
  time: string
  attendees: { name: string; avatar: string }[]
  extraCount: number
  category: MeetingCategory
  platform: string
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const ISSUE_STATUS_META: Record<
  IssueStatus,
  { label: string; chip: string; dot: string }
> = {
  backlog: {
    label: "Backlog",
    chip: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-900 dark:bg-zinc-950/40 dark:text-zinc-300",
    dot: "bg-zinc-400",
  },
  todo: {
    label: "Todo",
    chip: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300",
    dot: "bg-cyan-400",
  },
  in_progress: {
    label: "In Progress",
    chip: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-400",
  },
  review: {
    label: "Review",
    chip: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-300",
    dot: "bg-fuchsia-400",
  },
  done: {
    label: "Done",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-400",
  },
}

export const ISSUE_STATUS_ORDER: IssueStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
]

export const STATUS_COUNTS: Record<IssueStatus, number> = {
  backlog: 2,
  todo: 2,
  in_progress: 1,
  review: 2,
  done: 1,
}

export const PRIORITY_META: Record<
  IssuePriority,
  { label: string; tableColor: string }
> = {
  high: { label: "High", tableColor: "text-red-500" },
  medium: { label: "Medium", tableColor: "text-amber-500" },
  low: { label: "Low", tableColor: "text-emerald-500" },
}

export const MEETING_CATEGORY_META: Record<
  MeetingCategory,
  { label: string; chip: string }
> = {
  roadmap: {
    label: "Roadmap",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  design: {
    label: "Design",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  },
  launch: {
    label: "Launch",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  },
}

export const WORKSPACE_TABS: { value: WorkspaceTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "assigned", label: "Assigned to me" },
  { value: "reported", label: "Reported by me" },
  { value: "watching", label: "Watching" },
  { value: "updates", label: "Updates" },
]

// ─── Work hour analysis ───────────────────────────────────────────────────────

export type WorkHourPeriod = "5d" | "2w" | "1m" | "6m" | "1y"

export const WORK_HOUR_PERIODS: { value: WorkHourPeriod; label: string }[] = [
  { value: "5d", label: "5D" },
  { value: "2w", label: "2W" },
  { value: "1m", label: "1M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
]

export type WorkHourPoint = {
  label: string
  minutes: number
}

export const WORK_HOUR_DATA: Record<
  WorkHourPeriod,
  { total: string; data: WorkHourPoint[] }
> = {
  "5d": {
    total: "38 hours · 12 mins",
    data: [
      { label: "Mon", minutes: 425 },
      { label: "Tue", minutes: 510 },
      { label: "Wed", minutes: 395 },
      { label: "Thu", minutes: 462 },
      { label: "Fri", minutes: 500 },
    ],
  },
  "2w": {
    total: "76 hours · 40 mins",
    data: [
      { label: "W1 Mon", minutes: 410 },
      { label: "W1 Tue", minutes: 505 },
      { label: "W1 Wed", minutes: 388 },
      { label: "W1 Thu", minutes: 455 },
      { label: "W1 Fri", minutes: 492 },
      { label: "W2 Mon", minutes: 425 },
      { label: "W2 Tue", minutes: 510 },
      { label: "W2 Wed", minutes: 395 },
      { label: "W2 Thu", minutes: 462 },
      { label: "W2 Fri", minutes: 500 },
    ],
  },
  "1m": {
    total: "165 hours · 05 mins",
    data: [
      { label: "Week 1", minutes: 1900 },
      { label: "Week 2", minutes: 2050 },
      { label: "Week 3", minutes: 1780 },
      { label: "Week 4", minutes: 2210 },
    ],
  },
  "6m": {
    total: "960 hours · 20 mins",
    data: [
      { label: "Mar", minutes: 15500 },
      { label: "Apr", minutes: 16800 },
      { label: "May", minutes: 16150 },
      { label: "Jun", minutes: 17300 },
      { label: "Jul", minutes: 15850 },
      { label: "Aug", minutes: 16600 },
    ],
  },
  "1y": {
    total: "1,940 hours · 45 mins",
    data: [
      { label: "Sep", minutes: 16000 },
      { label: "Oct", minutes: 17100 },
      { label: "Nov", minutes: 16450 },
      { label: "Dec", minutes: 15800 },
      { label: "Jan", minutes: 16900 },
      { label: "Feb", minutes: 16100 },
      { label: "Mar", minutes: 17250 },
      { label: "Apr", minutes: 16800 },
      { label: "May", minutes: 16400 },
      { label: "Jun", minutes: 17700 },
      { label: "Jul", minutes: 16950 },
      { label: "Aug", minutes: 17200 },
    ],
  },
}

// ─── Static data ──────────────────────────────────────────────────────────────

export const WORKSPACE_USER = {
  name: "ausrobdev",
  email: "rob@shadcnblocks.com",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&auto=format",
  cover:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=300&fit=crop&auto=format",
  joinedOn: "Jan 10, 2026",
  timezone: "20:16 UTC",
}

const AVATARS = {
  nina: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
  kai: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
  lena: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
  ava: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&auto=format",
}

export const MY_ISSUES: WorkspaceIssue[] = [
  {
    id: "RFC-101",
    title: "Finalize issue timeline architecture",
    status: "in_progress",
    priority: "high",
    assignee: { name: "Nina Oliver", avatar: AVATARS.nina },
    reporter: WORKSPACE_USER.name,
    watching: true,
    hasUpdates: false,
    labels: ["timeline", "frontend"],
    dueDate: "2026-04-10",
  },
  {
    id: "RFC-102",
    title: "Review gantt interaction states",
    status: "todo",
    priority: "medium",
    assignee: null,
    reporter: WORKSPACE_USER.name,
    watching: false,
    hasUpdates: true,
    labels: ["review"],
    dueDate: "2026-04-06",
  },
  {
    id: "RFC-103",
    title: "Sync issue filters with project views",
    status: "review",
    priority: "high",
    assignee: { name: "Kai Young", avatar: AVATARS.kai },
    reporter: "Ava Reed",
    watching: true,
    hasUpdates: true,
    labels: ["views", "filters"],
    dueDate: "2026-04-16",
  },
  {
    id: "RFC-105",
    title: "Create empty and loading timeline states",
    status: "todo",
    priority: "medium",
    assignee: null,
    reporter: WORKSPACE_USER.name,
    watching: false,
    hasUpdates: false,
    labels: ["states"],
    dueDate: "2026-04-21",
  },
  {
    id: "RFC-106",
    title: "Add mock dependencies and handoff notes",
    status: "done",
    priority: "low",
    assignee: { name: "Lena Moss", avatar: AVATARS.lena },
    reporter: WORKSPACE_USER.name,
    watching: true,
    hasUpdates: false,
    labels: ["handoff"],
    dueDate: "2026-04-07",
  },
  {
    id: "RFC-107",
    title: "Polish the quarter view density",
    status: "review",
    priority: "medium",
    assignee: { name: "Ava Reed", avatar: AVATARS.ava },
    reporter: WORKSPACE_USER.name,
    watching: false,
    hasUpdates: true,
    labels: ["density"],
    dueDate: "2026-04-08",
  },
]

export const MY_MEETINGS: WorkspaceMeeting[] = [
  {
    id: "meeting-1",
    title: "Timeline planning review",
    time: "09:00 - 09:45 AM",
    attendees: [
      { name: "Nina Oliver", avatar: AVATARS.nina },
      { name: "Kai Young", avatar: AVATARS.kai },
      { name: "Ava Reed", avatar: AVATARS.ava },
    ],
    extraCount: 2,
    category: "roadmap",
    platform: "On Google Meet",
  },
  {
    id: "meeting-2",
    title: "Design handoff sync",
    time: "11:30 - 12:00 PM",
    attendees: [
      { name: "Lena Moss", avatar: AVATARS.lena },
      { name: "Nina Oliver", avatar: AVATARS.nina },
      { name: "Ava Reed", avatar: AVATARS.ava },
    ],
    extraCount: 1,
    category: "design",
    platform: "On Zoom",
  },
  {
    id: "meeting-3",
    title: "Release readiness check",
    time: "03:00 - 03:30 PM",
    attendees: [
      { name: "Nina Oliver", avatar: AVATARS.nina },
      { name: "Kai Young", avatar: AVATARS.kai },
      { name: "Ava Reed", avatar: AVATARS.ava },
    ],
    extraCount: 3,
    category: "launch",
    platform: "On Slack",
  },
]

// ─── Overview stats ───────────────────────────────────────────────────────────

export const OVERVIEW_STATS = [
  { key: "created", label: "Issues created", value: 8 },
  { key: "assigned", label: "Issues assigned", value: 4 },
  { key: "subscribed", label: "Issues subscribed", value: 6 },
] as const

// ─── Helper functions ─────────────────────────────────────────────────────────

export function filterIssues(tab: WorkspaceTab): WorkspaceIssue[] {
  switch (tab) {
    case "assigned":
      return MY_ISSUES.filter((issue) => issue.assignee !== null)
    case "reported":
      return MY_ISSUES.filter((issue) => issue.reporter === WORKSPACE_USER.name)
    case "watching":
      return MY_ISSUES.filter((issue) => issue.watching)
    case "updates":
      return MY_ISSUES.filter((issue) => issue.hasUpdates)
    default:
      return MY_ISSUES
  }
}
