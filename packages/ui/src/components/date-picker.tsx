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

export function DatePickerSimple({
  date: controlledDate,
  onSelect: controlledOnSelect,
  placeholder = "Select date",
  id,
  disabled,
  className,
  label = "Date of birth",
  showField = false,
}: {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  id?: string
  disabled?: boolean
  className?: string
  label?: string
  showField?: boolean
} = {}) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    undefined
  )

  const date = controlledDate !== undefined ? controlledDate : internalDate
  const setDate = (d: Date | undefined) => {
    if (controlledOnSelect) {
      controlledOnSelect(d)
    } else {
      setInternalDate(d)
    }
  }

  const trigger = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            id={id}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <IconCalendar data-icon="inline-start" className="mr-2 size-4" />
            {date ? date.toLocaleDateString() : placeholder}
          </Button>
        }
      />
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date || new Date()}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )

  if (showField) {
    return (
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor={id || "date"}>{label}</FieldLabel>
        {trigger}
      </Field>
    )
  }

  return trigger
}

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
