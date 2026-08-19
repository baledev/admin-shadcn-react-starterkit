import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Line, LineChart, CartesianGrid, Tooltip, XAxis } from "recharts"
import {
  IconBell,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconDots,
  IconFilePlus,
  IconFlag,
  IconInfoCircle,
  IconLayoutSidebarRightExpand,
  IconPencil,
  IconPlayerPause,
  IconPlayerPlay,
  IconRotate,
  IconTag,
  IconUserCheck,
  IconVideo,
} from "@tabler/icons-react"

import {
  type IssueStatus,
  type WorkspaceIssue,
  type WorkspaceTab,
  filterIssues,
  ISSUE_STATUS_META,
  ISSUE_STATUS_ORDER,
  MEETING_CATEGORY_META,
  MY_ISSUES,
  MY_MEETINGS,
  OVERVIEW_STATS,
  PRIORITY_META,
  STATUS_COUNTS,
  WORK_HOUR_DATA,
  WORK_HOUR_PERIODS,
  type WorkHourPeriod,
  WORKSPACE_TABS,
  WORKSPACE_USER,
} from "@/lib/workspace-data"
import { Button } from "@workspace/ui/components/button"
import {
  ChartContainer,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Sheet, SheetContent } from "@workspace/ui/components/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const Route = createFileRoute("/_auth/workspace")({
  component: WorkspacePage,
})

// ─── Page ─────────────────────────────────────────────────────────────────────

