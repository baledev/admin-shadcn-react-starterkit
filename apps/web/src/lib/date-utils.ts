/**
 * Lightweight date helpers — no date-fns, no extra dependency.
 * All week helpers use Monday as the first day of the week.
 */

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

export function addWeeks(date: Date, amount: number): Date {
  return addDays(date, amount * 7)
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + amount)
  return d
}

export function addYears(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + amount)
  return d
}

/** Monday-based startOfWeek */
export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sun … 6 = Sat
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Monday-based endOfWeek */
export function endOfWeek(date: Date): Date {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 6)
  d.setHours(23, 59, 59, 999)
  return d
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isSameWeek(a: Date, b: Date): boolean {
  return isSameDay(startOfWeek(a), startOfWeek(b))
}

/** Parse a yyyy-MM-dd string to a local Date (no timezone shift). */
export function parseIso(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

/** Format a Date to yyyy-MM-dd. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Format a Date to HH:mm. */
export function toHHmm(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0")
  const m = String(date.getMinutes()).padStart(2, "0")
  return `${h}:${m}`
}

/** "d" — day of month without padding */
export function formatDay(date: Date): string {
  return String(date.getDate())
}

/** "MMM d" — e.g. "Aug 5" */
export function formatMonthDay(date: Date): string {
  return date.toLocaleString(undefined, { month: "short", day: "numeric" })
}

/** "MMM d, yyyy" — e.g. "Aug 5, 2026" */
export function formatMonthDayYear(date: Date): string {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/** "MMMM yyyy" — e.g. "August 2026" */
export function formatMonthYear(date: Date): string {
  return date.toLocaleString(undefined, { month: "long", year: "numeric" })
}

/** "EEEE, MMM d, yyyy" — e.g. "Tuesday, Aug 5, 2026" */
export function formatFullDate(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/** "EEEE, MMM d" — e.g. "Tuesday, Aug 5" */
export function formatWeekdayMonthDay(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

/** "HH:mm" from a hour number — e.g. hourLabel(9) → "09:00" */
export function hourLabel(hour: number): string {
  return toHHmm(new Date(2000, 0, 1, hour, 0))
}
