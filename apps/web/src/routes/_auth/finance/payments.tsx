import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { PaymentsDataTable } from "@/components/payments-data-table"
import {
  PaymentsFormSheet,
  type PaymentFormState,
} from "@/components/payments-form-sheet"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  type Payment,
  initialPayments,
  PAYMENT_DIRECTION_META,
  PAYMENT_STATUS_META,
  PAYMENT_METHOD_META,
} from "@/lib/payments-data"
import { initialAccounts, formatRupiah } from "@/lib/accounts-data"
import { IconDownload, IconPlus } from "@tabler/icons-react"

export const Route = createFileRoute("/_auth/finance/payments")({
  component: PaymentsPage,
})

function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>(initialPayments)
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(
    null
  )

  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const [formState, setFormState] = React.useState<PaymentFormState>({
    direction: "incoming",
    partnerName: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    method: "bank_transfer",
    accountCode: "1112", // BCA default
    reference: "",
    note: "",
  })

  const handleField = <K extends keyof PaymentFormState>(
    key: K,
    value: PaymentFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddPayment = () => {
    setFormState({
      direction: "incoming",
      partnerName: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      method: "bank_transfer",
      accountCode: "1112",
      reference: "",
      note: "",
    })
    setIsFormOpen(true)
  }

  const handleViewDetail = (pmt: Payment) => {
    setSelectedPayment(pmt)
    setIsDetailOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const acc = initialAccounts.find((a) => a.code === formState.accountCode)

    const newPmt: Payment = {
      id: `PMT-2026-0${payments.length + 1}`,
      direction: formState.direction,
      method: formState.method,
      amount: formState.amount,
      date: formState.date,
      accountCode: formState.accountCode,
      accountName: acc ? acc.name : "Akun Terhapus",
      partnerName: formState.partnerName,
      reference: formState.reference,
      status: "posted",
      note: formState.note,
    }

    setPayments([newPmt, ...payments])
    setIsFormOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Penerimaan & Pengeluaran Kas (Payments)"
            description="Daftar mutasi aliran dana masuk/keluar dari kas/bank atas pembayaran tagihan invoice, bill, kasbon, operasional."
          >
            <Button size="sm" onClick={handleAddPayment}>
              <IconPlus className="mr-2 size-4" />
              Catat Pembayaran
            </Button>
          </PageHeader>

          <PaymentsDataTable data={payments} onViewDetail={handleViewDetail} />
        </div>
      </div>

      <PaymentsFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={formState}
        accounts={initialAccounts}
        onField={handleField}
        onSave={handleSave}
      />

      {/* Detail Sheet */}
      {selectedPayment && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="font-mono">
                {selectedPayment.id}
              </SheetTitle>
              <SheetDescription>
                Tercatat pada {selectedPayment.date}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`ring-1 ${PAYMENT_STATUS_META[selectedPayment.status].chip}`}
                >
                  {PAYMENT_STATUS_META[selectedPayment.status].label}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Arah Aliran
                  </span>
                  <Badge
                    variant="outline"
                    className={`ring-1 ${PAYMENT_DIRECTION_META[selectedPayment.direction].chip}`}
                  >
                    {PAYMENT_DIRECTION_META[selectedPayment.direction].label}
                  </Badge>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Nominal
                  </span>
                  <span
                    className={`font-mono text-sm font-bold ${selectedPayment.direction === "outgoing" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}
                  >
                    {selectedPayment.direction === "outgoing" ? "-" : ""}
                    {formatRupiah(selectedPayment.amount)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Mitra / Partner
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedPayment.partnerName}
                  </p>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Metode Pembayaran
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {PAYMENT_METHOD_META[selectedPayment.method].label}
                  </p>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs text-muted-foreground">
                    Akun Kas/Bank
                  </span>
                  <p className="font-mono text-sm font-medium text-foreground">
                    {selectedPayment.accountCode} -{" "}
                    {selectedPayment.accountName}
                  </p>
                </div>
                {selectedPayment.reference && (
                  <div className="col-span-2">
                    <span className="mb-0.5 block text-xs text-muted-foreground">
                      Referensi Dokumen
                    </span>
                    <p className="font-mono text-sm font-medium text-foreground">
                      {selectedPayment.reference}
                    </p>
                  </div>
                )}
                {selectedPayment.note && (
                  <div className="col-span-2">
                    <span className="mb-0.5 block text-xs text-muted-foreground">
                      Catatan
                    </span>
                    <p className="text-sm font-medium text-muted-foreground">
                      {selectedPayment.note}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Journal entry preview */}
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                <span className="block font-semibold text-foreground">
                  Auto Journal Entry Preview:
                </span>
                {selectedPayment.direction === "incoming" ? (
                  <>
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Dr. Kas / Bank ({selectedPayment.accountCode})
                      </span>
                      <span className="font-mono">
                        {formatRupiah(selectedPayment.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between pl-4 text-muted-foreground">
                      <span>Cr. Piutang Usaha / Akun Terkait</span>
                      <span className="font-mono">
                        {formatRupiah(selectedPayment.amount)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Dr. Hutang Usaha / Beban Terkait</span>
                      <span className="font-mono">
                        {formatRupiah(selectedPayment.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between pl-4 text-muted-foreground">
                      <span>
                        Cr. Kas / Bank ({selectedPayment.accountCode})
                      </span>
                      <span className="font-mono">
                        {formatRupiah(selectedPayment.amount)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" variant="outline" size="sm">
                  <IconDownload className="mr-2 size-4" />
                  Cetak Bukti Bayar
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
