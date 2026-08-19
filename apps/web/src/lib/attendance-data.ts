import {
  IconCheck,
  IconClock,
  IconX,
  IconFileText,
  IconStethoscope,
  IconBeach,
  IconCalendarEvent,
  IconMinus,
} from "@tabler/icons-react"
import { initialTeamMembers } from "./team-data"

export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "permission"
  | "sick"
  | "leave"
  | "holiday"
  | "off"

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string // yyyy-MM-dd
  status: AttendanceStatus
  checkIn?: string // HH:mm
  checkOut?: string // HH:mm
  note?: string
}

export const STATUS_META: Record<
  AttendanceStatus,
  {
    label: string
    icon: React.ComponentType<any>
    chip: string
    dot: string
  }
> = {
  present: {
    label: "Hadir",
    icon: IconCheck,
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    dot: "bg-emerald-500",
  },
  late: {
    label: "Terlambat",
    icon: IconClock,
    chip: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
    dot: "bg-amber-500",
  },
  absent: {
    label: "Alpa",
    icon: IconX,
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
    dot: "bg-destructive",
  },
  permission: {
    label: "Izin",
    icon: IconFileText,
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
    dot: "bg-blue-500",
  },
  sick: {
    label: "Sakit",
    icon: IconStethoscope,
    chip: "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:bg-violet-400/15 dark:text-violet-300 dark:ring-violet-400/30",
    dot: "bg-violet-500",
  },
  leave: {
    label: "Cuti",
    icon: IconBeach,
    chip: "bg-teal-500/15 text-teal-700 ring-teal-500/30 dark:bg-teal-400/15 dark:text-teal-300 dark:ring-teal-400/30",
    dot: "bg-teal-500",
  },
  holiday: {
    label: "Libur Nasional",
    icon: IconCalendarEvent,
    chip: "bg-rose-500/15 text-rose-700 ring-rose-500/30 dark:bg-rose-400/15 dark:text-rose-300 dark:ring-rose-400/30",
    dot: "bg-rose-500",
  },
  off: {
    label: "Libur",
    icon: IconMinus,
    chip: "bg-muted text-muted-foreground ring-border/50",
    dot: "bg-muted-foreground/40",
  },
}

export const STATUS_OPTIONS = (
  Object.keys(STATUS_META) as AttendanceStatus[]
).map((key) => ({
  value: key,
  label: STATUS_META[key].label,
}))

// Function to generate mock data for August 2026
function generateMockAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const employees = initialTeamMembers
  const year = 2026
  const month = 7 // August (0-indexed is July? No, January = 0, August = 7)

  // August has 31 days
  let idCounter = 1

  for (let day = 1; day <= 31; day++) {
    const dateStr = `2026-08-${String(day).padStart(2, "0")}`
    const dateObj = new Date(year, month, day)
    const dayOfWeek = dateObj.getDay() // 0 = Sun, 6 = Sat

    // Check if it's weekend
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // National Holiday: Aug 17 (Independence Day)
    const isHoliday = day === 17

    employees.forEach((emp) => {
      // Don't generate records for days after Aug 20 (since today is Aug 19, let's keep them empty or unrecorded for realism, but we can have holiday/off predefined)
      if (day > 20 && !isWeekend && !isHoliday) {
        return
      }

      const recordId = `ATT-${String(idCounter++).padStart(4, "0")}`

      if (isHoliday) {
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "holiday",
          note: "Hari Kemerdekaan RI",
        })
        return
      }

      if (isWeekend) {
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "off",
        })
        return
      }

      // Weekdays: normal distribution
      // 80% Hadir, 10% Terlambat, 4% Sakit, 3% Izin, 2% Cuti, 1% Alpa
      const rand = Math.random()

      if (rand < 0.8) {
        // Hadir
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "present",
          checkIn: "08:" + String(Math.floor(Math.random() * 30)).padStart(2, "0"),
          checkOut: "17:" + String(Math.floor(Math.random() * 30) + 30).padStart(2, "0"),
        })
      } else if (rand < 0.9) {
        // Terlambat
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "late",
          checkIn: "09:" + String(Math.floor(Math.random() * 45) + 1).padStart(2, "0"),
          checkOut: "18:" + String(Math.floor(Math.random() * 30)).padStart(2, "0"),
          note: "Kesiangan / macet di jalan",
        })
      } else if (rand < 0.94) {
        // Sakit
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "sick",
          note: "Demam dan flu, istirahat di rumah (Surat dokter terlampir)",
        })
      } else if (rand < 0.97) {
        // Izin
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "permission",
          note: "Mengurus surat nikah kerabat",
        })
      } else if (rand < 0.99) {
        // Cuti
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "leave",
          note: "Cuti tahunan acara keluarga",
        })
      } else {
        // Alpa
        records.push({
          id: recordId,
          employeeId: emp.id,
          date: dateStr,
          status: "absent",
          note: "Tanpa keterangan",
        })
      }
    })
  }

  return records
}

export const initialAttendanceRecords = generateMockAttendance()
