import { createFileRoute } from "@tanstack/react-router"
import data from "@/lib/data.json"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactives"
import { DashboardDataTable } from "@/components/dashboard-data-table"

export const Route = createFileRoute("/_auth/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <ChartAreaInteractive />
          <DashboardDataTable data={data} />
        </div>
      </div>
    </div>
  )
}
