import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Textarea } from "@workspace/ui/components/textarea"
import { TimePicker } from "./time-picker"
import {
  CATEGORY_OPTIONS,
  type ActivityCategory,
  type CalendarActivity,
} from "@/lib/calendar-data"

export function AddActivitySheet({
  open,
  onOpenChange,
  initialDate,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: string
  onAdd: (activity: CalendarActivity) => void
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [start, setStart] = React.useState("09:00")
  const [end, setEnd] = React.useState("10:00")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = String(form.get("title") ?? "")
    const category = String(form.get("category") ?? "task") as ActivityCategory
    const date = String(form.get("date") ?? "")
    const description = String(form.get("description") ?? "") || undefined

    setIsSubmitting(true)
    setTimeout(() => {
      onAdd({
        id: crypto.randomUUID(),
        title,
        category,
        date,
        start,
        end,
        description,
      })
      setIsSubmitting(false)
      onOpenChange(false)
    }, 400)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Activity</SheetTitle>
          <SheetDescription>
            Schedule a new activity on the calendar.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-title">Title</Label>
              <Input
                id="activity-title"
                name="title"
                placeholder="Sprint planning"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-category">Category</Label>
              <Select name="category" defaultValue="task">
                <SelectTrigger id="activity-category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-date">Date</Label>
              <Input
                id="activity-date"
                name="date"
                type="date"
                required
                defaultValue={initialDate}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="activity-start">Start</Label>
                <TimePicker
                  id="activity-start"
                  name="start"
                  value={start}
                  onChange={setStart}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="activity-end">End</Label>
                <TimePicker
                  id="activity-end"
                  name="end"
                  value={end}
                  onChange={setEnd}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="activity-description">Description</Label>
              <Textarea
                id="activity-description"
                name="description"
                placeholder="Optional notes"
                rows={4}
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Activity"}
            </Button>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Cancel
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}