function WorkspacePage() {
  const [activeTab, setActiveTab] = React.useState<WorkspaceTab>("overview")
  const [panelOpen, setPanelOpen] = React.useState(false)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="@container/main flex min-h-0 min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 xl:overflow-hidden">
          <PageHeader title="My workspace">
            <Button
              variant="outline"
              size="sm"
              className="xl:hidden"
              type="button"
              onClick={() => setPanelOpen(true)}
              aria-label="Open workspace panel"
            >
              <IconLayoutSidebarRightExpand
                className="size-4"
                aria-hidden="true"
              />
              <span className="ml-1.5">Panel</span>
            </Button>
          </PageHeader>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as WorkspaceTab)}
            className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6"
          >
            <div className="flex items-center justify-between pb-4">
              <Label htmlFor="tab-selector" className="sr-only">
                Workspace Tab
              </Label>
              <Select
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as WorkspaceTab)}
              >
                <SelectTrigger
                  className="flex w-fit sm:hidden"
                  size="sm"
                  id="tab-selector"
                >
                  <SelectValue placeholder="Select tab" />
                </SelectTrigger>
                <SelectContent>
                  {WORKSPACE_TABS.map((tab) => (
                    <SelectItem key={tab.value} value={tab.value}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <TabsList className="hidden sm:flex">
                {WORKSPACE_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6 xl:flex-row xl:items-stretch xl:gap-6 xl:overflow-hidden">
              {/* Main content column */}
              <div className="flex min-w-0 flex-1 flex-col gap-4 pr-1 md:gap-6 xl:overflow-y-auto">
                <TabsContent
                  value="overview"
                  className="flex min-w-0 flex-col gap-4 md:gap-6"
                >
                  <OverviewStats />
                  <IssueStatusCards />
                  <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
                    <WorkHourAnalysis />
                    <TimeTracker />
                  </div>
                  <IssuesSection
                    title="My issues"
                    issues={filterIssues("overview")}
                  />
                </TabsContent>

                <TabsContent
                  value="assigned"
                  className="flex min-w-0 flex-col gap-4 md:gap-6"
                >
                  <IssuesSection
                    title="Assigned to me"
                    issues={filterIssues("assigned")}
                  />
                </TabsContent>

                <TabsContent
                  value="reported"
                  className="flex min-w-0 flex-col gap-4 md:gap-6"
                >
                  <IssuesSection
                    title="Reported by me"
                    issues={filterIssues("reported")}
                  />
                </TabsContent>

                <TabsContent
                  value="watching"
                  className="flex min-w-0 flex-col gap-4 md:gap-6"
                >
                  <IssuesSection
                    title="Watching"
                    issues={filterIssues("watching")}
                  />
                </TabsContent>

                <TabsContent
                  value="updates"
                  className="flex min-w-0 flex-col gap-4 md:gap-6"
                >
                  <IssuesSection
                    title="Updates"
                    issues={filterIssues("updates")}
                  />
                </TabsContent>
              </div>

              {/* Desktop right aside panel */}
              <aside className="hidden w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-xl border-t border-border bg-card text-card-foreground xl:flex xl:w-[300px] xl:border-t-0 xl:border-l">
                <WorkspaceAside />
              </aside>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Mobile right aside panel */}
      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent
          side="right"
          className="gap-0 overflow-y-auto bg-card p-0 text-card-foreground sm:max-w-sm"
        >
          <WorkspaceAside />
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─── Overview Stats ───────────────────────────────────────────────────────────

const STAT_ICONS: Record<
  (typeof OVERVIEW_STATS)[number]["key"],
  React.ReactNode
> = {
  created: (
    <IconFilePlus
      className="size-5 text-foreground"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  ),
  assigned: (
    <IconUserCheck
      className="size-5 text-foreground"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  ),
  subscribed: (
    <IconBell
      className="size-5 text-foreground"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  ),
}

function OverviewStats() {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h2 className="text-sm font-semibold">Overview</h2>
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
        {OVERVIEW_STATS.map((stat) => (
          <Card key={stat.key} className="@container/card" size="sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              <CardAction>
                <div className="grid size-11 place-items-center rounded-md bg-muted text-muted-foreground">
                  {STAT_ICONS[stat.key]}
                </div>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

// ─── Issue Status ─────────────────────────────────────────────────────────────

function IssueStatusCards() {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h2 className="text-sm font-semibold">Issue status</h2>
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-5 dark:*:data-[slot=card]:bg-card">
        {ISSUE_STATUS_ORDER.map((status) => (
          <Card key={status} className="@container/card" size="sm">
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5 truncate">
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    ISSUE_STATUS_META[status].dot
                  )}
                  aria-hidden="true"
                />
                {ISSUE_STATUS_META[status].label}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {STATUS_COUNTS[status]}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

// ─── Work Hour Analysis ───────────────────────────────────────────────────────

const FULL_LABELS: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  "W1 Mon": "W1 Monday",
  "W1 Tue": "W1 Tuesday",
  "W1 Wed": "W1 Wednesday",
  "W1 Thu": "W1 Thursday",
  "W1 Fri": "W1 Friday",
  "W2 Mon": "W2 Monday",
  "W2 Tue": "W2 Tuesday",
  "W2 Wed": "W2 Wednesday",
  "W2 Thu": "W2 Thursday",
  "W2 Fri": "W2 Friday",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
  Jan: "January",
  Feb: "February",
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { label: string; minutes: number } }[]
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const hours = (data.minutes / 60).toFixed(1).replace(".0", "")
    const label = FULL_LABELS[data.label] ?? data.label
    return (
      <div className="rounded-[5px] border border-border bg-popover px-2 py-0.5 text-[12px] leading-5 text-popover-foreground shadow-[0_8px_20px_rgb(24_24_27/10%)]">
        {label}, {hours}h
      </div>
    )
  }
  return null
}

const workHourChartConfig = {
  minutes: {
    label: "Minutes",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function WorkHourAnalysis() {
  const [period, setPeriod] = React.useState<WorkHourPeriod>("5d")
  const chartData = WORK_HOUR_DATA[period].data

  return (
    <section className="flex h-full min-w-0 flex-col gap-2 lg:col-span-2">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h2 className="text-[16px] leading-6 font-medium text-foreground">
          Work Hour Analysis
        </h2>
      </div>
      <div
        className="flex min-w-0 flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-none"
        data-work-hour-analysis="true"
      >
        <div className="flex min-w-0 flex-1 flex-col p-3 py-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10">
              <div className="grid size-4 place-items-center rounded-full bg-primary">
                <IconClock
                  className="size-2.5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] leading-3 font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Total Work
              </p>
              <p className="truncate text-[15px] leading-6 font-semibold tracking-tight sm:text-[17px]">
                {WORK_HOUR_DATA[period].total}
              </p>
            </div>
          </div>

          <div className="mt-4 grid h-7 grid-cols-5 overflow-hidden rounded-[6px] border border-border bg-background text-[12px] leading-4 font-medium text-muted-foreground">
            {WORK_HOUR_PERIODS.map((item) => {
              const isActive = period === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={cn(
                    "border-r border-border transition-colors outline-none last:border-r-0 hover:bg-muted focus-visible:bg-muted",
                    isActive && "bg-muted text-foreground"
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <ChartContainer
            config={workHourChartConfig}
            className="relative mt-3 aspect-auto h-[120px] w-full shrink-0"
          >
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="6 10" />
              <XAxis dataKey="label" hide />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1.5,
                  strokeDasharray: "3 4",
                }}
              />
              <Line
                dataKey="minutes"
                type="monotone"
                stroke="var(--color-minutes)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "var(--background)",
                  stroke: "var(--foreground)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ChartContainer>

          <div className="mt-2.5 flex items-center gap-1.5 text-[12px] leading-4 text-muted-foreground">
            <IconInfoCircle
              className="size-3.5 shrink-0 fill-muted-foreground/30 text-background"
              aria-hidden="true"
            />
            <span>Total work hours include extra hours.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Time Tracker ─────────────────────────────────────────────────────────────

function formatElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function TimeTracker() {
  const [selectedIssue, setSelectedIssue] = React.useState(MY_ISSUES[0])
  const [isRunning, setIsRunning] = React.useState(false)
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    if (!isRunning) return
    const interval = window.setInterval(() => {
      setElapsed((seconds) => seconds + 1)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [isRunning])

  const handleReset = () => {
    setIsRunning(false)
    setElapsed(0)
  }

  return (
    <section className="flex h-full min-w-0 flex-col gap-2">
      <h2 className="text-[16px] leading-6 font-medium text-foreground">
        Time Tracker
      </h2>
      <div
        className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-none"
        data-time-tracker-card="true"
      >
        <div className="flex min-h-[268px] min-w-0 flex-1 flex-col overflow-hidden p-3 py-5">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex h-9 w-full max-w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-[6px] border border-input bg-background px-3 text-left text-sm shadow-none outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                />
              }
            >
              <span className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 overflow-hidden">
                <span className="shrink-0 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  {selectedIssue.id}
                </span>
                <span className="min-w-0 truncate text-[13px] leading-5 font-normal text-foreground">
                  {selectedIssue.title}
                </span>
              </span>
              <IconChevronDown
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {MY_ISSUES.map((issue) => (
                <DropdownMenuItem
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="gap-2"
                >
                  <span className="w-16 shrink-0 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    {issue.id}
                  </span>
                  <span className="min-w-0 truncate text-xs">
                    {issue.title}
                  </span>
                  {issue.id === selectedIssue.id && (
                    <IconCheck
                      className="ms-auto size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            data-time-tracker-panel="true"
            className="flex flex-1 flex-col items-center justify-center rounded-[6px] px-3 py-4 text-center"
          >
            <p className="text-[10px] leading-3 font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {isRunning ? "Tracking" : "Awaiting"}
            </p>
            <p className="mt-2 text-[34px] leading-none font-medium tracking-[-0.02em] whitespace-nowrap text-foreground tabular-nums">
              {formatElapsed(elapsed)}
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsRunning((running) => !running)}
                className="inline-flex h-7 items-center justify-center gap-2 rounded-[6px] px-2 py-2 text-[13px] font-medium whitespace-nowrap text-primary transition-colors hover:bg-background hover:text-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                {isRunning ? (
                  <IconPlayerPause
                    className="size-3.5 fill-current"
                    aria-hidden="true"
                  />
                ) : (
                  <IconPlayerPlay
                    className="size-3.5 fill-current"
                    aria-hidden="true"
                  />
                )}
                {isRunning ? "Stop" : "Start"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset time tracker"
                className="inline-flex size-7 items-center justify-center gap-2 rounded-[6px] text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <IconRotate className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── My Issues ────────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: IssueStatus }) {
  const meta = ISSUE_STATUS_META[status]
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md border px-2 text-[11px] font-medium",
        meta.chip
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}

function IssuesSection({
  title,
  issues,
}: {
  title: string
  issues: WorkspaceIssue[]
}) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h2 className="text-sm font-semibold">{title}</h2>

      {/* Mobile cards */}
      <div className="grid min-w-0 gap-3 md:hidden">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden p-0! md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 h-11 min-w-[320px] border-r border-b bg-muted px-4 text-left text-xs font-medium text-foreground">
                  Issues
                </th>
                <th className="h-11 min-w-32 border-r border-b bg-muted px-4 text-left text-xs font-medium text-foreground">
                  Status
                </th>
                <th className="h-11 min-w-28 border-r border-b bg-muted px-4 text-left text-xs font-medium text-foreground">
                  Priority
                </th>
                <th className="h-11 min-w-40 border-r border-b bg-muted px-4 text-left text-xs font-medium text-foreground">
                  Assignee
                </th>
                <th className="h-11 min-w-48 border-r border-b bg-muted px-4 text-left text-xs font-medium text-foreground">
                  Labels
                </th>
                <th className="h-11 min-w-36 border-b bg-muted px-4 text-left text-xs font-medium text-foreground">
                  Due date
                </th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <IssueTableRow key={issue.id} issue={issue} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}

function IssueCard({ issue }: { issue: WorkspaceIssue }) {
  return (
    <Card
      className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card"
      size="sm"
    >
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {issue.id}
          </span>
          <span className="truncate text-sm font-medium text-foreground">
            {issue.title}
          </span>
        </CardDescription>
        <CardAction>
          <button
            type="button"
            aria-label={`Open actions for ${issue.id}`}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-accent-foreground"
          >
            <IconDots className="size-4" aria-hidden="true" />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={issue.status} />
          <span className="inline-flex h-6 items-center gap-1 rounded-md border px-2 text-[10px] font-medium text-zinc-600 capitalize dark:text-zinc-400">
            <IconFlag className="size-3" aria-hidden="true" />
            {PRIORITY_META[issue.priority].label}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            {issue.assignee ? (
              <div className="inline-flex items-center gap-2">
                <span className="relative flex size-6 overflow-hidden rounded-full">
                  <img
                    src={issue.assignee.avatar}
                    alt={issue.assignee.name}
                    className="aspect-square h-full w-full"
                  />
                </span>
                <span className="truncate">{issue.assignee.name}</span>
              </div>
            ) : (
              <span>No owner</span>
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 tabular-nums">
            <IconCalendar className="size-3.5" aria-hidden="true" />
            {issue.dueDate}
          </div>
        </div>
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {issue.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                <IconTag className="size-3" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function IssueTableRow({ issue }: { issue: WorkspaceIssue }) {
  return (
    <tr className="group">
      <td className="sticky left-0 z-10 h-11 min-w-[320px] border-r border-b bg-card px-4 align-middle transition-colors group-hover:bg-muted">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {issue.id}
              </span>
              <span className="truncate text-xs font-medium text-foreground">
                {issue.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label={`Open actions for ${issue.id}`}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-accent-foreground"
          >
            <IconDots className="size-4" aria-hidden="true" />
          </button>
        </div>
      </td>
      <td className="h-11 border-r border-b px-4 align-middle text-xs whitespace-nowrap text-foreground/80 transition-colors group-hover:bg-muted/60">
        <StatusChip status={issue.status} />
      </td>
      <td className="h-11 border-r border-b px-4 align-middle text-xs whitespace-nowrap text-foreground/80 transition-colors group-hover:bg-muted/60">
        <div className="inline-flex items-center gap-2">
          <IconFlag
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span
            className={cn(
              "capitalize",
              PRIORITY_META[issue.priority].tableColor
            )}
          >
            {PRIORITY_META[issue.priority].label}
          </span>
        </div>
      </td>
      <td className="h-11 border-r border-b px-4 align-middle text-xs whitespace-nowrap text-foreground/80 transition-colors group-hover:bg-muted/60">
        {issue.assignee ? (
          <div className="inline-flex items-center gap-2">
            <span className="relative flex size-6 shrink-0 overflow-hidden rounded-full">
              <img
                src={issue.assignee.avatar}
                alt={issue.assignee.name}
                className="aspect-square h-full w-full"
              />
            </span>
            <span className="truncate text-xs">{issue.assignee.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">No owner</span>
        )}
      </td>
      <td className="h-11 border-r border-b px-4 align-middle text-xs whitespace-nowrap text-foreground/80 transition-colors group-hover:bg-muted/60">
        <div className="flex flex-nowrap gap-1.5">
          {issue.labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              <IconTag className="size-3" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </td>
      <td className="h-11 border-b px-4 align-middle text-xs whitespace-nowrap text-foreground/80 transition-colors group-hover:bg-muted/60">
        <div className="inline-flex items-center gap-2">
          <IconCalendar
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="font-normal tabular-nums">{issue.dueDate}</span>
        </div>
      </td>
    </tr>
  )
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function WorkspaceAside() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section className="min-w-0">
        <div
          className="relative h-[110px] sm:h-[132px] xl:h-[110px]"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(19, 78, 74, 0.42)), url("${WORKSPACE_USER.cover}")`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          <button
            type="button"
            aria-label="Edit profile"
            className="absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-[3px] bg-white text-black hover:bg-white/90"
          >
            <IconPencil className="size-3" aria-hidden="true" />
          </button>
          <span className="absolute -bottom-[26px] left-5 flex size-[52px] shrink-0 overflow-hidden rounded-full ring-2 ring-background">
            <img
              src={WORKSPACE_USER.avatar}
              alt={WORKSPACE_USER.name}
              className="aspect-square h-full w-full"
            />
          </span>
        </div>
        <div className="px-4 sm:px-5">
          <div className="mt-[38px]">
            <h3 className="text-[16px] leading-6 font-semibold">
              {WORKSPACE_USER.name}
            </h3>
            <p className="text-[13px] leading-5 text-muted-foreground">
              {WORKSPACE_USER.email}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-5 text-[13px] leading-5">
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-4">
              <div className="min-w-0 text-muted-foreground">Joined on</div>
              <div className="min-w-0 font-medium">
                {WORKSPACE_USER.joinedOn}
              </div>
            </div>
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-4">
              <div className="min-w-0 text-muted-foreground">Timezone</div>
              <div className="min-w-0 font-medium">
                {WORKSPACE_USER.timezone}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-9 flex min-h-0 flex-1 flex-col border-t border-border pb-5">
        <Tabs defaultValue="meetings" className="flex min-h-0 flex-1 flex-col">
          <TabsList
            variant="line"
            className="grid w-full min-w-0 shrink-0 grid-cols-3 rounded-none border-b bg-transparent p-0"
          >
            <TabsTrigger
              value="meetings"
              className="min-w-0 rounded-none border-b-2 border-transparent px-1 text-[12px] text-muted-foreground data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none"
            >
              Meetings
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="min-w-0 rounded-none border-b-2 border-transparent px-1 text-[12px] text-muted-foreground data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="focus"
              className="min-w-0 rounded-none border-b-2 border-transparent px-1 text-[12px] text-muted-foreground data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none"
            >
              Focus
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="meetings"
            className="mt-3 min-h-0 flex-1 overflow-y-auto px-4 sm:px-5"
          >
            <div className="flex flex-col gap-2.5">
              {MY_MEETINGS.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  title={meeting.title}
                  time={meeting.time}
                  attendees={meeting.attendees}
                  extraCount={meeting.extraCount}
                  category={meeting.category}
                  platform={meeting.platform}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="events"
            className="mt-3 min-h-0 flex-1 overflow-y-auto px-4 sm:px-5"
          >
            <p className="text-[13px] leading-5 text-muted-foreground">
              No events scheduled.
            </p>
          </TabsContent>
          <TabsContent
            value="focus"
            className="mt-3 min-h-0 flex-1 overflow-y-auto px-4 sm:px-5"
          >
            <p className="text-[13px] leading-5 text-muted-foreground">
              No focus time scheduled.
            </p>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

function MeetingCard({
  title,
  time,
  attendees,
  extraCount,
  category,
  platform,
}: {
  title: string
  time: string
  attendees: { name: string; avatar: string }[]
  extraCount: number
  category: keyof typeof MEETING_CATEGORY_META
  platform: string
}) {
  const categoryMeta = MEETING_CATEGORY_META[category]
  return (
    <div className="rounded-[8px] bg-muted p-3 text-[12px] leading-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-foreground">
            {title}
          </p>
          <p className="mt-1 text-muted-foreground">{time}</p>
        </div>
        <button
          type="button"
          aria-label={`Open ${title}`}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground hover:bg-background hover:text-accent-foreground"
        >
          <IconChevronDown className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {attendees.map((attendee) => (
              <span
                key={attendee.name}
                className="relative flex size-7 shrink-0 overflow-hidden rounded-full border-2 border-background"
              >
                <img
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="aspect-square h-full w-full"
                />
              </span>
            ))}
          </div>
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            +{extraCount}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-md border border-transparent px-2 py-0 text-[11px] font-medium",
            categoryMeta.chip
          )}
        >
          {categoryMeta.label}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-muted-foreground">
        <IconVideo className="size-3.5" aria-hidden="true" />
        <span>{platform}</span>
      </div>
    </div>
  )
}
