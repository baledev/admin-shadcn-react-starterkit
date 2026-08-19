import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { ConfirmDialog } from "@workspace/ui/components/confirm-dialog"
import {
  IconLogin,
  IconLogout,
  IconClock,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react"
import { toIsoDate, toHHmm } from "@/lib/date-utils"
import { initialTeamMembers } from "@/lib/team-data"
import { type AttendanceRecord } from "@/lib/attendance-data"

interface SelfCheckinBannerProps {
  user: {
    name: string
    email: string
    avatar?: string
  } | null
  records: AttendanceRecord[]
  onClockAction: (type: "in" | "out", time: string) => void
}

export function SelfCheckinBanner({
  user,
  records,
  onClockAction,
}: SelfCheckinBannerProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmType, setConfirmType] = React.useState<"in" | "out">("in")
  const [currentTime, setCurrentTime] = React.useState("")

  // Update current time display
  React.useEffect(() => {
    setCurrentTime(toHHmm(new Date()))
    const timer = setInterval(() => {
      setCurrentTime(toHHmm(new Date()))
    }, 30000) // check every 30 seconds
    return () => clearInterval(timer)
  }, [])

  if (!user) return null

  // Find corresponding employee in the database
  const employee =
    initialTeamMembers.find((emp) => emp.email === user.email) ||
    initialTeamMembers[0] // Fallback

  const todayStr = toIsoDate(new Date())
  const todayRecord = records.find(
    (r) => r.employeeId === employee.id && r.date === todayStr
  )

  const hasCheckedIn = !!todayRecord?.checkIn
  const hasCheckedOut = !!todayRecord?.checkOut

  const handleClockClick = (type: "in" | "out") => {
    setConfirmType(type)
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    const timeNow = toHHmm(new Date())
    onClockAction(confirmType, timeNow)
  }

  // Get initials for Avatar Fallback
  const displayName = employee?.name || user.name
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-primary/5 via-card to-card p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-12 border border-border shadow-xs">
              <AvatarImage src={employee?.avatarUrl || user.avatar} alt={displayName} />
              <AvatarFallback className="text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Absensi Mandiri
              </span>
              <h2 className="text-base font-bold text-foreground">
                Halo, {displayName}!
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconClock className="size-3.5" />
                <span>Waktu hari ini: </span>
                <span className="font-mono font-semibold text-foreground">
                  {currentTime || toHHmm(new Date())}
                </span>
                <span>•</span>
                {hasCheckedOut ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Selesai absensi hari ini
                  </span>
                ) : hasCheckedIn ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Sedang bekerja (Sudah Check-In)
                  </span>
                ) : (
                  <span className="text-muted-foreground">Belum Check-In hari ini</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasCheckedIn && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <IconCheck className="size-4" />
                <span>Masuk: {todayRecord.checkIn}</span>
              </div>
            )}
            {hasCheckedOut && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <IconCheck className="size-4" />
                <span>Keluar: {todayRecord.checkOut}</span>
              </div>
            )}

            {!hasCheckedIn && (
              <Button
                size="sm"
                type="button"
                onClick={() => handleClockClick("in")}
                className="gap-1.5 shadow-xs"
              >
                <IconLogin className="size-4" />
                Clock In
              </Button>
            )}

            {hasCheckedIn && !hasCheckedOut && (
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => handleClockClick("out")}
                className="gap-1.5 border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-700 dark:hover:text-amber-300"
              >
                <IconLogout className="size-4" />
                Clock Out
              </Button>
            )}
          </div>
        </div>

        {/* Small subtle info footer */}
        {!hasCheckedIn && (
          <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
            <IconInfoCircle className="size-3" />
            <span>Jam masuk kerja standar adalah sebelum pukul 09:00 WIB.</span>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmType === "in" ? "Konfirmasi Clock In" : "Konfirmasi Clock Out"}
        description={
          confirmType === "in" ? (
            <span>
              Apakah Anda yakin ingin melakukan <strong>Clock In (Masuk Kerja)</strong> sekarang pukul{" "}
              <strong className="font-mono text-foreground">{toHHmm(new Date())}</strong>? Kehadiran Anda akan dicatat dalam sistem absensi.
            </span>
          ) : (
            <span>
              Apakah Anda yakin ingin melakukan <strong>Clock Out (Pulang Kerja)</strong> sekarang pukul{" "}
              <strong className="font-mono text-foreground">{toHHmm(new Date())}</strong>? Sesi kerja Anda hari ini akan diakhiri.
            </span>
          )
        }
        confirmLabel={confirmType === "in" ? "Clock In" : "Clock Out"}
        cancelLabel="Batal"
        variant="default"
        onConfirm={handleConfirm}
      />
    </>
  )
}
