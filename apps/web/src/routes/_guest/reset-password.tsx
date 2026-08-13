import { createFileRoute } from "@tanstack/react-router"
import { GalleryVerticalEnd } from "lucide-react"

import { ResetPasswordForm } from "@/components/reset-password-form"
import { ThemeToggle } from "@/components/theme-toggle"

export const Route = createFileRoute("/_guest/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: String(search.token ?? ""),
  }),
})

function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
