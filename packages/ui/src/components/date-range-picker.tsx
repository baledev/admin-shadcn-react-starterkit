"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { IconCalendar } from "@tabler/icons-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

export function DatePickerWithRange({
  date: controlledDate,
  onSelect: controlledOnSelect,
  id,
  disabled,
  className,
  label = "Date Picker Range",
  showField = false,
}: {
  date?: DateRange
  onSelect?: (date: DateRange | undefined) => void
  id?: string
  disabled?: boolean
  className?: string
  label?: string
  showField?: boolean
} = {}) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    {
      from: new Date(new Date().getFullYear(), 0, 20),
      to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
    }
  )

  const date = controlledDate !== undefined ? controlledDate : internalDate
  const setDate = (d: DateRange | undefined) => {
    if (controlledOnSelect) {
      controlledOnSelect(d)
    } else {
      setInternalDate(d)
    }
  }

  const trigger = (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            id={id}
            disabled={disabled}
            className={cn(
              "w-full justify-start px-2.5 text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <IconCalendar data-icon="inline-start" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )

  if (showField) {
    return (
      <Field className="mx-auto w-60">
        <FieldLabel htmlFor={id || "date-picker-range"}>{label}</FieldLabel>
        {trigger}
      </Field>
    )
  }

  return trigger
}
