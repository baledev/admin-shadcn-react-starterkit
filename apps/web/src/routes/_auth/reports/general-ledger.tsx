import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { type DateRange } from "@/components/reports/report-filter-bar"
import { PageHeader } from "@/components/page-header"
import { ReportExportButton } from "@/components/reports/report-export-button"
import { ReportFilterBar } from "@/components/reports/report-filter-bar"
import { GeneralLedgerTable } from "@/components/reports/general-ledger-table"
import { initialGeneralLedger } from "@/lib/general-ledger-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

export const Route = createFileRoute("/_auth/reports/general-ledger")({
  component: GeneralLedgerPage,
})

function GeneralLedgerPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  })

  const [selectedAccount, setSelectedAccount] = React.useState<string>(initialGeneralLedger[0]?.accountCode || "")
  const activeLedger = initialGeneralLedger.find((l) => l.accountCode === selectedAccount)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Laporan Buku Besar (General Ledger)"
            description="Detail catatan transaksi keuangan historis untuk masing-masing akun perkiraan dalam periode akuntansi tertentu."
          >
            <ReportExportButton />
          </PageHeader>

          <ReportFilterBar
            date={date}
            onDateChange={setDate}
            prependChildren={
              <div className="w-full sm:w-72">
                <Select value={selectedAccount} onValueChange={(val) => val && setSelectedAccount(val)}>
                  <SelectTrigger render={<button type="button" />}>
                    <SelectValue placeholder="Pilih Akun" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialGeneralLedger.map((l) => (
                      <SelectItem key={l.accountCode} value={l.accountCode}>
                        {l.accountCode} - {l.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            }
          />

          <GeneralLedgerTable activeLedger={activeLedger} />
        </div>
      </div>
    </div>
  )
}
