// ─── Types ────────────────────────────────────────────────────────────────────

import type { FileType } from "@/lib/files-data"

export type ProjectStatus = "active" | "on_hold" | "completed" | "cancelled"
export type Priority = "low" | "medium" | "high" | "urgent"
export type ProjectLabel = "design" | "ops" | "build_track" | "research"
export type GanttColor = "amber" | "cyan" | "fuchsia" | "indigo" | "zinc"
export type TaskStatus = "todo" | "in_progress" | "done"

export type ProjectFile = {
  id: string
  name: string
  type: FileType
  size: number // bytes
}

export type ProjectNote = {
  id: string
  title: string
  body: string
  date: string // "d MMM"
  icon: "file" | "waves"
}

export type ProjectActivity = {
  id: string
  user: string
  initials: string
  action: string
  target: string
  at: string // relative, e.g. "2h ago"
}

export type ProjectTask = {
  id: string
  title: string
  status: TaskStatus
  assignee: string
  assigneeInitials: string
  due: string // ISO date
}

export type ProjectIssue = {
  id: string // "RFC-101"
  title: string
  color: GanttColor
  startDate: string // ISO date
  endDate: string // ISO date
  dependencies: string[] // issue ids this depends on
}

export type Project = {
  id: string // "PRJ-001"
  code: string // "PM-OPS-02"
  name: string
  status: ProjectStatus
  priority: Priority
  label: ProjectLabel
  region: string
  cycle: string // "Improvement 4 weeks"
  updatedAt: string // "Just now" | ISO date
  brief: string
  timelineHealth: number // %
  daysLeft: number
  dueDate: string // ISO date
  estimate: string // "6 weeks"
  tasksClosed: number
  tasksTotal: number
  files: ProjectFile[]
  quickLinks: number
  pic: { initials: string; name: string }[]
  support: { initials: string; name: string }[]
  contributors: { name: string; initials: string }[]
  contributorsTotal: number
  notes: ProjectNote[]
  issues: ProjectIssue[]
  tasks: ProjectTask[]
  activity: ProjectActivity[]
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const STATUS_META: Record<
  ProjectStatus,
  { label: string; chip: string }
> = {
  active: {
    label: "Active",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
  },
  on_hold: {
    label: "On Hold",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
  },
  completed: {
    label: "Completed",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  cancelled: {
    label: "Cancelled",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

export const PRIORITY_META: Record<
  Priority,
  { label: string; chip: string; bars: number }
> = {
  low: {
    label: "Low",
    chip: "bg-muted text-muted-foreground ring-border",
    bars: 1,
  },
  medium: {
    label: "Medium",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
    bars: 2,
  },
  high: {
    label: "High",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
    bars: 3,
  },
  urgent: {
    label: "Urgent",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
    bars: 4,
  },
}

export const LABEL_META: Record<
  ProjectLabel,
  { label: string; chip: string; icon: "star" | "users" | "git_branch" }
> = {
  build_track: {
    label: "Build track",
    chip: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-50",
    icon: "star",
  },
  design: {
    label: "Design",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-100",
    icon: "users",
  },
  ops: {
    label: "Ops system",
    chip: "bg-muted text-muted-foreground",
    icon: "git_branch",
  },
  research: {
    label: "Research",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100",
    icon: "git_branch",
  },
}

export const GANTT_COLOR_META: Record<
  GanttColor,
  { bar: string; dot: string }
> = {
  amber: {
    bar: "border-amber-200/80 bg-amber-50/90 text-amber-950 dark:border-amber-400/50 dark:bg-amber-900/70 dark:text-amber-100",
    dot: "bg-amber-400/90",
  },
  cyan: {
    bar: "border-cyan-200/80 bg-cyan-50/90 text-cyan-900 dark:border-cyan-400/45 dark:bg-cyan-900/65 dark:text-cyan-100",
    dot: "bg-cyan-400/90",
  },
  fuchsia: {
    bar: "border-fuchsia-200/80 bg-fuchsia-50/90 text-fuchsia-900 dark:border-fuchsia-400/45 dark:bg-fuchsia-900/65 dark:text-fuchsia-100",
    dot: "bg-fuchsia-400/90",
  },
  indigo: {
    bar: "border-indigo-200/80 bg-indigo-50/90 text-indigo-950 dark:border-indigo-400/45 dark:bg-indigo-900/65 dark:text-indigo-100",
    dot: "bg-indigo-400/90",
  },
  zinc: {
    bar: "border-zinc-200/80 bg-zinc-50/90 text-zinc-900 dark:border-zinc-500/45 dark:bg-zinc-800/65 dark:text-zinc-100",
    dot: "bg-zinc-400/80",
  },
}

// ─── Filter options ───────────────────────────────────────────────────────────

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

export const LABEL_OPTIONS: { value: ProjectLabel; label: string }[] = [
  { value: "build_track", label: "Build track" },
  { value: "design", label: "Design" },
  { value: "ops", label: "Ops system" },
  { value: "research", label: "Research" },
]

// ─── Static data ──────────────────────────────────────────────────────────────

const SHARED_CONTRIBUTORS = [
  { name: "Kiara Laras", initials: "KL" },
  { name: "Joe Tesla", initials: "JT" },
  { name: "Tania Brooks", initials: "TB" },
  { name: "Cameron Williamson", initials: "CW" },
  { name: "Robert Fox", initials: "RF" },
  { name: "Megan Chen", initials: "MC" },
  { name: "Alex Morgan", initials: "AM" },
  { name: "Maya Patel", initials: "MP" },
]

const PM_OPS_ISSUES: ProjectIssue[] = [
  {
    id: "RFC-101",
    title: "Finalize issue timeline architecture",
    color: "amber",
    startDate: "2026-03-18",
    endDate: "2026-03-27",
    dependencies: [],
  },
  {
    id: "RFC-102",
    title: "Review gantt interaction states",
    color: "cyan",
    startDate: "2026-03-20",
    endDate: "2026-03-23",
    dependencies: ["RFC-101"],
  },
  {
    id: "RFC-103",
    title: "Sync issue filters with project views",
    color: "fuchsia",
    startDate: "2026-03-24",
    endDate: "2026-04-02",
    dependencies: ["RFC-101"],
  },
  {
    id: "RFC-104",
    title: "Document drag and resize behavior",
    color: "zinc",
    startDate: "2026-04-05",
    endDate: "2026-04-05",
    dependencies: ["RFC-102"],
  },
  {
    id: "RFC-105",
    title: "Create empty and loading timeline states",
    color: "cyan",
    startDate: "2026-03-30",
    endDate: "2026-04-07",
    dependencies: ["RFC-103"],
  },
  {
    id: "RFC-106",
    title: "Add mock dependencies and handoff notes",
    color: "indigo",
    startDate: "2026-03-19",
    endDate: "2026-03-24",
    dependencies: [],
  },
  {
    id: "RFC-107",
    title: "Polish the quarter view density",
    color: "fuchsia",
    startDate: "2026-03-22",
    endDate: "2026-03-25",
    dependencies: ["RFC-106"],
  },
  {
    id: "RFC-108",
    title: "Prepare issue calendar follow-up screen",
    color: "zinc",
    startDate: "2026-04-10",
    endDate: "2026-04-10",
    dependencies: ["RFC-105"],
  },
]

export const initialProjects: Project[] = [
  {
    id: "PRJ-001",
    code: "PM-OPS-02",
    name: "Internal PM System",
    status: "active",
    priority: "medium",
    label: "ops",
    region: "United States",
    cycle: "Improvement 4 weeks",
    updatedAt: "Just now",
    brief:
      "Internal PM System brings project intake, issue planning, role permissions, and delivery reporting into one shared workspace. This detail view tracks the operations work needed to turn the existing dashboards, lists, and issue surfaces into a cohesive project management flow.",
    timelineHealth: 58,
    daysLeft: 34,
    dueDate: "2026-02-14",
    estimate: "6 weeks",
    tasksClosed: 1,
    tasksTotal: 11,
    quickLinks: 3,
    files: [
      { id: "pf-1", name: "PM-system-scope.pdf", type: "pdf", size: 4_200_000 },
      { id: "pf-2", name: "issue-flow-map.zip", type: "other", size: 8_600_000 },
      { id: "pf-3", name: "project-ops-wireframes.fig", type: "doc", size: 11_400_000 },
      { id: "pf-4", name: "dashboard-metrics.fig", type: "doc", size: 9_800_000 },
      { id: "pf-5", name: "permission-matrix.pdf", type: "pdf", size: 2_700_000 },
      { id: "pf-6", name: "release-readiness.pdf", type: "pdf", size: 3_100_000 },
    ],
    pic: [
      { initials: "AM", name: "Alex Morgan" },
      { initials: "MP", name: "Maya Patel" },
    ],
    support: [{ initials: "S", name: "Sam Quinn" }],
    contributors: SHARED_CONTRIBUTORS,
    contributorsTotal: 18,
    notes: [
      {
        id: "pn-1",
        title: "Project review",
        body: "The team reviewed project operations, clarified the next sprint boundaries, and agreed to tighten how work moves from intake into implementation. Open questions center on permissions, issue routing, and what dashboard metrics should be visible at launch.",
        date: "12 Jul",
        icon: "waves",
      },
      {
        id: "pn-2",
        title: "Sprint alignment",
        body: "Reviewed current sprint goals, open issue states, and the handoff points between planning and implementation.",
        date: "18 Sep",
        icon: "file",
      },
      {
        id: "pn-3",
        title: "Stakeholder feedback",
        body: "Stakeholders want the detail screen to make ownership, blockers, and due windows visible without opening multiple tables.",
        date: "18 Sep",
        icon: "file",
      },
      {
        id: "pn-4",
        title: "Operations brainstorm",
        body: "Ideas for project intake improvements, including required fields, status transitions, and lightweight blocker prompts.",
        date: "17 Sep",
        icon: "file",
      },
    ],
    issues: PM_OPS_ISSUES,
    tasks: [
      { id: "pt-1", title: "Define permission matrix", status: "done", assignee: "Alex Morgan", assigneeInitials: "AM", due: "2026-01-20" },
      { id: "pt-2", title: "Wire issue intake form", status: "in_progress", assignee: "Maya Patel", assigneeInitials: "MP", due: "2026-01-28" },
      { id: "pt-3", title: "Build dashboard metrics view", status: "in_progress", assignee: "Robert Fox", assigneeInitials: "RF", due: "2026-02-02" },
      { id: "pt-4", title: "QA role transitions", status: "todo", assignee: "Tania Brooks", assigneeInitials: "TB", due: "2026-02-08" },
      { id: "pt-5", title: "Write release notes", status: "todo", assignee: "Joe Tesla", assigneeInitials: "JT", due: "2026-02-12" },
    ],
    activity: [
      { id: "pa-1", user: "Maya Patel", initials: "MP", action: "moved", target: "RFC-105 to In Progress", at: "2h ago" },
      { id: "pa-2", user: "Alex Morgan", initials: "AM", action: "completed", target: "Define permission matrix", at: "5h ago" },
      { id: "pa-3", user: "Robert Fox", initials: "RF", action: "commented on", target: "RFC-103", at: "1d ago" },
      { id: "pa-4", user: "Tania Brooks", initials: "TB", action: "created", target: "QA role transitions", at: "2d ago" },
      { id: "pa-5", user: "Joe Tesla", initials: "JT", action: "updated due date for", target: "Write release notes", at: "3d ago" },
    ],
  },
  {
    id: "PRJ-002",
    code: "DSGN-01",
    name: "Dashboard Redesign",
    status: "active",
    priority: "high",
    label: "design",
    region: "United States",
    cycle: "Sprint 2 weeks",
    updatedAt: "2026-08-17",
    brief:
      "Refresh the analytics dashboard with a denser KPI grid, improved chart legends, and a responsive two-column layout for detail panels.",
    timelineHealth: 72,
    daysLeft: 12,
    dueDate: "2026-09-01",
    estimate: "2 weeks",
    tasksClosed: 6,
    tasksTotal: 14,
    quickLinks: 2,
    files: [
      { id: "pf-7", name: "kpi-grid-spec.pdf", type: "pdf", size: 1_900_000 },
      { id: "pf-8", name: "legend-variants.fig", type: "doc", size: 5_400_000 },
    ],
    pic: [{ initials: "KL", name: "Kiara Laras" }],
    support: [{ initials: "JT", name: "Joe Tesla" }],
    contributors: SHARED_CONTRIBUTORS.slice(0, 5),
    contributorsTotal: 9,
    notes: [
      {
        id: "pn-5",
        title: "Design crit",
        body: "Reviewed three KPI grid variants. Decided on the 4-column responsive grid with container queries.",
        date: "15 Aug",
        icon: "waves",
      },
    ],
    issues: [
      {
        id: "RFC-201",
        title: "Audit existing dashboard charts",
        color: "cyan",
        startDate: "2026-08-20",
        endDate: "2026-08-24",
        dependencies: [],
      },
      {
        id: "RFC-202",
        title: "Build KPI grid component",
        color: "amber",
        startDate: "2026-08-25",
        endDate: "2026-08-31",
        dependencies: ["RFC-201"],
      },
    ],
    tasks: [
      { id: "pt-6", title: "Audit charts", status: "done", assignee: "Kiara Laras", assigneeInitials: "KL", due: "2026-08-24" },
      { id: "pt-7", title: "Build KPI grid", status: "in_progress", assignee: "Megan Chen", assigneeInitials: "MC", due: "2026-08-31" },
    ],
    activity: [
      { id: "pa-6", user: "Kiara Laras", initials: "KL", action: "completed", target: "Audit charts", at: "1d ago" },
      { id: "pa-7", user: "Megan Chen", initials: "MC", action: "started", target: "Build KPI grid", at: "3h ago" },
    ],
  },
  {
    id: "PRJ-003",
    code: "INFRA-09",
    name: "API Gateway Migration",
    status: "on_hold",
    priority: "urgent",
    label: "ops",
    region: "Germany",
    cycle: "Quarterly 12 weeks",
    updatedAt: "2026-08-10",
    brief:
      "Migrate the legacy API gateway to the new edge runtime, deprecate the old auth middleware, and cut p95 latency by 40%.",
    timelineHealth: 30,
    daysLeft: 45,
    dueDate: "2026-10-15",
    estimate: "12 weeks",
    tasksClosed: 3,
    tasksTotal: 22,
    quickLinks: 1,
    files: [
      { id: "pf-9", name: "migration-plan.pdf", type: "pdf", size: 3_300_000 },
    ],
    pic: [{ initials: "CW", name: "Cameron Williamson" }],
    support: [{ initials: "RF", name: "Robert Fox" }],
    contributors: SHARED_CONTRIBUTORS.slice(2, 6),
    contributorsTotal: 7,
    notes: [
      {
        id: "pn-6",
        title: "Blocked",
        body: "On hold pending infrastructure provisioning sign-off from the platform team.",
        date: "10 Aug",
        icon: "waves",
      },
    ],
    issues: [
      {
        id: "RFC-301",
        title: "Provision edge runtime",
        color: "indigo",
        startDate: "2026-09-01",
        endDate: "2026-09-10",
        dependencies: [],
      },
    ],
    tasks: [
      { id: "pt-8", title: "Provision runtime", status: "todo", assignee: "Cameron Williamson", assigneeInitials: "CW", due: "2026-09-10" },
    ],
    activity: [
      { id: "pa-8", user: "Cameron Williamson", initials: "CW", action: "paused", target: "API Gateway Migration", at: "9d ago" },
    ],
  },
  {
    id: "PRJ-004",
    code: "RSCH-04",
    name: "User Research Q3",
    status: "active",
    priority: "low",
    label: "research",
    region: "Canada",
    cycle: "Cycle 6 weeks",
    updatedAt: "2026-08-18",
    brief:
      "Run a round of moderated usability tests on the new navigation and produce a findings deck with prioritized recommendations.",
    timelineHealth: 85,
    daysLeft: 21,
    dueDate: "2026-09-08",
    estimate: "6 weeks",
    tasksClosed: 9,
    tasksTotal: 12,
    quickLinks: 4,
    files: [
      { id: "pf-10", name: "research-script.pdf", type: "pdf", size: 1_100_000 },
      { id: "pf-11", name: "findings-deck.fig", type: "doc", size: 7_200_000 },
    ],
    pic: [{ initials: "TB", name: "Tania Brooks" }],
    support: [{ initials: "AM", name: "Alex Morgan" }],
    contributors: SHARED_CONTRIBUTORS.slice(1, 4),
    contributorsTotal: 6,
    notes: [
      {
        id: "pn-7",
        title: "Recruitment done",
        body: "All 12 participants confirmed for the moderated sessions starting Monday.",
        date: "18 Aug",
        icon: "file",
      },
    ],
    issues: [
      {
        id: "RFC-401",
        title: "Recruit participants",
        color: "cyan",
        startDate: "2026-08-11",
        endDate: "2026-08-18",
        dependencies: [],
      },
      {
        id: "RFC-402",
        title: "Run sessions",
        color: "amber",
        startDate: "2026-08-19",
        endDate: "2026-08-29",
        dependencies: ["RFC-401"],
      },
    ],
    tasks: [
      { id: "pt-9", title: "Recruit participants", status: "done", assignee: "Tania Brooks", assigneeInitials: "TB", due: "2026-08-18" },
      { id: "pt-10", title: "Run sessions", status: "in_progress", assignee: "Tania Brooks", assigneeInitials: "TB", due: "2026-08-29" },
      { id: "pt-11", title: "Synthesize findings", status: "todo", assignee: "Sam Quinn", assigneeInitials: "SQ", due: "2026-09-05" },
    ],
    activity: [
      { id: "pa-9", user: "Tania Brooks", initials: "TB", action: "started", target: "Run sessions", at: "1h ago" },
    ],
  },
  {
    id: "PRJ-005",
    code: "BLD-12",
    name: "Component Library v2",
    status: "active",
    priority: "high",
    label: "build_track",
    region: "United States",
    cycle: "Sprint 2 weeks",
    updatedAt: "2026-08-16",
    brief:
      "Ship the second major version of the internal component library: new form primitives, accessible combobox, and a tokens overhaul.",
    timelineHealth: 64,
    daysLeft: 18,
    dueDate: "2026-09-04",
    estimate: "4 weeks",
    tasksClosed: 8,
    tasksTotal: 19,
    quickLinks: 2,
    files: [
      { id: "pf-12", name: "tokens-v2.json", type: "other", size: 84_000 },
      { id: "pf-13", name: "combobox-spec.pdf", type: "pdf", size: 2_200_000 },
    ],
    pic: [{ initials: "MP", name: "Maya Patel" }],
    support: [{ initials: "MC", name: "Megan Chen" }],
    contributors: SHARED_CONTRIBUTORS.slice(3, 8),
    contributorsTotal: 11,
    notes: [
      {
        id: "pn-8",
        title: "Tokens frozen",
        body: "Color tokens are frozen for v2. Spacing scale still under review.",
        date: "16 Aug",
        icon: "waves",
      },
    ],
    issues: [
      {
        id: "RFC-501",
        title: "Freeze tokens",
        color: "fuchsia",
        startDate: "2026-08-15",
        endDate: "2026-08-18",
        dependencies: [],
      },
      {
        id: "RFC-502",
        title: "Build combobox",
        color: "indigo",
        startDate: "2026-08-20",
        endDate: "2026-08-28",
        dependencies: ["RFC-501"],
      },
    ],
    tasks: [
      { id: "pt-12", title: "Freeze tokens", status: "done", assignee: "Maya Patel", assigneeInitials: "MP", due: "2026-08-18" },
      { id: "pt-13", title: "Build combobox", status: "in_progress", assignee: "Megan Chen", assigneeInitials: "MC", due: "2026-08-28" },
      { id: "pt-14", title: "Write migration guide", status: "todo", assignee: "Robert Fox", assigneeInitials: "RF", due: "2026-09-02" },
    ],
    activity: [
      { id: "pa-10", user: "Maya Patel", initials: "MP", action: "completed", target: "Freeze tokens", at: "2d ago" },
    ],
  },
  {
    id: "PRJ-006",
    code: "OPS-22",
    name: "Billing Automation",
    status: "completed",
    priority: "medium",
    label: "ops",
    region: "India",
    cycle: "Sprint 3 weeks",
    updatedAt: "2026-07-30",
    brief:
      "Automate invoice generation, dunning emails, and failed-payment recovery. Shipped to production at the end of July.",
    timelineHealth: 100,
    daysLeft: 0,
    dueDate: "2026-07-30",
    estimate: "3 weeks",
    tasksClosed: 15,
    tasksTotal: 15,
    quickLinks: 1,
    files: [
      { id: "pf-14", name: "billing-runbook.pdf", type: "pdf", size: 1_500_000 },
    ],
    pic: [{ initials: "RF", name: "Robert Fox" }],
    support: [{ initials: "CW", name: "Cameron Williamson" }],
    contributors: SHARED_CONTRIBUTORS.slice(0, 3),
    contributorsTotal: 5,
    notes: [
      {
        id: "pn-9",
        title: "Shipped",
        body: "Billing automation live in production. Monitoring stable for the first week.",
        date: "30 Jul",
        icon: "waves",
      },
    ],
    issues: [],
    tasks: [
      { id: "pt-15", title: "Generate invoices", status: "done", assignee: "Robert Fox", assigneeInitials: "RF", due: "2026-07-20" },
      { id: "pt-16", title: "Dunning emails", status: "done", assignee: "Robert Fox", assigneeInitials: "RF", due: "2026-07-25" },
    ],
    activity: [
      { id: "pa-11", user: "Robert Fox", initials: "RF", action: "shipped", target: "Billing Automation", at: "20d ago" },
    ],
  },
  {
    id: "PRJ-007",
    code: "DSGN-15",
    name: "Mobile Nav Overhaul",
    status: "cancelled",
    priority: "low",
    label: "design",
    region: "United States",
    cycle: "Cycle 4 weeks",
    updatedAt: "2026-06-12",
    brief:
      "Cancelled in favour of the broader navigation rethink under Dashboard Redesign. Some prototypes archived for reference.",
    timelineHealth: 0,
    daysLeft: 0,
    dueDate: "2026-06-12",
    estimate: "4 weeks",
    tasksClosed: 2,
    tasksTotal: 9,
    quickLinks: 0,
    files: [],
    pic: [{ initials: "KL", name: "Kiara Laras" }],
    support: [],
    contributors: [],
    contributorsTotal: 0,
    notes: [
      {
        id: "pn-10",
        title: "Cancelled",
        body: "Folded into the Dashboard Redesign initiative. Prototypes kept in the archive folder.",
        date: "12 Jun",
        icon: "waves",
      },
    ],
    issues: [],
    tasks: [],
    activity: [
      { id: "pa-12", user: "Kiara Laras", initials: "KL", action: "cancelled", target: "Mobile Nav Overhaul", at: "2mo ago" },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProjectById(id: string): Project | undefined {
  return initialProjects.find((p) => p.id === id)
}

export function computeStats(projects: Project[]) {
  const total = projects.length
  const active = projects.filter((p) => p.status === "active").length
  const onTrack = projects.filter(
    (p) => p.status === "active" && p.timelineHealth >= 60
  ).length
  const dueSoon = projects.filter(
    (p) => p.status === "active" && p.daysLeft > 0 && p.daysLeft <= 14
  ).length
  return { total, active, onTrack, dueSoon }
}
