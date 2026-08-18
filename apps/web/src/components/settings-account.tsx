import { Button } from "@workspace/ui/components/button"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Switch } from "@workspace/ui/components/switch"
import { PageHeader } from "@/components/page-header"

export function SettingsAccount() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Account"
        description="Manage your password and account security."
      />
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-sm font-semibold tracking-tight">
          Password
        </h2>
        <Field>
          <FieldLabel htmlFor="current">Current password</FieldLabel>
          <Input id="current" type="password" placeholder="••••••••" />
        </Field>
        <Field>
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <Input id="new-password" type="password" placeholder="••••••••" />
        </Field>
      </div>
      <Separator />
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            Two-factor authentication
          </span>
          <span className="text-xs text-muted-foreground">
            Add an extra layer of security to your account.
          </span>
        </div>
        <Switch aria-label="Two-factor authentication" />
      </div>
      <div className="mt-2">
        <Button>Save changes</Button>
      </div>
    </div>
  )
}
