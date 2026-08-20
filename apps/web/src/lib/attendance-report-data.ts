export interface AttendanceReportItem {
  employeeId: string
  employeeName: string
  department: string
  presentCount: number
  lateCount: number
  absentCount: number
  permitCount: number
  sickCount: number
  attendanceRate: number // percentage
}

export interface AttendanceReportSummary {
  period: string
  totalActiveEmployees: number
  avgAttendanceRate: number
  totalLate: number
  totalAbsent: number
  items: AttendanceReportItem[]
}

export const initialAttendanceReport: AttendanceReportSummary = {
  period: "2026-08",
  totalActiveEmployees: 5,
  avgAttendanceRate: 96,
  totalLate: 5,
  totalAbsent: 2,
  items: [
    {
      employeeId: "USR-001",
      employeeName: "Budi Santoso",
      department: "Engineering",
      presentCount: 20,
      lateCount: 1,
      absentCount: 0,
      permitCount: 1,
      sickCount: 0,
      attendanceRate: 95,
    },
    {
      employeeId: "USR-002",
      employeeName: "Siti Rahma",
      department: "HR & Finance",
      presentCount: 22,
      lateCount: 0,
      absentCount: 0,
      permitCount: 0,
      sickCount: 0,
      attendanceRate: 100,
    },
    {
      employeeId: "USR-003",
      employeeName: "Andi Wijaya",
      department: "Sales & Marketing",
      presentCount: 19,
      lateCount: 3,
      absentCount: 0,
      permitCount: 0,
      sickCount: 0,
      attendanceRate: 100,
    },
    {
      employeeId: "USR-004",
      employeeName: "Rudi Hermawan",
      department: "Operations",
      presentCount: 20,
      lateCount: 1,
      absentCount: 1,
      permitCount: 0,
      sickCount: 0,
      attendanceRate: 95,
    },
    {
      employeeId: "USR-005",
      employeeName: "Dewi Lestari",
      department: "Design",
      presentCount: 20,
      lateCount: 0,
      absentCount: 1,
      permitCount: 0,
      sickCount: 1,
      attendanceRate: 91,
    },
  ],
}
