import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { type Project, type TaskStatus } from "@/lib/projects-data"
import { formatMonthDayYear } from "@/lib/date-utils"

const TASK_STATUS_META: Record<TaskStatus, { label: string; chip: string }> = {
  todo: {
    label: "To Do",
    chip: "bg-muted text-muted-foreground ring-border",
  },
  in_progress: {
    label: "In Progress",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
  },
  done: {
    label: "Done",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
}

export function ProjectTasksTab({ project }: { project: Project }) {
  const [tasks, setTasks] = React.useState(project.tasks)

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t
      )
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <IconCheck
          className="size-12 text-muted-foreground/50"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first task to start tracking work.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {tasks.map((task) => {
        const meta = TASK_STATUS_META[task.status]
        const isDone = task.status === "done"
        return (
          <div key={task.id} className="flex items-center gap-3 py-3">
            <Checkbox
              checked={isDone}
              onCheckedChange={() => toggle(task.id)}
              aria-label={`Mark ${task.title} as ${isDone ? "not done" : "done"}`}
            />
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-medium ${
                  isDone ? "text-muted-foreground line-through" : ""
                }`}
              >
                {task.title}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {formatMonthDayYear(new Date(task.due))}
                </span>
              </div>
            </div>
            <Badge variant="outline" className={`ring-1 ${meta.chip}`}>
              {meta.label}
            </Badge>
            <Avatar size="sm">
              <AvatarFallback>{task.assigneeInitials}</AvatarFallback>
            </Avatar>
          </div>
        )
      })}
    </div>
  )
}

// ─── Issues tab ───────────────────────────────────────────────────────────────

export function ProjectIssuesTab({ project }: { project: Project }) {
  if (project.issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <IconCheck
          className="size-12 text-muted-foreground/50"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium">No issues tracked</p>
          <p className="text-sm text-muted-foreground">
            Issues will appear here once added to the timeline.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {project.issues.map((issue) => {
        const duration =
          Math.round(
            (new Date(issue.endDate).getTime() -
              new Date(issue.startDate).getTime()) /
              86_400_000
          ) + 1
        return (
          <div key={issue.id} className="flex items-center gap-3 py-3">
            <span
              className={`size-2 shrink-0 rounded-full ${
                issue.color === "amber"
                  ? "bg-amber-400/90"
                  : issue.color === "cyan"
                    ? "bg-cyan-400/90"
                    : issue.color === "fuchsia"
                      ? "bg-fuchsia-400/90"
                      : issue.color === "indigo"
                        ? "bg-indigo-400/90"
                        : "bg-zinc-400/80"
              }`}
              aria-hidden="true"
            />
            <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
              {issue.id}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{issue.title}</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatMonthDayYear(new Date(issue.startDate))} →{" "}
                {formatMonthDayYear(new Date(issue.endDate))}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {duration > 1 ? `${duration} days` : "1 day"}
            </span>
            {issue.dependencies.length > 0 && (
              <span className="shrink-0 text-xs text-muted-foreground">
                ← {issue.dependencies.join(", ")}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Activity tab ─────────────────────────────────────────────────────────────

export function ProjectActivityTab({ project }: { project: Project }) {
  if (project.activity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <IconCheck
          className="size-12 text-muted-foreground/50"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium">No activity yet</p>
          <p className="text-sm text-muted-foreground">
            Updates will appear here as the project progresses.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-6">
      {project.activity.map((item, i) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <Avatar size="sm">
              <AvatarFallback>{item.initials}</AvatarFallback>
            </Avatar>
            {i < project.activity.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className="min-w-0 flex-1 pb-2">
            <p className="text-sm">
              <span className="font-medium">{item.user}</span>{" "}
              <span className="text-muted-foreground">{item.action}</span>{" "}
              <span className="font-medium">{item.target}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.at}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
