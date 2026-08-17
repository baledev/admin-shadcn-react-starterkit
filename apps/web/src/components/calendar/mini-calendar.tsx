import { useMemo } from "react"
import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

type View = "month" | "week" | "day"

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTH_LABELS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i, 1), "MMM")
)

type MiniCalendarProps = {
  view: View
  cursor: Date
  onCursorChange: (cursor: Date) => void
  anchorDate: Date
  onSelectDate: (date: Date) => void
  onSelectWeek: (weekStart: Date) => void
  onSelectMonth: (month: Date) => void
}

export function MiniCalendar({
  view,
  cursor,
  onCursorChange,
  anchorDate,
  onSelectDate,
  onSelectWeek,
  onSelectMonth,
}: MiniCalendarProps) {
  const isMonthView = view === "month"
  const isWeekView = view === "week"

  function handlePrev() {
    onCursorChange(isMonthView ? addYears(cursor, -1) : addMonths(cursor, -1))
  }

  function handleNext() {
    onCursorChange(isMonthView ? addYears(cursor, 1) : addMonths(cursor, 1))
  }

  const label = isMonthView
    ? format(cursor, "yyyy")
    : format(cursor, "MMMM yyyy")

  const weeks = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
    const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
    const result: Date[][] = []
    let current = gridStart
    while (current <= gridEnd) {
      result.push(
        Array.from({ length: 7 }, (_, i) => addDays(current, i))
      )
      current = addDays(current, 7)
    }
    return result
  }, [cursor])

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous period"
          onClick={handlePrev}
        >
          <IconChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium">{label}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next period"
          onClick={handleNext}
        >
          <IconChevronRight className="size-4" />
        </Button>
      </div>

      {isMonthView ? (
        <div className="grid grid-cols-3 gap-1.5">
          {MONTH_LABELS.map((label, i) => {
            const month = new Date(cursor.getFullYear(), i, 1)
            const selected = isSameMonth(month, anchorDate)
            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelectMonth(month)}
                className={cn(
                  "rounded-md px-2 py-2 text-xs font-medium transition-colors",
                  selected
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          <div className="grid grid-cols-7 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="py-1 text-[10px] font-medium text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
          {weeks.map((week) => {
            const weekStart = week[0]
            const isAnchorWeek = isWeekView
              ? isSameDay(startOfWeek(anchorDate, { weekStartsOn: 1 }), weekStart)
              : false
            return (
              <div
                key={format(weekStart, "yyyy-MM-dd")}
                className={cn(
                  "grid grid-cols-7 rounded-md text-center",
                  isWeekView && "cursor-pointer",
                  isWeekView && isAnchorWeek && "bg-muted",
                  isWeekView && !isAnchorWeek && "hover:bg-muted/60"
                )}
                onClick={
                  isWeekView ? () => onSelectWeek(weekStart) : undefined
                }
              >
                {week.map((day) => {
                  const inMonth = isSameMonth(day, cursor)
                  const isAnchorDay =
                    !isWeekView && isSameDay(day, anchorDate)
                  return (
                    <button
                      key={format(day, "yyyy-MM-dd")}
                      type="button"
                      disabled={!isWeekView}
                      onClick={
                        isWeekView
                          ? undefined
                          : () => onSelectDate(day)
                      }
                      className={cn(
                        "size-7 rounded-md text-xs tabular-nums transition-colors",
                        !inMonth && "text-muted-foreground/40",
                        isToday(day) && "font-semibold text-foreground",
                        isAnchorDay &&
                          "bg-foreground font-semibold text-background",
                        !isAnchorDay &&
                          !isWeekView &&
                          "hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}