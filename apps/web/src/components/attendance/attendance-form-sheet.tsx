import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { initialTeamMembers } from "@/lib/team-data"
import { STATUS_OPTIONS, type AttendanceStatus } from "@/lib/attendance-data"

export type AttendanceFormState = {
  employeeId: string
  date: string
  status: AttendanceStatus
  checkIn: string
  checkOut: string
  note: string
}

interface AttendanceFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  form: AttendanceFormState
  onField: <K extends keyof AttendanceFormState>(
    key: K,
    value: AttendanceFormState[K]
  ) => void
  onSave: (e: React.FormEvent) => void
}

export function AttendanceFormSheet({
  open,
  onOpenChange,
  isEditing,
  form,
  onField,
  onSave,
}: AttendanceFormSheetProps) {
  const isNoteRequired =
    form.status === "sick" ||
    form.status === "permission" ||
    form.status === "leave"
  const isTimeFieldsVisible =
    form.status === "present" || form.status === "late"

  // Get initials for Avatar Fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Ubah Kehadiran" : "Catat Kehadiran Manual"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Ubah data absensi karyawan terpilih."
              : "Masukkan record kehadiran untuk karyawan secara manual."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSave}
          className="flex flex-1 flex-col justify-between overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
            {/* Karyawan Selection */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-employee">Karyawan</Label>
              <Select
                value={form.employeeId}
                onValueChange={(val) => onField("employeeId", val || "")}
                disabled={isEditing}
              >
                <SelectTrigger id="attendance-employee" className="w-full">
                  <SelectValue placeholder="Pilih Karyawan" />
                </SelectTrigger>
                <SelectContent>
                  {initialTeamMembers.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarImage src={emp.avatarUrl} alt={emp.name} />
                          <AvatarFallback className="text-[8px]">
                            {getInitials(emp.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{emp.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Picker */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-date">Tanggal</Label>
              <Input
                id="attendance-date"
                type="date"
                value={form.date}
                onChange={(e) => onField("date", e.target.value)}
                required
                disabled={isEditing}
              />
            </div>

            {/* Status Select */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-status">Status Kehadiran</Label>
              <Select
                value={form.status}
                onValueChange={(val) => {
                  if (val) onField("status", val as AttendanceStatus)
                }}
              >
                <SelectTrigger id="attendance-status" className="w-full">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Picker Row (Check-in & Check-out) */}
            {isTimeFieldsVisible && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="attendance-checkin">Jam Masuk</Label>
                  <Input
                    id="attendance-checkin"
                    type="time"
                    value={form.checkIn}
                    onChange={(e) => onField("checkIn", e.target.value)}
                    required={isTimeFieldsVisible}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="attendance-checkout">Jam Keluar</Label>
                  <Input
                    id="attendance-checkout"
                    type="time"
                    value={form.checkOut}
                    onChange={(e) => onField("checkOut", e.target.value)}
                    required={isTimeFieldsVisible}
                  />
                </div>
              </div>
            )}

            {/* Note / Keterangan */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-note">
                Keterangan{" "}
                {isNoteRequired && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="attendance-note"
                value={form.note}
                onChange={(e) => onField("note", e.target.value)}
                placeholder={
                  isNoteRequired
                    ? "Wajib menuliskan alasan (misal: sakit demam flu, izin acara keluarga, dll)"
                    : "Tambahkan catatan jika diperlukan..."
                }
                className="min-h-24 resize-none"
                required={isNoteRequired}
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">
              {isEditing ? "Simpan Perubahan" : "Simpan Kehadiran"}
            </Button>
            <SheetClose render={<Button type="button" variant="outline" />}>
              Batal
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
