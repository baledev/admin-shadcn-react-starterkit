import { formatFullDate, parseIso } from "@/lib/date-utils"
import { IconCalendar, IconClock } from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { CATEGORY_META, type CalendarActivity } from "@/lib/calendar-data"

export function ActivityDetailsSheet({
  activity,
  onClose,
}: {
  activity: CalendarActivity | null
  onClose: () => void
}) {
  return (
    <Sheet
      open={activity !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent side="right" className="sm:max-w-md">
        {activity && (
          <>
            <SheetHeader>
              <SheetTitle>{activity.title}</SheetTitle>
              <SheetDescription>
                <Badge
                  variant="outline"
                  className={CATEGORY_META[activity.category].chip}
                >
                  {CATEGORY_META[activity.category].label}
                </Badge>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <IconCalendar className="size-4 shrink-0 text-muted-foreground" />
                  <span>
                    {formatFullDate(parseIso(activity.date))}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconClock className="size-4 shrink-0 text-muted-foreground" />
                  <span className="tabular-nums">
                    {activity.start} – {activity.end}
                  </span>
                </div>
              </div>

              {activity.description && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Description</span>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              )}
            </div>

            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}