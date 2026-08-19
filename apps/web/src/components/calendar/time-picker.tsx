import { useEffect, useRef } from "react"
import { IconClock } from "@tabler/icons-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function TimePicker({
  value,
  onChange,
  name,
  id,
  className,
}: {
  value: string
  onChange: (value: string) => void
  name?: string
  id?: string
  className?: string
}) {
  const [hour, minute] = value.split(":").map(Number)

  function handleHourChange(nextHour: number) {
    onChange(`${pad(nextHour)}:${pad(Number.isNaN(minute) ? 0 : minute)}`)
  }

  function handleMinuteChange(nextMinute: number) {
    onChange(`${pad(Number.isNaN(hour) ? 0 : hour)}:${pad(nextMinute)}`)
  }

  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger
          id={id}
          aria-label="Pick a time"
          className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <span className="tabular-nums">{value}</span>
          <IconClock className="size-4 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="w-auto gap-2 py-2 px-0"
        >
          <div className="flex items-start gap-1">
            <TimeColumn
              label="Jam"
              values={HOURS}
              selected={Number.isNaN(hour) ? 0 : hour}
              onSelect={handleHourChange}
            />
            <TimeColumn
              label="Menit"
              values={MINUTES}
              selected={Number.isNaN(minute) ? 0 : minute}
              onSelect={handleMinuteChange}
            />
          </div>
          {/* <p className="text-center text-[10px] text-muted-foreground">
            Scroll untuk memilih
          </p> */}
        </PopoverContent>
      </Popover>
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  )
}

function TimeColumn({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string
  values: number[]
  selected: number
  onSelect: (value: number) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const index = values.indexOf(selected)
    const item = index >= 0 ? (list.children[index] as HTMLElement) : undefined
    if (item) {
      list.scrollTop =
        item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2
    }
  }, [values, selected])

  return (
    <div className="flex w-14 flex-col gap-1">
      <span className="text-center text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <div
        ref={listRef}
        className="h-32 overflow-y-auto overscroll-contain rounded-md border border-border py-1"
      >
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onSelect(v)}
            className={cn(
              "flex w-full justify-center rounded-sm px-1 py-1 text-xs tabular-nums transition-colors",
              v === selected
                ? "bg-foreground font-medium text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {pad(v)}
          </button>
        ))}
      </div>
    </div>
  )
}
