import {
  addDays,
  addMonths,
  isSameMonth,
  isSameWeek,
  parseIso,
  startOfMonth,
  toHHmm,
  toIsoDate,
} from "@/lib/date-utils"

export type ActivityCategory = "meeting" | "task" | "reminder" | "personal"

export type CalendarActivity = {
  id: string
  title: string
  category: ActivityCategory
  date: string // yyyy-MM-dd
  start: string // HH:mm
  end: string // HH:mm
  description?: string
}

export const CATEGORY_META: Record<
  ActivityCategory,
  { label: string; chip: string; dot: string }
> = {
  meeting: {
    label: "Meeting",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
    dot: "bg-blue-500",
  },
  task: {
    label: "Task",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    dot: "bg-emerald-500",
  },
  reminder: {
    label: "Reminder",
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
    dot: "bg-amber-500",
  },
  personal: {
    label: "Personal",
    chip: "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:bg-violet-400/15 dark:text-violet-300 dark:ring-violet-400/30",
    dot: "bg-violet-500",
  },
}

export const CATEGORY_OPTIONS: { value: ActivityCategory; label: string }[] = [
  { value: "meeting", label: "Meeting" },
  { value: "task", label: "Task" },
  { value: "reminder", label: "Reminder" },
  { value: "personal", label: "Personal" },
]

export function toDate(a: CalendarActivity) {
  return parseIso(a.date)
}

export function toIso(d: Date) {
  return toIsoDate(d)
}

function at(hour: number, minute = 0) {
  return toHHmm(new Date(2000, 0, 1, hour, minute))
}

const today = new Date()

export const initialActivities: CalendarActivity[] = [
  {
    id: "a1",
    title: "Sprint planning",
    category: "meeting",
    date: toIso(today),
    start: at(9),
    end: at(10),
    description: "Weekly sprint planning with the product and engineering teams.",
  },
  {
    id: "a2",
    title: "Design review",
    category: "task",
    date: toIso(today),
    start: at(11),
    end: at(12),
    description: "Review the new onboarding flow mockups.",
  },
  {
    id: "a3",
    title: "Lunch with client",
    category: "personal",
    date: toIso(today),
    start: at(13),
    end: at(14),
  },
  {
    id: "a4",
    title: "Ship billing endpoint",
    category: "task",
    date: toIso(today),
    start: at(15),
    end: at(17),
  },
  {
    id: "a5",
    title: "1:1 with Dana",
    category: "meeting",
    date: toIso(addDays(today, 1)),
    start: at(10),
    end: at(10, 30),
  },
  {
    id: "a6",
    title: "Dentist appointment",
    category: "personal",
    date: toIso(addDays(today, 1)),
    start: at(14),
    end: at(15),
  },
  {
    id: "a7",
    title: "Prepare investor deck",
    category: "task",
    date: toIso(addDays(today, 1)),
    start: at(16),
    end: at(18),
  },
  {
    id: "a8",
    title: "Team standup",
    category: "meeting",
    date: toIso(addDays(today, 2)),
    start: at(9, 30),
    end: at(10),
  },
  {
    id: "a9",
    title: "Pay utilities bill",
    category: "reminder",
    date: toIso(addDays(today, 2)),
    start: at(12),
    end: at(12, 30),
  },
  {
    id: "a10",
    title: "Product demo",
    category: "meeting",
    date: toIso(addDays(today, 3)),
    start: at(11),
    end: at(12),
    description: "Demo the new analytics dashboard to stakeholders.",
  },
  {
    id: "a11",
    title: "Weekend trip packing",
    category: "personal",
    date: toIso(addDays(today, 4)),
    start: at(18),
    end: at(19),
  },
  {
    id: "a12",
    title: "Code review requests",
    category: "task",
    date: toIso(addDays(today, -1)),
    start: at(9),
    end: at(10, 30),
  },
  {
    id: "a13",
    title: "Renew domain",
    category: "reminder",
    date: toIso(addDays(today, -1)),
    start: at(15),
    end: at(15, 30),
  },
  {
    id: "a14",
    title: "Marketing sync",
    category: "meeting",
    date: toIso(addDays(today, -2)),
    start: at(13),
    end: at(14),
  },
  {
    id: "a15",
    title: "Gym session",
    category: "personal",
    date: toIso(addDays(today, -3)),
    start: at(7),
    end: at(8),
  },
  {
    id: "a16",
    title: "Write Q3 roadmap",
    category: "task",
    date: toIso(addDays(today, -4)),
    start: at(10),
    end: at(12),
  },
  {
    id: "a17",
    title: "Quarterly review",
    category: "meeting",
    date: toIso(addDays(today, 6)),
    start: at(10),
    end: at(11, 30),
    description: "Quarterly business review with leadership.",
  },
  {
    id: "a18",
    title: "Car service",
    category: "reminder",
    date: toIso(addDays(today, 7)),
    start: at(9),
    end: at(11),
  },
  {
    id: "a19",
    title: "Workshop: pricing",
    category: "meeting",
    date: toIso(addDays(today, 9)),
    start: at(13),
    end: at(16),
  },
  {
    id: "a20",
    title: "Plan next month OKRs",
    category: "task",
    date: toIso(addMonths(today, 1)),
    start: at(10),
    end: at(11),
  },
  {
    id: "a21",
    title: "Board meeting",
    category: "meeting",
    date: toIso(addMonths(today, 1)),
    start: at(14),
    end: at(16),
  },
]

export function activitiesOnDate(
  activities: CalendarActivity[],
  date: Date
): CalendarActivity[] {
  const key = toIso(date)
  return activities.filter((a) => a.date === key)
}

export function activitiesInMonth(
  activities: CalendarActivity[],
  month: Date
): CalendarActivity[] {
  const anchor = startOfMonth(month)
  return activities.filter((a) => isSameMonth(parseIso(a.date), anchor))
}

export function activitiesInWeek(
  activities: CalendarActivity[],
  weekStart: Date
): CalendarActivity[] {
  return activities.filter((a) => isSameWeek(parseIso(a.date), weekStart))
}
