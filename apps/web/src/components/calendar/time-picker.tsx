import * as React from "react"
import { IconClock } from "@tabler/icons-react"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

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
  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground peer-disabled:opacity-50">
        <IconClock className="size-4" />
        <span className="sr-only">Time</span>
      </div>
      <Input
        type="time"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer appearance-none bg-background pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  )
}
