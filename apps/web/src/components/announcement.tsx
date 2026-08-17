import { useEffect, useState } from "react"
import { Flame, ArrowRight, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  isAnnouncementDismissed,
  dismissAnnouncement,
} from "@/lib/announcement"

export const ANNOUNCEMENT_HEIGHT = 48

interface AnnouncementBlockProps {
  onVisibilityChange?: (visible: boolean) => void
}

const SALE_DURATION_MS =
  2 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000 + 34 * 60 * 60 * 1000 + 12 * 1000

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(diffMs: number): TimeLeft {
  const diff = Math.max(0, diffMs)
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function pad(value: number): string {
  return value.toString().padStart(2, "0")
}

export default function AnnouncementBlock({
  onVisibilityChange,
}: AnnouncementBlockProps) {
  const [dismissed, setDismissed] = useState(isAnnouncementDismissed)

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(SALE_DURATION_MS)
  )

  useEffect(() => {
    const deadline = Date.now() + SALE_DURATION_MS
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline - Date.now()))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  function onClose() {
    dismissAnnouncement()
    setDismissed(true)
    onVisibilityChange?.(false)
  }

  if (dismissed) {
    return null
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-6 py-3 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="size-4 shrink-0" aria-hidden="true" />
            Summer Sale, up to 40% off
          </span>
          <span className="hidden h-4 w-px bg-primary-foreground/30 sm:block" />
          <span className="flex items-center gap-2 text-sm">
            <span className="text-primary-foreground/80">Sale ends in</span>
            <span className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums">
              <span className="rounded-md bg-primary-foreground/15 px-1.5 py-0.5">
                {pad(timeLeft.days)}d
              </span>
              <span className="rounded-md bg-primary-foreground/15 px-1.5 py-0.5">
                {pad(timeLeft.hours)}h
              </span>
              <span className="rounded-md bg-primary-foreground/15 px-1.5 py-0.5">
                {pad(timeLeft.minutes)}m
              </span>
              <span className="rounded-md bg-primary-foreground/15 px-1.5 py-0.5">
                {pad(timeLeft.seconds)}s
              </span>
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            render={<a href="#" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            Shop The Sale
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onClose}
            aria-label="Dismiss announcement"
            className="text-primary-foreground/80 hover:text-primary-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
