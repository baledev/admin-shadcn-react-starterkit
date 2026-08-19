/**
 * Gantt chart helpers — pure date<->pixel math and column builders.
 * No React, no DOM. All functions are timezone-safe and operate on local Dates.
 */

import { addDays, startOfWeek, toIsoDate, isToday, isSameMonth } from "@/lib/date-utils"

export const DAY_WIDTH = 56
export const WEEK_WIDTH = DAY_WIDTH * 7
export const ROW_HEIGHT = 44
export const HEADER_HEIGHT = 48

/** Whole-day difference: b - a (can be negative). Ignores time. Pure. */
export function dayDiff(a: Date, b: Date): number {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((db.getTime() - da.getTime()) / 86_400_000)
}

/** Pixel offset for a given date from the viewport start (whole-day snap). */
export function dateToPx(date: Date, viewportStart: Date): number {
  return dayDiff(viewportStart, date) * DAY_WIDTH
}

/** Inverse of dateToPx: pixel offset -> Date (snapped to start-of-day). */
export function pxToDate(px: number, viewportStart: Date): Date {
  const days = Math.round(px / DAY_WIDTH)
  return addDays(viewportStart, days)
}

/** Snap a pixel delta to the nearest whole day. */
export function snapDeltaPx(px: number): number {
  return Math.round(px / DAY_WIDTH) * DAY_WIDTH
}

export type GanttDay = {
  date: Date
  iso: string
  isWeekend: boolean
  isToday: boolean
  label: string // day number
  weekday: string // single letter
}

export type GanttWeek = {
  iso: string
  monthLabel: string // "Mar 2026" or "Mar 2026 - Apr 2026"
  weekLabel: string // "Week 12"
  days: GanttDay[]
}

/** Build N weeks of column metadata starting from the Monday of the viewport start. */
export function buildWeeks(viewportStart: Date, numWeeks: number): GanttWeek[] {
  const start = startOfWeek(viewportStart)
  const weeks: GanttWeek[] = []
  for (let w = 0; w < numWeeks; w++) {
    const weekStart = addDays(start, w * 7)
    const weekEnd = addDays(weekStart, 6)
    const sameMonth = isSameMonth(weekStart, weekEnd)
    const monthLabel = sameMonth
      ? weekStart.toLocaleString(undefined, { month: "short", year: "numeric" })
      : `${weekStart.toLocaleString(undefined, { month: "short", year: "numeric" })} - ${weekEnd.toLocaleString(undefined, { month: "short", year: "numeric" })}`
    const days: GanttDay[] = []
    for (let d = 0; d < 7; d++) {
      const date = addDays(weekStart, d)
      const dow = date.getDay()
      days.push({
        date,
        iso: toIsoDate(date),
        isWeekend: dow === 0 || dow === 6,
        isToday: isToday(date),
        label: String(date.getDate()),
        weekday: date.toLocaleString(undefined, { weekday: "narrow" }),
      })
    }
    weeks.push({
      iso: toIsoDate(weekStart),
      monthLabel,
      weekLabel: `Week ${getWeekNumber(weekStart)}`,
      days,
    })
  }
  return weeks
}

/** ISO week number (Monday-based, per ISO 8601). */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000) + 1)
}

export type DragMode = "move" | "resize-start" | "resize-end"

export type DragState = {
  issueId: string
  mode: DragMode
  startX: number
  originalStart: Date
  originalEnd: Date
}

/** Clamp helper for a dragged issue's date range. */
export function clampRange(
  newStart: Date,
  newEnd: Date,
  minDays = 1
): { start: Date; end: Date } {
  const start = new Date(newStart)
  let end = new Date(newEnd)
  const diff = dayDiff(start, end)
  if (diff < minDays) {
    end = addDays(start, minDays)
  }
  return { start, end }
}
