import * as React from "react"
import { IconPlus } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  type Project,
  type ProjectIssue,
  GANTT_COLOR_META,
} from "@/lib/projects-data"
import { addDays, startOfWeek, toIsoDate } from "@/lib/date-utils"
import {
  type DragMode,
  type DragState,
  DAY_WIDTH,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  buildWeeks,
  clampRange,
  dateToPx,
  dayDiff,
  snapDeltaPx,
} from "@/lib/gantt-utils"

const NUM_WEEKS = 9
const ROW_LABEL_WIDTH = 300
const WEEK_WIDTH = DAY_WIDTH * 7
const BODY_PADDING_Y = 6

function computeViewportStart(issues: ProjectIssue[]): Date {
  if (issues.length === 0) {
    return addDays(startOfWeek(new Date()), -7)
  }
  const earliest = issues.reduce((min, i) => {
    const d = new Date(i.startDate)
    return d < min ? d : min
  }, new Date(issues[0].startDate))
  return addDays(startOfWeek(earliest), -7)
}

function getDuration(issue: ProjectIssue): number {
  return dayDiff(new Date(issue.startDate), new Date(issue.endDate)) + 1
}

export function ProjectTimelineGantt({ project }: { project: Project }) {
  const viewportStart = React.useMemo(
    () => computeViewportStart(project.issues),
    [project.issues]
  )
  const [issues, setIssues] = React.useState<ProjectIssue[]>(project.issues)
  const [drag, setDrag] = React.useState<DragState | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const totalWidth = NUM_WEEKS * WEEK_WIDTH

  const weeks = React.useMemo(
    () => buildWeeks(viewportStart, NUM_WEEKS),
    [viewportStart]
  )

  // Auto-scroll to first issue on mount.
  React.useEffect(() => {
    if (!scrollRef.current || issues.length === 0) return
    const first = issues[0]
    const px = dateToPx(new Date(first.startDate), viewportStart)
    scrollRef.current.scrollLeft = Math.max(0, px - DAY_WIDTH * 3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function commitDrag(issueId: string, start: Date, end: Date) {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? { ...i, startDate: toIsoDate(start), endDate: toIsoDate(end) }
          : i
      )
    )
  }

  function handlePointerDownIssue(
    e: React.PointerEvent,
    issue: ProjectIssue,
    mode: DragMode
  ) {
    e.preventDefault()
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setDrag({
      issueId: issue.id,
      mode,
      startX: e.clientX,
      originalStart: new Date(issue.startDate),
      originalEnd: new Date(issue.endDate),
    })
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drag) return
    const deltaPx = e.clientX - drag.startX
    const deltaDays = Math.round(snapDeltaPx(deltaPx) / DAY_WIDTH)
    if (deltaDays === 0) return
    let newStart = new Date(drag.originalStart)
    let newEnd = new Date(drag.originalEnd)
    if (drag.mode === "move") {
      newStart = addDays(drag.originalStart, deltaDays)
      newEnd = addDays(drag.originalEnd, deltaDays)
    } else if (drag.mode === "resize-start") {
      newStart = addDays(drag.originalStart, deltaDays)
    } else if (drag.mode === "resize-end") {
      newEnd = addDays(drag.originalEnd, deltaDays)
    }
    const clamped = clampRange(newStart, newEnd, 1)
    // Live update state for visual feedback.
    setIssues((prev) =>
      prev.map((i) =>
        i.id === drag.issueId
          ? {
              ...i,
              startDate: toIsoDate(clamped.start),
              endDate: toIsoDate(clamped.end),
            }
          : i
      )
    )
  }

  function handlePointerUp() {
    if (!drag) return
    const issue = issues.find((i) => i.id === drag.issueId)
    if (issue) {
      commitDrag(drag.issueId, new Date(issue.startDate), new Date(issue.endDate))
    }
    setDrag(null)
  }

  function handleKeyDown(
    e: React.KeyboardEvent,
    issue: ProjectIssue
  ) {
    const step = e.shiftKey ? 7 : 1
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
    e.preventDefault()
    const dir = e.key === "ArrowLeft" ? -step : step
    const start = addDays(new Date(issue.startDate), dir)
    const end = addDays(new Date(issue.endDate), dir)
    commitDrag(issue.id, start, end)
  }

  if (issues.length === 0) {
    return (
      <section className="flex h-[400px] items-center justify-center border-y border-border text-center">
        <div className="flex flex-col items-center gap-3">
          <IconPlus className="size-12 text-muted-foreground/50" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">No issues on the timeline</p>
            <p className="text-sm text-muted-foreground">
              Add an issue to start planning.
            </p>
          </div>
          <Button size="sm">
            <IconPlus className="size-4" aria-hidden="true" />
            New issue
          </Button>
        </div>
      </section>
    )
  }

  const bodyHeight = Math.max(issues.length * ROW_HEIGHT, 200)

  return (
    <section className="h-[560px] overflow-hidden border-y border-border">
      <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-auto"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="flex min-h-full w-max min-w-full">
            {/* Row labels (sticky left) */}
            <aside
              className="sticky left-0 z-20 shrink-0 border-r border-border bg-background sm:sticky"
              style={{ width: ROW_LABEL_WIDTH }}
            >
              <div
                className="sticky top-0 z-30 border-b border-border bg-background px-4 pb-2"
                style={{ height: HEADER_HEIGHT }}
              >
                <div className="flex h-full items-end justify-between text-[13px] font-medium text-muted-foreground">
                  <span>Issues</span>
                  <span>Duration</span>
                </div>
              </div>
              <div className="bg-background">
                {issues.map((issue) => {
                  const duration = getDuration(issue)
                  const colorMeta = GANTT_COLOR_META[issue.color]
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-4 text-left transition-colors hover:bg-muted/40"
                      style={{ height: ROW_HEIGHT }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 shrink-0 rounded-full ${colorMeta.dot}`}
                            aria-hidden="true"
                          />
                          <span className="shrink-0 text-[12px] text-muted-foreground">
                            {issue.id}
                          </span>
                          <span className="truncate text-[13px] font-medium">
                            {issue.title}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                        {duration > 1 ? `${duration} days` : duration === 1 ? "1 day" : ""}
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* Date columns + bars */}
            <section className="relative">
              {/* Header: weeks + days */}
              <div
                className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm"
                style={{ width: totalWidth, height: HEADER_HEIGHT }}
              >
                <div className="flex h-full">
                  {weeks.map((week) => (
                    <div
                      key={week.iso}
                      className="flex shrink-0 flex-col border-r border-border/60"
                      style={{ width: WEEK_WIDTH }}
                    >
                      <div className="flex h-7 items-center justify-between border-b border-border/60 px-3">
                        <div className="whitespace-nowrap text-[13px] font-normal text-muted-foreground">
                          {week.monthLabel}
                        </div>
                        <div className="whitespace-nowrap text-[10px] font-medium text-muted-foreground/80">
                          {week.weekLabel}
                        </div>
                      </div>
                      <div className="flex h-5">
                        {week.days.map((day) => (
                          <div
                            key={day.iso}
                            className={`flex shrink-0 items-center justify-between border-r border-border/60 px-2 text-[11px] ${
                              day.isWeekend ? "bg-muted/35" : ""
                            } ${
                              day.isToday
                                ? "bg-primary/5"
                                : ""
                            }`}
                            style={{ width: DAY_WIDTH }}
                          >
                            <span className="font-medium text-muted-foreground">
                              {day.weekday}
                            </span>
                            <span
                              className={`font-medium ${
                                day.isToday
                                  ? "rounded-sm border border-primary/12 bg-primary/10 px-1 text-foreground"
                                  : ""
                              }`}
                            >
                              {day.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body: grid stripes + bars */}
              <div
                className="relative"
                style={{
                  width: totalWidth,
                  height: bodyHeight,
                  backgroundImage:
                    "linear-gradient(to right, color-mix(in oklab, var(--border) 85%, transparent) 1px, transparent 1px)",
                  backgroundSize: `${DAY_WIDTH}px 100%`,
                }}
              >
                {/* Weekend + today column overlays */}
                {weeks.flatMap((week) =>
                  week.days.map((day) => {
                    const left = dateToPx(day.date, viewportStart)
                    return (
                      <div
                        key={day.iso}
                        className={`pointer-events-none absolute top-0 h-full ${
                          day.isWeekend ? "bg-muted/25" : ""
                        } ${
                          day.isToday
                            ? "border-x border-primary/12 bg-primary/4"
                            : ""
                        }`}
                        style={{ left, width: DAY_WIDTH }}
                      />
                    )
                  })
                )}

                {/* Dependency arrows (SVG overlay) */}
                <DependencyArrows
                  issues={issues}
                  viewportStart={viewportStart}
                  bodyHeight={bodyHeight}
                />

                {/* Issue bars */}
                {issues.map((issue, index) => {
                  const left = dateToPx(new Date(issue.startDate), viewportStart)
                  const width = Math.max(
                    DAY_WIDTH,
                    getDuration(issue) * DAY_WIDTH
                  )
                  const top = index * ROW_HEIGHT + BODY_PADDING_Y
                  const colorMeta = GANTT_COLOR_META[issue.color]
                  const isDragging = drag?.issueId === issue.id
                  return (
                    <div
                      key={issue.id}
                      className="group absolute px-1"
                      style={{ top, left, width }}
                    >
                      <div
                        className={`group relative flex h-[34px] items-center overflow-hidden rounded-md border ${colorMeta.bar} ${
                          isDragging ? "ring-2 ring-ring/50" : ""
                        }`}
                      >
                        {/* Resize start handle */}
                        <button
                          type="button"
                          aria-label={`Resize ${issue.title} from start`}
                          className="absolute top-0 left-0 h-full w-2 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100"
                          onPointerDown={(e) =>
                            handlePointerDownIssue(e, issue, "resize-start")
                          }
                          onKeyDown={(e) => handleKeyDown(e, issue)}
                          tabIndex={0}
                        />
                        {/* Move handle */}
                        <button
                          type="button"
                          aria-label={`Move ${issue.title}`}
                          className="flex h-full w-full cursor-grab items-center px-2.5 text-left active:cursor-grabbing"
                          onPointerDown={(e) =>
                            handlePointerDownIssue(e, issue, "move")
                          }
                          onKeyDown={(e) => handleKeyDown(e, issue)}
                          tabIndex={0}
                        >
                          <span className="truncate text-[13px] leading-none font-medium">
                            {issue.title}
                          </span>
                        </button>
                        {/* Resize end handle */}
                        <button
                          type="button"
                          aria-label={`Resize ${issue.title} from end`}
                          className="absolute top-0 right-0 h-full w-2 cursor-ew-resize opacity-0 transition-opacity group-hover:opacity-100"
                          onPointerDown={(e) =>
                            handlePointerDownIssue(e, issue, "resize-end")
                          }
                          onKeyDown={(e) => handleKeyDown(e, issue)}
                          tabIndex={0}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-[1] border-t border-border bg-background">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/40"
          >
            <IconPlus className="size-3.5" aria-hidden="true" />
            New issue
          </button>
        </div>
      </main>
    </section>
  )
}

// ─── Dependency arrows ────────────────────────────────────────────────────────

function DependencyArrows({
  issues,
  viewportStart,
  bodyHeight,
}: {
  issues: ProjectIssue[]
  viewportStart: Date
  bodyHeight: number
}) {
  const arrows: React.ReactNode[] = []

  issues.forEach((target, targetIndex) => {
    target.dependencies.forEach((depId) => {
      const source = issues.find((i) => i.id === depId)
      if (!source) return
      const sourceEndX =
        dateToPx(new Date(source.endDate), viewportStart) + DAY_WIDTH
      const targetStartX = dateToPx(
        new Date(target.startDate),
        viewportStart
      )
      const sourceY = issues.indexOf(source) * ROW_HEIGHT + ROW_HEIGHT / 2
      const targetY = targetIndex * ROW_HEIGHT + ROW_HEIGHT / 2
      if (targetStartX <= sourceEndX) return
      const midX = sourceEndX + (targetStartX - sourceEndX) / 2
      const path = `M ${sourceEndX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetStartX - 4} ${targetY}`
      arrows.push(
        <g key={`${source.id}-${target.id}`}>
          <path
            d={path}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeOpacity={0.5}
            strokeWidth={1.5}
          />
          <path
            d={`M ${targetStartX - 4} ${targetY} l 4 -3 l 0 6 z`}
            fill="var(--muted-foreground)"
            fillOpacity={0.5}
          />
        </g>
      )
    })
  })

  if (arrows.length === 0) return null
  return (
    <svg
      className="pointer-events-none absolute top-0 left-0"
      width={totalWidthSvg(issues, viewportStart)}
      height={bodyHeight}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      {arrows}
    </svg>
  )
}

function totalWidthSvg(issues: ProjectIssue[], viewportStart: Date): number {
  if (issues.length === 0) return NUM_WEEKS * WEEK_WIDTH
  const maxEnd = issues.reduce((max, i) => {
    const x = dateToPx(new Date(i.endDate), viewportStart) + DAY_WIDTH
    return x > max ? x : max
  }, 0)
  return Math.max(NUM_WEEKS * WEEK_WIDTH, maxEnd + DAY_WIDTH)
}
