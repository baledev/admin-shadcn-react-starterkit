import * as React from "react"
export type DateRange = {
  from: Date | undefined
  to?: Date | undefined
}
import { DateRangePicker } from "@workspace/ui/components/date-range-picker"

interface ReportFilterBarProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  children?: React.ReactNode
  prependChildren?: React.ReactNode
}

export function ReportFilterBar({
  date,
  onDateChange,
  children,
  prependChildren,
}: ReportFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center">
      {prependChildren}
      <div className="w-full sm:w-64">
        <DateRangePicker
          date={date}
          onSelect={onDateChange}
          label="Periode Laporan"
          className="w-full"
        />
      </div>
      {children}
    </div>
  )
}
