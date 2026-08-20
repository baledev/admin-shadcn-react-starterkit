import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { KasbonDataTable } from "@/components/kasbon-data-table"
import {
  type Kasbon,
  type KasbonRepayment,
  initialKasbons,
  KASBON_STATUS_META,
  REPAYMENT_TYPE_OPTIONS,
} from "@/lib/kasbon-data"
import {
  KasbonFormSheet,
  type KasbonFormState,
} from "@/components/kasbon-form-sheet"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@workspace/ui/components/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { formatRupiah } from "@/lib/accounts-data"
import { IconPlus } from "@tabler/icons-react"
import { initialTeamMembers } from "@/lib/team-data"
import { DatePicker } from "@workspace/ui/components/date-picker"
import { parseIso, toIsoDate } from "@/lib/date-utils"

export const Route = createFileRoute("/_auth/finance/transactions/kasbon")({
  component: KasbonPage,
})

function KasbonPage() {
  const [kasbons, setKasbons] = React.useState<Kasbon[]>(initialKasbons)
  const [selectedKasbon, setSelectedKasbon] = React.useState<Kasbon | null>(
    null
  )
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isRepayOpen, setIsRepayOpen] = React.useState(false)

  // Kasbon form
  const [formState, setFormState] = React.useState<KasbonFormState>({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    purpose: "",
    notes: "",
  })

  // Repayment form
  const [repayAmount, setRepayAmount] = React.useState<number>(0)
  const [repayType, setRepayType] = React.useState<
    "payroll_deduction" | "cash"
  >("cash")
  const [repayDate, setRepayDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [repayNote, setRepayNote] = React.useState<string>("")

  const handleField = <K extends keyof KasbonFormState>(
    key: K,
    value: KasbonFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleViewDetail = (kasbon: Kasbon) => {
    setSelectedKasbon(kasbon)
    setIsDetailOpen(true)
  }

  const handleAddKasbon = () => {
    setFormState({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      purpose: "",
      notes: "",
    })
    setIsFormOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const member = initialTeamMembers.find((m) => m.id === formState.employeeId)
    if (!member) return

    const newKasbon: Kasbon = {
      id: `KSB-2026-0${kasbons.length + 1}`,
      employeeId: formState.employeeId,
      employeeName: member.name,
      employeeEmail: `${member.name.toLowerCase().replace(" ", "")}@company.com`,
      date: formState.date,
      amount: formState.amount,
      remainingAmount: formState.amount,
      purpose: formState.purpose,
      status: "active", // default active directly
      repayments: [],
      notes: formState.notes,
    }

    setKasbons([newKasbon, ...kasbons])
    setIsFormOpen(false)
  }

  const handleRecordRepayment = (kasbon: Kasbon) => {
    setSelectedKasbon(kasbon)
    setRepayAmount(Math.min(1000000, kasbon.remainingAmount)) // default propose 1 mil or remaining
    setRepayType("cash")
    setRepayDate(new Date().toISOString().split("T")[0])
    setRepayNote("")
    setIsRepayOpen(true)
  }

  const handleSaveRepayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedKasbon) return

    const repayment: KasbonRepayment = {
      id: `PAY-KSB-0${Date.now().toString().slice(-4)}`,
      date: repayDate,
      amount: repayAmount,
      type: repayType,
      note:
        repayNote ||
        (repayType === "payroll_deduction"
          ? "Potongan slip gaji"
          : "Pelunasan tunai transfer"),
    }

    const updatedRemaining = Math.max(
      0,
      selectedKasbon.remainingAmount - repayAmount
    )
    const updatedStatus =
      updatedRemaining === 0 ? ("paid" as const) : ("active" as const)

    const updatedKasbon = {
      ...selectedKasbon,
      remainingAmount: updatedRemaining,
      status: updatedStatus,
      repayments: [...selectedKasbon.repayments, repayment],
    }

    setKasbons(
      kasbons.map((k) => (k.id === selectedKasbon.id ? updatedKasbon : k))
    )
    setSelectedKasbon(updatedKasbon)
    setIsRepayOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Kasbon & Pinjaman Karyawan (Receivables)
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola pengajuan kasbon, history cicilan pelunasan tunai, maupun
            potongan payroll bulanan.
          </p>
        </div>
        <Button size="sm" onClick={handleAddKasbon}>
          <IconPlus className="mr-2 size-4" />
          Pengajuan Kasbon
        </Button>
      </div>

      <KasbonDataTable
        data={kasbons}
        onViewDetail={handleViewDetail}
        onRecordRepayment={handleRecordRepayment}
      />

      <KasbonFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={formState}
        onField={handleField}
        onSave={handleSave}
      />

      {/* Repayment Form Sheet */}
      {selectedKasbon && (
        <Sheet open={isRepayOpen} onOpenChange={setIsRepayOpen}>
          <SheetContent className="flex h-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Catat Pembayaran Cicilan</SheetTitle>
              <SheetDescription>
                Record cicilan pelunasan kasbon untuk{" "}
                {selectedKasbon.employeeName}.
              </SheetDescription>
            </SheetHeader>

            <form
              onSubmit={handleSaveRepayment}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
                <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Kasbon:</span>
                    <span className="font-mono font-semibold">
                      {selectedKasbon.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Kasbon:</span>
                    <span className="font-semibold">
                      {formatRupiah(selectedKasbon.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-amber-600 dark:text-amber-400">
                    <span className="font-medium">Sisa Tagihan:</span>
                    <span className="font-mono font-bold">
                      {formatRupiah(selectedKasbon.remainingAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Tanggal Pembayaran</Label>
                  <DatePicker
                    date={repayDate ? parseIso(repayDate) : undefined}
                    onSelect={(date) => {
                      if (date) setRepayDate(toIsoDate(date))
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="repay-amount">Nominal Cicilan (Rp)</Label>
                  <Input
                    id="repay-amount"
                    type="number"
                    placeholder="0"
                    value={repayAmount || ""}
                    onChange={(e) => setRepayAmount(Number(e.target.value))}
                    required
                    max={selectedKasbon.remainingAmount}
                    min="50000"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="repay-type">Metode Pembayaran</Label>
                  <Select
                    value={repayType}
                    onValueChange={(val) => {
                      if (val) setRepayType(val as "payroll_deduction" | "cash")
                    }}
                  >
                    <SelectTrigger id="repay-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REPAYMENT_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="repay-note">Catatan</Label>
                  <Input
                    id="repay-note"
                    placeholder="E.g., Transfer Mandiri, slip gaji Feb"
                    value={repayNote}
                    onChange={(e) => setRepayNote(e.target.value)}
                  />
                </div>

                {/* Journal entry preview indicator */}
                <div className="space-y-1 rounded-lg border border-border bg-muted/40 p-3 text-xs leading-normal text-muted-foreground">
                  <span className="mb-1 block font-semibold text-foreground">
                    Preview Auto Double-Entry:
                  </span>
                  <div className="flex justify-between font-mono">
                    <span>
                      Dr.{" "}
                      {repayType === "payroll_deduction"
                        ? "Beban Gaji (5210)"
                        : "Kas/Bank (1112)"}
                    </span>
                    <span>{formatRupiah(repayAmount)}</span>
                  </div>
                  <div className="flex justify-between pl-4 font-mono">
                    <span>Cr. Piutang Karyawan (1130)</span>
                    <span>{formatRupiah(repayAmount)}</span>
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-auto border-t border-border pt-4">
                <Button type="submit">Catat Pelunasan</Button>
                <SheetClose render={<Button variant="outline" type="button" />}>
                  Batal
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      )}

      {/* Kasbon Detail Sheet */}
      {selectedKasbon && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="flex h-full flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">{selectedKasbon.id}</SheetTitle>
              <SheetDescription>
                Diajukan pada {selectedKasbon.date}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`ring-1 ${KASBON_STATUS_META[selectedKasbon.status].chip}`}
                >
                  {KASBON_STATUS_META[selectedKasbon.status].label}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Karyawan</h4>
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium text-foreground">
                    {selectedKasbon.employeeName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedKasbon.employeeEmail}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Plafon Kasbon
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {formatRupiah(selectedKasbon.amount)}
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Sisa Tagihan
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
                    {formatRupiah(selectedKasbon.remainingAmount)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Tujuan / Keperluan
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {selectedKasbon.purpose}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Repayments History */}
              <div>
                <h4 className="mb-2 text-sm font-semibold">
                  Histori Pembayaran Cicilan
                </h4>
                {selectedKasbon.repayments.length === 0 ? (
                  <p className="rounded-md bg-muted/20 p-3 text-center text-xs text-muted-foreground italic">
                    Belum ada pembayaran cicilan dicatat.
                  </p>
                ) : (
                  <div className="max-h-[150px] space-y-2 overflow-y-auto pr-1">
                    {selectedKasbon.repayments.map((rep) => (
                      <div
                        key={rep.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/10 p-2.5 text-xs"
                      >
                        <div>
                          <p className="font-mono font-semibold text-foreground">
                            {rep.id}
                          </p>
                          <p className="text-[10px] text-muted-foreground tabular-nums">
                            {rep.date} •{" "}
                            {rep.type === "payroll_deduction"
                              ? "Potong Gaji"
                              : "Transfer"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {formatRupiah(rep.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Journal entry preview */}
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                <span className="block font-semibold text-foreground">
                  Auto Journal Entry Preview (Disbursement):
                </span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dr. Piutang Karyawan (1130)</span>
                  <span className="font-mono">
                    {formatRupiah(selectedKasbon.amount)}
                  </span>
                </div>
                <div className="flex justify-between pl-4 text-muted-foreground">
                  <span>Cr. Kas Tunai / Bank (1111/1112)</span>
                  <span className="font-mono">
                    {formatRupiah(selectedKasbon.amount)}
                  </span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
