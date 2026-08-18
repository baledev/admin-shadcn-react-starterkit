import * as React from "react"
import {
  DndContext,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  addDays,
  formatDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "@/lib/date-utils"
import { cn } from "@workspace/ui/lib/utils"
import {
  CATEGORY_META,
  toIso,
  type CalendarActivity,
} from "@/lib/calendar-data"
import {
  ActivityChipContent,
  DraggableActivityChip,
} from "./activity-chip"

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MAX_VISIBLE = 2

type MonthViewProps = {
  anchorDate: Date
  activities: CalendarActivity[]
  onSelectActivity: (activity: CalendarActivity) => void
  onMoveActivity: (id: string, patch: Partial<CalendarActivity>) => void
  onAddAt: (date: Date) => void
}

export function CalendarMonthView({
  anchorDate,
  activities,
  onSelectActivity,
  onMoveActivity,
  onAddAt,
}: MonthViewProps) {
  const [activeActivity, setActiveActivity] =
    React.useState<CalendarActivity | null>(null)

  const monthStart = startOfMonth(anchorDate)
  const gridStart = startOfWeek(monthStart)
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))

  const byDate = new Map<string, CalendarActivity[]>()
  for (const activity of activities) {
    const list = byDate.get(activity.date) ?? []
    list.push(activity)
    byDate.set(activity.date, list)
  }

  function handleDragStart(event: DragStartEvent) {
    const activity = event.active.data.current?.activity as
      | CalendarActivity
      | undefined
    setActiveActivity(activity ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveActivity(null)
    const activity = event.active.data.current?.activity as
      | CalendarActivity
      | undefined
    const date = event.over?.data.current?.date as Date | undefined
    if (activity && date) {
      onMoveActivity(activity.id, { date: toIso(date) })
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveActivity(null)}
    >
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="bg-background px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
        {cells.map((day) => {
          const dayActivities = byDate.get(toIso(day)) ?? []
          return (
            <MonthDayCell
              key={toIso(day)}
              day={day}
              inMonth={isSameMonth(day, monthStart)}
              activities={dayActivities.slice(0, MAX_VISIBLE)}
              hiddenCount={Math.max(
                0,
                dayActivities.length - MAX_VISIBLE
              )}
              onSelectActivity={onSelectActivity}
              onAddAt={onAddAt}
            />
          )
        })}
      </div>
      <DragOverlay>
        {activeActivity ? (
          <div className="w-40 shadow-md">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] font-medium ring-1",
                CATEGORY_META[activeActivity.category].chip
              )}
            >
              <ActivityChipContent activity={activeActivity} />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function MonthDayCell({
  day,
  inMonth,
  activities,
  hiddenCount,
  onSelectActivity,
  onAddAt,
}: {
  day: Date
  inMonth: boolean
  activities: CalendarActivity[]
  hiddenCount: number
  onSelectActivity: (activity: CalendarActivity) => void
  onAddAt: (date: Date) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `month-day-${toIso(day)}`,
    data: { date: day },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={() => onAddAt(day)}
      className={cn(
        "flex min-h-20 cursor-pointer flex-col gap-1 bg-background p-1.5 transition-colors",
        isOver && "bg-muted/60",
        !inMonth && "bg-muted/30",
        isToday(day) && "bg-muted/50"
      )}
    >
      <span
        className={cn(
          "self-end text-[11px] tabular-nums",
          isToday(day)
            ? "flex size-5 items-center justify-center rounded-full bg-foreground font-semibold text-background"
            : inMonth
              ? "text-muted-foreground"
              : "text-muted-foreground/50"
        )}
      >
        {formatDay(day)}
      </span>
      <div className="flex flex-col gap-1">
        {activities.map((activity) => (
          <DraggableActivityChip
            key={activity.id}
            activity={activity}
            onSelect={onSelectActivity}
          />
        ))}
        {hiddenCount > 0 && (
          <span className="px-1.5 text-[10px] text-muted-foreground">
            +{hiddenCount} more
          </span>
        )}
      </div>
    </div>
  )
}