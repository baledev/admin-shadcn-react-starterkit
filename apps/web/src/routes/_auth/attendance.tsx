import * as React from "react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { PageHeader } from "@/components/page-header"
import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  formatMonthDay,
  formatMonthDayYear,
  formatMonthYear,
  formatFullDate,
  toIsoDate,
} from "@/lib/date-utils"
import { initialTeamMembers } from "@/lib/team-data"
import {
  initialAttendanceRecords,
  type AttendanceRecord,
  type AttendanceStatus,
} from "@/lib/attendance-data"
import { AttendanceTable } from "@/components/attendance/attendance-table"
import { SelfCheckinBanner } from "@/components/attendance/self-checkin-banner"
import {
  AttendanceFormSheet,
  type AttendanceFormState,
} from "@/components/attendance/attendance-form-sheet"

export const Route = createFileRoute("/_auth/attendance")({
  component: AttendancePage,
})

type ViewMode = "daily" | "weekly" | "monthly"

const EMPTY_FORM: AttendanceFormState = {
  employeeId: "",
  date: "",
  status: "present",
  checkIn: "09:00",
  checkOut: "17:00",
  note: "",
}

function recordToForm(record: AttendanceRecord): AttendanceFormState {
  return {
    employeeId: record.employeeId,
    date: record.date,
    status: record.status,
    checkIn: record.checkIn || "",
    checkOut: record.checkOut || "",
    note: record.note || "",
  }
}

