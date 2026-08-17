import { DndContext, useDroppable, type DragEndEvent } from "@dnd-kit/core"
import { addDays, format, isToday, startOfWeek } from "date-fns"
import { cn } from "@workspace/ui/lib/utils"
import {
  activitiesOnDate,
  toIso,
  type CalendarActivity,
} from "@/lib/calendar-data"
import { DraggableActivityChip } from "./activity-chip"

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type WeekViewProps = {
  anchorDate: Date
  activities: CalendarActivity[]
  onSelectActivity: (activity: CalendarActivity) => void
  onMoveActivity: (id: string, patch: Partial<CalendarActivity>) => void
  onAddAt: (date: Date) => void
}

export function CalendarWeekView({
  anchorDate,
  activities,
  onSelectActivity,
  onMoveActivity,
  onAddAt,
}: WeekViewProps) {
  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  function handleDragEnd(event: DragEndEvent) {
    const activity = event.active.data.current?.activity as
      | CalendarActivity
      | undefined
    const date = event.over?.data.current?.date as Date | undefined
    if (activity && date) {
      onMoveActivity(activity.id, { date: toIso(date) })
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {days.map((day, index) => (
          <WeekDayColumn
            key={toIso(day)}
            day={day}
            label={WEEKDAY_LABELS[index]}
            activities={activitiesOnDate(activities, day)}
            onSelectActivity={onSelectActivity}
            onAddAt={onAddAt}
          />
        ))}
      </div>
    </DndContext>
  )
}

function WeekDayColumn({
  day,
  label,
  activities,
  onSelectActivity,
  onAddAt,
}: {
  day: Date
  label: string
  activities: CalendarActivity[]
  onSelectActivity: (activity: CalendarActivity) => void
  onAddAt: (date: Date) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `week-col-${toIso(day)}`,
    data: { date: day },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={() => onAddAt(day)}
      className={cn(
        "flex min-h-72 cursor-pointer flex-col gap-1 bg-background p-1.5 transition-colors",
        isOver && "bg-muted/60"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-md py-1.5",
          isToday(day) && "bg-foreground text-background"
        )}
      >
        <span className="text-[10px] font-medium text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums">
          {format(day, "d")}
        </span>
      </div>
      <div className="flex flex-col gap-1">
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