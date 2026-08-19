import {
  IconCalendarStats,
  IconCircleDashed,
  IconCircleCheck,
  IconClock,
  IconCube,
  IconFile,
  IconFiles,
  IconGauge,
  IconGitBranch,
  IconHistory,
  IconNote,
  IconPencil,
  IconStar,
  IconTag,
  IconUser,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react"
import * as React from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import {
  type Project,
  LABEL_META,
  PRIORITY_META,
  STATUS_META,
} from "@/lib/projects-data"
import { formatBytes } from "@/lib/files-data"
import { formatMonthDayYear } from "@/lib/date-utils"
import type { FileType } from "@/lib/files-data"

// ─── Header (title + label badges + meta chips) ──────────────────────────────

function LabelBadge({ project }: { project: Project }) {
  const meta = LABEL_META[project.label]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold ${meta.chip}`}
    >
      {meta.icon === "star" && <IconStar className="size-3" aria-hidden="true" />}
      {meta.icon === "users" && (
        <IconUsers className="size-3" aria-hidden="true" />
      )}
      {meta.icon === "git_branch" && (
        <IconGitBranch className="size-3" aria-hidden="true" />
      )}
      {meta.label}
    </span>
  )
}

function MetaChip({
  icon,
  label,
  value,
  withSeparator,
}: {
  icon: React.ReactNode
  label?: string
  value: string
  withSeparator?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-full border border-border/70 bg-muted/25 px-2.5 py-1.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
      <div className="text-muted-foreground flex min-w-0 items-center gap-2">
        {icon}
        {label && <span className="text-muted-foreground">{label}</span>}
        <span className="text-foreground min-w-0 truncate font-medium">
          {value}
        </span>
      </div>
      {withSeparator && (
        <Separator
          orientation="vertical"
          className="hidden h-4 w-px shrink-0 sm:block"
        />
      )}
    </div>
  )
}

export function ProjectDetailHeader({ project }: { project: Project }) {
  const priorityMeta = PRIORITY_META[project.priority]
  return (
    <section className="mt-4 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl leading-tight font-semibold text-foreground">
            {project.name}
          </h1>
          <div className="flex items-center gap-2">
            <LabelBadge project={project} />
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold ${priorityMeta.chip}`}
            >
              <IconUsers className="size-3" aria-hidden="true" />
              {project.contributorsTotal} contributors
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border-none bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              <IconGitBranch className="size-3" aria-hidden="true" />
              {LABEL_META[project.label].label}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <IconPencil className="size-4" aria-hidden="true" />
          Edit
        </Button>
      </div>

      <div className="mt-3">
        <div className="flex max-w-full flex-wrap items-center gap-2 text-xs">
          <MetaChip
            icon={
              <span className="text-muted-foreground">Code:</span>
            }
            value={project.code}
            withSeparator
          />
          <MetaChip
            icon={<PriorityBars priority={project.priority} />}
            value={priorityMeta.label}
            withSeparator
          />
          <MetaChip
            icon={<IconWorld className="size-4" aria-hidden="true" />}
            value={project.region}
            withSeparator
          />
          <MetaChip
            icon={<IconClock className="size-4" aria-hidden="true" />}
            label="Cycle:"
            value={project.cycle}
            withSeparator
          />
          <MetaChip
            icon={<IconHistory className="size-4" aria-hidden="true" />}
            label="Updated:"
            value={project.updatedAt}
          />
        </div>
      </div>
    </section>
  )
}

function PriorityBars({ priority }: { priority: Project["priority"] }) {
  const meta = PRIORITY_META[priority]
  return (
    <span className="flex items-end gap-0.5" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`w-0.5 rounded-full ${
            i < meta.bars ? "bg-foreground" : "bg-muted-foreground/30"
          }`}
          style={{ height: `${4 + i * 2}px` }}
        />
      ))}
    </span>
  )
}

// ─── Stats grid ───────────────────────────────────────────────────────────────

function StatCell({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="min-w-0 border-b border-border/70 p-3.5 even:border-l sm:p-4 xl:border-b-0 xl:border-l xl:first:border-l-0 [&:nth-last-child(-n+2)]:border-b-0">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-muted-foreground min-w-0 truncate text-xs font-medium">
          {label}
        </p>
      </div>
      <div className="mt-2 flex min-w-0 flex-col gap-1 xl:flex-row xl:items-end xl:justify-between xl:gap-3">
        <p className="min-w-0 truncate text-lg font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="text-muted-foreground min-w-0 truncate text-xs xl:shrink-0">
          {sub}
        </p>
      </div>
    </div>
  )
}

export function ProjectDetailStats({ project }: { project: Project }) {
  return (
    <section className="grid grid-cols-2 overflow-hidden rounded-lg border-y border-border bg-muted/20 xl:grid-cols-4 xl:rounded-lg xl:border">
      <StatCell
        icon={<IconGauge className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />}
        label="Timeline health"
        value={`${project.timelineHealth}%`}
        sub={`${project.daysLeft} days left`}
      />
      <StatCell
        icon={<IconCalendarStats className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />}
        label="Due date"
        value={formatMonthDayYear(new Date(project.dueDate))}
        sub={project.estimate}
      />
      <StatCell
        icon={<IconCircleCheck className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />}
        label="Tasks closed"
        value={`${project.tasksClosed}/${project.tasksTotal}`}
        sub={`${project.tasksTotal - project.tasksClosed} open tasks`}
      />
      <StatCell
        icon={<IconFiles className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />}
        label="Project files"
        value={String(project.files.length)}
        sub={`${project.quickLinks} quick links`}
      />
    </section>
  )
}

// ─── Project files grid ───────────────────────────────────────────────────────