function AttendancePage() {
  const router = useRouter()
  const auth = router.options.context.auth
  const user = auth.user || { name: "Sarah Connor", email: "sarah@acme.com", avatar: "" }

  const [view, setView] = React.useState<ViewMode>("monthly")
  const [anchorDate, setAnchorDate] = React.useState(() => new Date())
  const [records, setRecords] = React.useState<AttendanceRecord[]>(initialAttendanceRecords)

  // Form sheet states
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingRecord, setEditingRecord] = React.useState<AttendanceRecord | null>(null)
  const [form, setForm] = React.useState<AttendanceFormState>(EMPTY_FORM)

  const handlePrev = () => {
    setAnchorDate((prev) => {
      if (view === "monthly") return addMonths(prev, -1)
      if (view === "weekly") return addWeeks(prev, -1)
      return addDays(prev, -1)
    })
  }

  const handleNext = () => {
    setAnchorDate((prev) => {
      if (view === "monthly") return addMonths(prev, 1)
      if (view === "weekly") return addWeeks(prev, 1)
      return addDays(prev, 1)
    })
  }

  const handleToday = () => {
    setAnchorDate(new Date())
  }

  // Handle self-checkin clock action
  const handleClockAction = (type: "in" | "out", time: string) => {
    const employee =
      initialTeamMembers.find((emp) => emp.email === user.email) ||
      initialTeamMembers[0]

    const todayStr = toIsoDate(new Date())
    
    setRecords((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.employeeId === employee.id && r.date === todayStr
      )

      const updated = [...prev]

      if (type === "in") {
        const [hour] = time.split(":").map(Number)
        // Late if past 09:00
        const status: AttendanceStatus = hour >= 9 ? "late" : "present"
        
        const newRecord: AttendanceRecord = {
          id: `ATT-${Date.now()}`,
          employeeId: employee.id,
          date: todayStr,
          status,
          checkIn: time,
          note: status === "late" ? "Terlambat (Absensi Mandiri)" : "Absensi Mandiri",
        }

        if (existingIdx >= 0) {
          updated[existingIdx] = newRecord
        } else {
          updated.push(newRecord)
        }
        
        toast.success(`Berhasil Check-In pada pukul ${time}`)
      } else {
        // Clock out
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            checkOut: time,
          }
          toast.success(`Berhasil Check-Out pada pukul ${time}`)
        } else {
          // If no check-in record was found but clocking out (unlikely, but fallback)
          updated.push({
            id: `ATT-${Date.now()}`,
            employeeId: employee.id,
            date: todayStr,
            status: "present",
            checkOut: time,
            note: "Absen keluar mandiri tanpa check-in",
          })
          toast.success(`Berhasil Check-Out pada pukul ${time}`)
        }
      }

      return updated
    })
  }

  function handleField<K extends keyof AttendanceFormState>(
    key: K,
    value: AttendanceFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Handle saving from manual form sheet
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault()

    const isPresentOrLate = form.status === "present" || form.status === "late"
    
    const recordData = {
      employeeId: form.employeeId,
      date: form.date,
      status: form.status,
      checkIn: isPresentOrLate ? form.checkIn : undefined,
      checkOut: isPresentOrLate ? form.checkOut : undefined,
      note: form.note.trim() || undefined,
    }

    setRecords((prev) => {
      const updated = [...prev]
      if (editingRecord) {
        // Edit existing
        const idx = updated.findIndex((r) => r.id === editingRecord.id)
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            ...recordData,
          }
          toast.success("Data kehadiran berhasil diperbarui")
        }
      } else {
        // Check if there is already a record for this employee and date
        const existingIdx = updated.findIndex(
          (r) => r.employeeId === form.employeeId && r.date === form.date
        )

        const newRecord: AttendanceRecord = {
          ...recordData,
          id: `ATT-${Date.now()}`,
        }

        if (existingIdx >= 0) {
          updated[existingIdx] = newRecord
          toast.success("Data kehadiran berhasil diperbarui")
        } else {
          updated.push(newRecord)
          toast.success("Data kehadiran berhasil dicatat")
        }
      }
      return updated
    })

    setFormOpen(false)
  }

  // Handle edit record trigger
  const handleEditRecord = (employeeId: string, dateStr: string) => {
    const existing = records.find(
      (r) => r.employeeId === employeeId && r.date === dateStr
    )
    if (existing) {
      setEditingRecord(existing)
      setForm(recordToForm(existing))
    } else {
      setEditingRecord(null)
      setForm({
        ...EMPTY_FORM,
        employeeId,
        date: dateStr,
      })
    }
    setFormOpen(true)
  }

  const handleOpenCreateForm = () => {
    setEditingRecord(null)
    setForm({
      ...EMPTY_FORM,
      employeeId: initialTeamMembers[0].id,
      date: toIsoDate(anchorDate),
    })
    setFormOpen(true)
  }

  // Compute Range Label
  let rangeLabel = ""
  if (view === "monthly") {
    rangeLabel = formatMonthYear(anchorDate)
  } else if (view === "weekly") {
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
            title="Kehadiran Karyawan"
            description="Pantau, rekap, dan kelola kehadiran seluruh anggota tim."
          >
            <Button size="sm" onClick={handleOpenCreateForm}>
              <IconPlus className="size-4" />
              Catat Absensi
            </Button>
          </PageHeader>

          {/* Self check-in banner */}
          <SelfCheckinBanner
            user={user}
            records={records}
            onClockAction={handleClockAction}
          />

          {/* Navigation and views tab */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                aria-label="Sebelumnya"
                onClick={handlePrev}
              >
                <IconChevronLeft className="size-4" />
              </Button>
              <span className="min-w-44 px-2 text-center text-sm font-semibold tracking-wide text-foreground">
                {rangeLabel}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Selanjutnya"
                onClick={handleNext}
              >
                <IconChevronRight className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Hari Ini
              </Button>
            </div>

            <Tabs
              value={view}
              onValueChange={(val) => setView(val as ViewMode)}
            >
              <TabsList>
                <TabsTrigger value="daily">Harian</TabsTrigger>
                <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                <TabsTrigger value="monthly">Bulanan</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table display */}
          <AttendanceTable
            view={view}
            anchorDate={anchorDate}
            records={records}
            employees={initialTeamMembers}
            onEditRecord={handleEditRecord}
          />
        </div>
      </div>

      <AttendanceFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        isEditing={editingRecord !== null}
        form={form}
        onField={handleField}
        onSave={handleSaveRecord}
      />
    </div>
  )
}
