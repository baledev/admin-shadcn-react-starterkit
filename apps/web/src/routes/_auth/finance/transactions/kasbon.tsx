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
import { KasbonFormSheet, type KasbonFormState } from "@/components/kasbon-form-sheet"
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
} from "@workspace/ui/components/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { formatRupiah } from "@/lib/accounts-data"
import { initialTeamMembers } from "@/lib/team-data"
import { DatePicker } from "@workspace/ui/components/date-picker"
import { parseIso, toIsoDate } from "@/lib/date-utils"

export const Route = createFileRoute("/_auth/finance/transactions/kasbon")({
  component: KasbonPage,
})

function KasbonPage() {
  const [kasbons, setKasbons] = React.useState<Kasbon[]>(initialKasbons)
  const [selectedKasbon, setSelectedKasbon] = React.useState<Kasbon | null>(null)
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
  const [repayType, setRepayType] = React.useState<"payroll_deduction" | "cash">("cash")
  const [repayDate, setRepayDate] = React.useState<string>(new Date().toISOString().split("T")[0])
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
      note: repayNote || (repayType === "payroll_deduction" ? "Potongan slip gaji" : "Pelunasan tunai transfer"),
    }

    const updatedRemaining = Math.max(0, selectedKasbon.remainingAmount - repayAmount)
    const updatedStatus = updatedRemaining === 0 ? "paid" as const : "active" as const

    const updatedKasbon = {
      ...selectedKasbon,
      remainingAmount: updatedRemaining,
      status: updatedStatus,
      repayments: [...selectedKasbon.repayments, repayment],
    }

    setKasbons(kasbons.map((k) => (k.id === selectedKasbon.id ? updatedKasbon : k)))
    setSelectedKasbon(updatedKasbon)
    setIsRepayOpen(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Kasbon & Pinjaman Karyawan (Receivables)</h3>
        <p className="text-sm text-muted-foreground">Kelola pengajuan kasbon, history cicilan pelunasan tunai, maupun potongan payroll bulanan.</p>
      </div>

      <KasbonDataTable
        data={kasbons}
        onAddKasbon={handleAddKasbon}
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
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Catat Pembayaran Cicilan</SheetTitle>
              <SheetDescription>Record cicilan pelunasan kasbon untuk {selectedKasbon.employeeName}.</SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSaveRepayment} className="space-y-4 mt-6">
              <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Kasbon:</span>
                  <span className="font-semibold font-mono">{selectedKasbon.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Kasbon:</span>
                  <span className="font-semibold">{formatRupiah(selectedKasbon.amount)}</span>
                </div>
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span className="font-medium">Sisa Tagihan:</span>
                  <span className="font-bold font-mono">{formatRupiah(selectedKasbon.remainingAmount)}</span>
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
                  onValueChange={(val: "payroll_deduction" | "cash") => setRepayType(val)}
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
              <div className="bg-muted/40 rounded-lg p-3 border border-border text-xs text-muted-foreground leading-normal space-y-1">
                <span className="font-semibold block text-foreground mb-1">Preview Auto Double-Entry:</span>
                <div className="flex justify-between font-mono">
                  <span>Dr. {repayType === "payroll_deduction" ? "Beban Gaji (5210)" : "Kas/Bank (1112)"}</span>
                  <span>{formatRupiah(repayAmount)}</span>
                </div>
                <div className="flex justify-between font-mono pl-4">
                  <span>Cr. Piutang Karyawan (1130)</span>
                  <span>{formatRupiah(repayAmount)}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setIsRepayOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">Catat Pelunasan</Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      )}

      {/* Kasbon Detail Sheet */}
      {selectedKasbon && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">{selectedKasbon.id}</SheetTitle>
              <SheetDescription>Diajukan pada {selectedKasbon.date}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={`ring-1 ${KASBON_STATUS_META[selectedKasbon.status].chip}`}>
                  {KASBON_STATUS_META[selectedKasbon.status].label}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Karyawan</h4>
                <div className="text-sm bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-foreground">{selectedKasbon.employeeName}</p>
                  <p className="text-muted-foreground text-xs">{selectedKasbon.employeeEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Plafon Kasbon</span>
                  <span className="text-sm font-semibold font-mono text-foreground">
                    {formatRupiah(selectedKasbon.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Sisa Tagihan</span>
                  <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                    {formatRupiah(selectedKasbon.remainingAmount)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block mb-0.5">Tujuan / Keperluan</span>
                  <p className="text-sm text-foreground font-medium">{selectedKasbon.purpose}</p>
                </div>
              </div>

              <Separator />

              {/* Repayments History */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Histori Pembayaran Cicilan</h4>
                {selectedKasbon.repayments.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-md text-center">
                    Belum ada pembayaran cicilan dicatat.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {selectedKasbon.repayments.map((rep) => (
                      <div key={rep.id} className="flex justify-between items-center text-xs border border-border p-2.5 rounded-lg bg-muted/10">
                        <div>
                          <p className="font-semibold text-foreground font-mono">{rep.id}</p>
                          <p className="text-muted-foreground text-[10px] tabular-nums">{rep.date} • {rep.type === "payroll_deduction" ? "Potong Gaji" : "Transfer"}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {formatRupiah(rep.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Journal entry preview */}
              <div className="rounded-lg border border-border p-3 text-xs bg-muted/20 space-y-1.5">
                <span className="font-semibold block text-foreground">Auto Journal Entry Preview (Disbursement):</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dr. Piutang Karyawan (1130)</span>
                  <span className="font-mono">{formatRupiah(selectedKasbon.amount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pl-4">
                  <span>Cr. Kas Tunai / Bank (1111/1112)</span>
                  <span className="font-mono">{formatRupiah(selectedKasbon.amount)}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