function getFileIcon(type: FileType) {
  switch (type) {
    case "pdf":
      return <IconFile className="size-8 text-rose-500" aria-hidden="true" />
    case "image":
      return <IconFile className="size-8 text-amber-500" aria-hidden="true" />
    case "doc":
      return <IconFile className="size-8 text-indigo-500" aria-hidden="true" />
    case "spreadsheet":
      return <IconFile className="size-8 text-emerald-500" aria-hidden="true" />
    default:
      return <IconFile className="size-8 text-muted-foreground" aria-hidden="true" />
  }
}

export function ProjectDetailFiles({ project }: { project: Project }) {
  if (project.files.length === 0) {
    return null
  }
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Project files
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {project.files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="flex min-w-0 items-start gap-2">
              <div className="flex size-11 shrink-0 items-center justify-center">
                {getFileIcon(file.type)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatBytes(file.size)}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label={`Open actions for ${file.name}`}
              type="button"
            >
              <IconFile className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Meta panel (right sidebar) ───────────────────────────────────────────────

function MetaRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-muted-foreground flex w-30 shrink-0 items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 text-left text-sm font-medium text-foreground">
        <div className="px-2">{children}</div>
      </div>
    </div>
  )
}

export function ProjectMetaPanel({ project }: { project: Project }) {
  const statusMeta = STATUS_META[project.status]
  return (
    <div className="flex min-h-0 w-full min-w-0 shrink-0 flex-col overflow-hidden xl:w-[340px] xl:border-l xl:border-border xl:bg-card">
      <div className="flex min-h-0 flex-1 flex-col divide-y divide-border overflow-y-auto px-5">
        <section className="py-6">
          <div className="pb-5">
            <div className="text-sm font-semibold">Project status</div>
          </div>
          <div className="space-y-5">
            <MetaRow
              icon={<IconCircleDashed className="size-4" aria-hidden="true" />}
              label="Status"
            >
              <Badge
                variant="outline"
                className={`ring-1 ${statusMeta.chip}`}
              >
                {statusMeta.label}
              </Badge>
            </MetaRow>
            <MetaRow
              icon={<IconCube className="size-4" aria-hidden="true" />}
              label="Group"
            >
              <span>None</span>
            </MetaRow>
            <MetaRow
              icon={<PriorityBarsSmall priority={project.priority} />}
              label="Priority"
            >
              <span>{PRIORITY_META[project.priority].label}</span>
            </MetaRow>
            <MetaRow
              icon={<IconTag className="size-4" aria-hidden="true" />}
              label="Label"
            >
              <Badge variant="secondary">
                {LABEL_META[project.label].label}
              </Badge>
            </MetaRow>
            <MetaRow
              icon={<IconUser className="size-4" aria-hidden="true" />}
              label="PIC"
            >
              <AvatarGroup>
                {project.pic.map((p) => (
                  <Avatar key={p.initials} size="sm">
                    <AvatarFallback>{p.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
            </MetaRow>
            <MetaRow
              icon={<IconUsers className="size-4" aria-hidden="true" />}
              label="Support"
            >
              {project.support.length > 0 ? (
                <AvatarGroup>
                  {project.support.map((p) => (
                    <Avatar key={p.initials} size="sm">
                      <AvatarFallback>{p.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              ) : (
                <span>—</span>
              )}
            </MetaRow>
          </div>
        </section>

        <section className="py-6">
          <div className="mb-5 flex items-baseline gap-2">
            <h2 className="text-sm font-semibold">Contributors</h2>
            <span className="text-xs text-muted-foreground">
              {project.contributorsTotal}
            </span>
          </div>
          {project.contributors.length > 0 ? (
            <div className="grid grid-cols-6 gap-2">
              {project.contributors.slice(0, 8).map((c) => (
                <Avatar key={c.initials}>
                  <AvatarFallback>{c.initials}</AvatarFallback>
                </Avatar>
              ))}
              {project.contributorsTotal > project.contributors.length && (
                <AvatarGroupCount>
                  +{project.contributorsTotal - project.contributors.length}
                </AvatarGroupCount>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No contributors</p>
          )}
        </section>

        <section className="py-6">
          <div className="pb-5">
            <div className="text-sm font-semibold">Schedule</div>
          </div>
          <div className="space-y-5">
            <MetaRow
              icon={<IconClock className="size-4" aria-hidden="true" />}
              label="Estimate"
            >
              <span>{project.estimate}</span>
            </MetaRow>
            <MetaRow
              icon={<IconCalendarStats className="size-4" aria-hidden="true" />}
              label="Due Date"
            >
              <span>{formatMonthDayYear(new Date(project.dueDate))}</span>
            </MetaRow>
          </div>
        </section>

        <section className="py-6">
          <div className="pb-5">
            <div className="text-sm font-semibold">Notes</div>
          </div>
          <div className="space-y-4">
            {project.notes.map((note) => (
              <div key={note.id} className="flex min-w-0 items-start gap-3">
                <div className="text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border">
                  {note.icon === "waves" ? (
                    <IconNote className="size-3.5" aria-hidden="true" />
                  ) : (
                    <IconFile className="size-3.5" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-medium">
                      {note.title}
                    </p>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {note.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-5">
                    {note.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function PriorityBarsSmall({ priority }: { priority: Project["priority"] }) {
  const meta = PRIORITY_META[priority]
  return (
    <span className="flex items-end gap-0.5" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`w-0.5 rounded-full ${
            i < meta.bars ? "bg-foreground" : "bg-muted-foreground/30"
          }`}
          style={{ height: `${4 + i * 2}px` }}
        />
      ))}
    </span>
  )
}
