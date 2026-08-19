import * as React from "react"
import { Link, useSearch } from "@tanstack/react-router"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { token } = useSearch({ from: "/_guest/reset-password" })
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get("password") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setError("")
    // TODO: call API with token and password
    console.log("Reset password:", { token, password })
    setSubmitted(true)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Set new password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          {!token && (
            <div className="mb-4 rounded-md border border-dashed border-muted-foreground/30 bg-muted p-3 text-center text-xs text-muted-foreground">
              Demo mode — no token in URL. Token validation is skipped.
            </div>
          )}
          {submitted ? (
            <div className="text-center text-sm text-muted-foreground">
              Your password has been reset.{" "}
              <Link
                to="/sign-in"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">New password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                  <FieldError>{error}</FieldError>
                </Field>
                <Field>
                  <Button type="submit">Reset password</Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Remember your password?{" "}
        <Link
          to="/sign-in"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Sign in
        </Link>
      </FieldDescription>
    </div>
  )
}
