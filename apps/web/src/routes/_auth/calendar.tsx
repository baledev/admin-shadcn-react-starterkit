import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  formatFullDate,
  formatMonthDay,
  formatMonthDayYear,
  formatMonthYear,
  startOfWeek,
} from "@/lib/date-utils"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"
import { PageHeader } from "@/components/page-header"
import { MiniCalendar } from "@/components/calendar/mini-calendar"
import { CalendarMonthView } from "@/components/calendar/calendar-month-view"
import { CalendarWeekView } from "@/components/calendar/calendar-week-view"
import { CalendarDayView } from "@/components/calendar/calendar-day-view"
import { AddActivitySheet } from "@/components/calendar/calendar-activity-form"
import { ActivityDetailsSheet } from "@/components/calendar/calendar-activity-details"
import {
  CATEGORY_META,
  CATEGORY_OPTIONS,
  initialActivities,
  toIso,
  type CalendarActivity,
} from "@/lib/calendar-data"

export const Route = createFileRoute("/_auth/calendar")({
  component: CalendarPage,
})

type View = "month" | "week" | "day"

function CalendarPage() {
  const [activeView, setActiveView] = React.useState<View>("month")
  const [anchorDate, setAnchorDate] = React.useState(() => new Date())
  const [miniCursor, setMiniCursor] = React.useState(() => new Date())
  const [activities, setActivities] =
    React.useState<CalendarActivity[]>(initialActivities)
  const [selectedActivity, setSelectedActivity] =
    React.useState<CalendarActivity | null>(null)
  const [addOpen, setAddOpen] = React.useState(false)
  const [addDate, setAddDate] = React.useState<string | undefined>(undefined)

  const moveActivity = React.useCallback(
    (id: string, patch: Partial<CalendarActivity>) => {
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
      )
    },
    []
  )

  const addActivity = React.useCallback((activity: CalendarActivity) => {
    setActivities((prev) => [activity, ...prev])
  }, [])

  function goToToday() {
    const today = new Date()
    setAnchorDate(today)
    setMiniCursor(today)
  }

  function movePrev() {
    const next =
      activeView === "month"
        ? addMonths(anchorDate, -1)
        : activeView === "week"
          ? addWeeks(anchorDate, -1)
          : addDays(anchorDate, -1)
    setAnchorDate(next)
    setMiniCursor(next)
  }

  function moveNext() {
    const next =
      activeView === "month"
        ? addMonths(anchorDate, 1)
        : activeView === "week"
          ? addWeeks(anchorDate, 1)
          : addDays(anchorDate, 1)
    setAnchorDate(next)
    setMiniCursor(next)
  }

  function openAdd(date?: Date) {
    setAddDate(toIso(date ?? anchorDate))
    setAddOpen(true)
  }

  function handleMiniSelectDate(date: Date) {
    setAnchorDate(date)
    setMiniCursor(date)
    setActiveView("day")
  }

  function handleMiniSelectWeek(weekStart: Date) {
    setAnchorDate(weekStart)
    setMiniCursor(weekStart)
    setActiveView("week")
  }

  function handleMiniSelectMonth(month: Date) {
    setAnchorDate(month)
    setMiniCursor(month)
    setActiveView("month")
  }

  let rangeLabel: string
  if (activeView === "month") {
    rangeLabel = formatMonthYear(anchorDate)
  } else if (activeView === "week") {
    const start = startOfWeek(anchorDate)
    const end = endOfWeek(anchorDate)
    rangeLabel = `${formatMonthDay(start)} – ${formatMonthDayYear(end)}`
  } else {
    rangeLabel = formatFullDate(anchorDate)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Calendar"
            description="Manage and schedule your activities."
          >
            <Button size="sm" onClick={() => openAdd()}>
              <IconPlus className="size-4" />
              Add Activity
            </Button>
          </PageHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous"
                  onClick={movePrev}
                >
                  <IconChevronLeft className="size-4" />
                </Button>
                <span className="min-w-40 px-1 text-center text-sm font-medium">
                  {rangeLabel}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next"
                  onClick={moveNext}
                >
                  <IconChevronRight className="size-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>

              <Tabs
                value={activeView}
                onValueChange={(value) => setActiveView(value as View)}
              >
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="min-w-0 flex-1">
                <Tabs
                  value={activeView}
                  onValueChange={(value) => setActiveView(value as View)}
                >
                  <TabsContent value="month">
                    <CalendarMonthView
                      anchorDate={anchorDate}
                      activities={activities}
                      onSelectActivity={setSelectedActivity}
                      onMoveActivity={moveActivity}
                      onAddAt={openAdd}
                    />
                  </TabsContent>
                  <TabsContent value="week">
                    <CalendarWeekView
                      anchorDate={anchorDate}
                      activities={activities}
                      onSelectActivity={setSelectedActivity}
                      onMoveActivity={moveActivity}
                      onAddAt={openAdd}
                    />
                  </TabsContent>
                  <TabsContent value="day">
                    <CalendarDayView
                      anchorDate={anchorDate}
                      activities={activities}
                      onSelectActivity={setSelectedActivity}
                      onMoveActivity={moveActivity}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="hidden w-60 shrink-0 flex-col gap-4 md:flex">
                <MiniCalendar
                  view={activeView}
                  cursor={miniCursor}
                  onCursorChange={setMiniCursor}
                  anchorDate={anchorDate}
                  onSelectDate={handleMiniSelectDate}
                  onSelectWeek={handleMiniSelectWeek}
                  onSelectMonth={handleMiniSelectMonth}
                />
                <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-background p-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Categories
                  </span>
                  {CATEGORY_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          CATEGORY_META[option.value].dot
                        )}
                        aria-hidden="true"
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddActivitySheet
        open={addOpen}
        onOpenChange={setAddOpen}
        initialDate={addDate}
        onAdd={addActivity}
      />
      <ActivityDetailsSheet
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  )
}
