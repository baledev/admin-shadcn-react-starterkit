import { createFileRoute, Outlet } from "@tanstack/react-router"

import { SettingsSideNav } from "@/components/settings-side-nav"

export const Route = createFileRoute("/_auth/settings")({
  component: SettingsLayout,
})

function SettingsLayout() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="w-full max-w-3xl">
            <div className="flex flex-col gap-8 md:flex-row">
              <SettingsSideNav />
              <div className="min-w-0 flex-1">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
