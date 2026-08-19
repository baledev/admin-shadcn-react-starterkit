import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { STATUS_META, type AttendanceRecord } from "@/lib/attendance-data"

interface AttendanceStatusCellProps {
  record: AttendanceRecord | undefined
  date: Date
}

export function AttendanceStatusCell({
  record,
  date,
}: AttendanceStatusCellProps) {
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  const status = record?.status || (isWeekend ? "off" : "absent")
  const meta = STATUS_META[status]
  const Icon = meta.icon

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cellDate = new Date(date)
  cellDate.setHours(0, 0, 0, 0)

  const isFuture = cellDate > today

  let displayLabel = meta.label
  let displayDot = meta.dot

  if (!record && !isWeekend) {
    if (isFuture) {
      return (
        <div className="flex items-center justify-center py-1">
          <span className="text-xs text-muted-foreground/30">—</span>
        </div>
      )
    } else {
      const alpaMeta = STATUS_META["absent"]
      displayLabel = "Alpa (Belum dicatat)"
      displayDot = alpaMeta.dot
    }
  }

  let durationStr = ""
  if (record?.checkIn && record?.checkOut) {
    const [inH, inM] = record.checkIn.split(":").map(Number)
    const [outH, outM] = record.checkOut.split(":").map(Number)
    const diffMs =
      new Date(2000, 0, 1, outH, outM).getTime() -
      new Date(2000, 0, 1, inH, inM).getTime()
    if (diffMs > 0) {
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      durationStr = `${diffHrs}j ${diffMins}m`
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            className={cn(
              "mx-auto flex size-7 items-center justify-center rounded-full transition-colors focus-visible:outline-hidden",
              status === "off"
                ? "text-muted-foreground/30 hover:bg-muted"
                : "hover:bg-muted/80",
              record ? "" : "text-muted-foreground/40"
            )}
            aria-label={displayLabel}
          />
        }
      >
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
            status === "present" && "text-emerald-600 dark:text-emerald-400",
            status === "late" && "text-amber-600 dark:text-amber-400",
            status === "absent" && "text-red-600 dark:text-red-400",
            status === "permission" && "text-blue-600 dark:text-blue-400",
            status === "sick" && "text-violet-600 dark:text-violet-400",
            status === "leave" && "text-teal-600 dark:text-teal-400",
            status === "holiday" && "text-rose-600 dark:text-rose-400",
            status === "off" && "text-muted-foreground/40"
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="flex max-w-[200px] flex-col gap-1 border border-border bg-popover p-2.5 text-[11px] text-popover-foreground">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className={cn("size-2 rounded-full", displayDot)} />
          <span>{displayLabel}</span>
        </div>
        {record?.checkIn && (
          <div className="flex justify-between gap-4 text-muted-foreground">
            <span>Masuk:</span>
            <span className="font-mono">{record.checkIn}</span>
          </div>
        )}
        {record?.checkOut && (
          <div className="flex justify-between gap-4 text-muted-foreground">
            <span>Keluar:</span>
            <span className="font-mono">{record.checkOut}</span>
          </div>
        )}
        {durationStr && (
          <div className="flex justify-between gap-4 text-muted-foreground">
            <span>Durasi Kerja:</span>
            <span>{durationStr}</span>
          </div>
        )}
        {record?.note && (
          <div className="mt-1 border-t border-border pt-1 text-left text-muted-foreground italic">
            "{record.note}"
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
