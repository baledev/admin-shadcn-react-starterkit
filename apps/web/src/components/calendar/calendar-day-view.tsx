import * as React from "react"
import {
  DndContext,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  formatWeekdayMonthDay,
  hourLabel,
  isToday,
  toHHmm,
} from "@/lib/date-utils"
import { cn } from "@workspace/ui/lib/utils"
import {
  activitiesOnDate,
  CATEGORY_META,
  type CalendarActivity,
} from "@/lib/calendar-data"
import { ActivityChipContent, DraggableActivityChip } from "./activity-chip"

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 08:00 - 20:00

type DayViewProps = {
  anchorDate: Date
  activities: CalendarActivity[]
  onSelectActivity: (activity: CalendarActivity) => void
  onMoveActivity: (id: string, patch: Partial<CalendarActivity>) => void
}

function startHour(activity: CalendarActivity) {
  return parseInt(activity.start.split(":")[0], 10)
}

export function CalendarDayView({
  anchorDate,
  activities,
  onSelectActivity,
  onMoveActivity,
}: DayViewProps) {
  const dayActivities = activitiesOnDate(activities, anchorDate)

  const byHour = new Map<number, CalendarActivity[]>()
  for (const activity of dayActivities) {
    const hour = startHour(activity)
    const list = byHour.get(hour) ?? []
    list.push(activity)
    byHour.set(hour, list)
  }

  const [activeActivity, setActiveActivity] =
    React.useState<CalendarActivity | null>(null)

  function handleDragStart(event: DragStartEvent) {
    const activity = event.active.data.current?.activity as
      CalendarActivity | undefined
    setActiveActivity(activity ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveActivity(null)
    const activity = event.active.data.current?.activity as
      CalendarActivity | undefined
    const hour = event.over?.data.current?.hour as number | undefined
    if (activity && hour !== undefined) {
      onMoveActivity(activity.id, {
        start: toHHmm(new Date(2000, 0, 1, hour)),
        end: toHHmm(new Date(2000, 0, 1, hour + 1)),
      })
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveActivity(null)}
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
          <span className="text-sm font-semibold">
            {formatWeekdayMonthDay(anchorDate)}
          </span>
          {isToday(anchorDate) && (
            <span className="text-[11px] font-medium text-muted-foreground">
              Today
            </span>
          )}
        </div>
        <div className="flex flex-col">
          {HOURS.map((hour) => (
            <HourBand
              key={hour}
              hour={hour}
              activities={byHour.get(hour) ?? []}
              onSelectActivity={onSelectActivity}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeActivity ? (
          <div className="w-48 shadow-md">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] font-medium ring-1",
                CATEGORY_META[activeActivity.category].chip
              )}
            >
              <ActivityChipContent activity={activeActivity} showTime />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function HourBand({
  hour,
  activities,
  onSelectActivity,
}: {
  hour: number
  activities: CalendarActivity[]
  onSelectActivity: (activity: CalendarActivity) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-hour-${hour}`,
    data: { hour },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-14 items-stretch gap-3 border-b border-border transition-colors last:border-b-0",
        isOver && "bg-muted/60"
      )}
    >
      <span className="w-14 shrink-0 border-r border-border py-1.5 pr-2 text-right text-[11px] text-muted-foreground tabular-nums">
        {hourLabel(hour)}
      </span>
      <div className="flex flex-1 flex-col gap-1 py-1.5 pr-2">
        {activities.map((activity) => (
          <DraggableActivityChip
            key={activity.id}
            activity={activity}
            showTime
            onSelect={onSelectActivity}
          />
        ))}
      </div>
    </div>
  )
}
