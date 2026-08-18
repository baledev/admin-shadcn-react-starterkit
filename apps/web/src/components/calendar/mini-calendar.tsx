import { useMemo } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"

type View = "month" | "week" | "day"

// --- Date helpers (no date-fns) ---

function addMonths(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + amount)
  return d
}

function addYears(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + amount)
  return d
}

/** Monday-based startOfWeek */
function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sun … 6 = Sat
  const diff = (day === 0 ? -6 : 1 - day) // offset to Monday
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Monday-based endOfWeek */
function endOfWeek(date: Date): Date {
  const start = startOfWeek(date)
  const d = new Date(start)
  d.setDate(d.getDate() + 6)
  d.setHours(23, 59, 59, 999)
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function formatYear(date: Date): string {
  return String(date.getFullYear())
}

function formatMonthYear(date: Date): string {
  return date.toLocaleString(undefined, { month: "long", year: "numeric" })
}

const MONTH_LABELS = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleString(undefined, { month: "short" })
)

// ----------------------------------

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

  const label = isMonthView ? formatYear(cursor) : formatMonthYear(cursor)

  const anchorWeekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate])
  const anchorWeekEnd = useMemo(() => endOfWeek(anchorDate), [anchorDate])

  const modifiers = useMemo(() => {
    if (isWeekView) {
      return { selected_week: { from: anchorWeekStart, to: anchorWeekEnd } }
    }
    return {}
  }, [isWeekView, anchorWeekStart, anchorWeekEnd])

  const modifiersClassNames = {
    selected_week: "bg-muted rounded-none first:rounded-l-md last:rounded-r-md",
  }

  function handleDayClick(day: Date) {
    if (isWeekView) {
      onSelectWeek(startOfWeek(day))
    } else {
      onSelectDate(day)
    }
  }

  const selectedDay = !isWeekView && !isMonthView ? anchorDate : undefined

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
          {MONTH_LABELS.map((monthLabel, i) => {
            const month = new Date(cursor.getFullYear(), i, 1)
            const selected = isSameMonth(month, anchorDate)
            return (
              <button
                key={monthLabel}
                type="button"
                onClick={() => onSelectMonth(month)}
                className={cn(
                  "rounded-md px-2 py-2 text-xs font-medium transition-colors",
                  selected
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {monthLabel}
              </button>
            )
          })}
        </div>
      ) : (
        <Calendar
          mode="single"
          month={cursor}
          onMonthChange={onCursorChange}
          selected={selectedDay}
          onDayClick={handleDayClick}
          weekStartsOn={1}
          showOutsideDays
          captionLayout="label"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          modifiers={modifiers as any}
          modifiersClassNames={modifiersClassNames}
          classNames={{
            month_caption: "hidden",
            nav: "hidden",
            root: "w-full p-0",
            month: "w-full gap-0",
            month_grid: "w-full",
            day: cn(
              "group/day relative aspect-square h-full w-full rounded-md p-0 text-center select-none",
              isWeekView && "cursor-pointer"
            ),
          }}
          components={{
            DayButton: ({ day, modifiers: dayModifiers, className, ...props }) => {
              const isAnchorDay = !isWeekView && isSameDay(day.date, anchorDate)
              return (
                <button
                  type="button"
                  className={cn(
                    "size-7 rounded-md text-xs tabular-nums transition-colors",
                    dayModifiers.outside && "text-muted-foreground/40",
                    dayModifiers.today && "font-semibold text-foreground",
                    isAnchorDay && "bg-foreground font-semibold text-background",
                    !isAnchorDay && !isWeekView && "hover:bg-muted hover:text-foreground",
                    className
                  )}
                  {...props}
                />
              )
            },
          }}
        />
      )}
    </div>
  )
}
