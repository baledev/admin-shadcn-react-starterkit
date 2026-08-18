import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@workspace/ui/lib/utils"
import { CATEGORY_META, type CalendarActivity } from "@/lib/calendar-data"

export function ActivityChipContent({
  activity,
  showTime = false,
}: {
  activity: CalendarActivity
  showTime?: boolean
}) {
  return (
    <>
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          CATEGORY_META[activity.category].dot
        )}
        aria-hidden="true"
      />
      {showTime && (
        <span className="tabular-nums opacity-70">{activity.start}</span>
      )}
      <span className="truncate">{activity.title}</span>
    </>
  )
}

export function DraggableActivityChip({
  activity,
  onSelect,
  className,
  showTime = false,
}: {
  activity: CalendarActivity
  onSelect: (activity: CalendarActivity) => void
  className?: string
  showTime?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `activity-${activity.id}`,
      data: { activity },
    })

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        visibility: isDragging ? "hidden" : undefined,
      }}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(activity)
      }}
      className={cn(
        "flex w-full cursor-grab items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] font-medium ring-1 transition-opacity active:cursor-grabbing",
        CATEGORY_META[activity.category].chip,
        className
      )}
    >
      <ActivityChipContent activity={activity} showTime={showTime} />
    </button>
  )
}