import { Link, type ErrorComponentProps } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"

import { ErrorState } from "@/components/error-state"

export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const message = error?.message || "An unexpected error occurred."

  return (
    <ErrorState
      code="500"
      title="Something went wrong"
      description={
        <div className="w-full max-w-lg">
          <p className="overflow-x-auto rounded border border-border bg-muted/40 p-2 text-left font-mono text-sm text-[11px] text-muted-foreground">
            {message}
          </p>
          {import.meta.env.DEV && error?.stack ? (
            <pre className="mt-2 max-h-64 overflow-auto rounded border border-border bg-muted/40 p-2 text-left font-mono text-[10px] whitespace-pre text-muted-foreground/80">
              {error.stack}
            </pre>
          ) : null}
        </div>
      }
    >
      <Button variant="outline" size="sm" onClick={() => reset()}>
        Retry
      </Button>
      <Button size="sm" render={<Link to="/dashboard" />}>
        Go to Dashboard
      </Button>
    </ErrorState>
  )
}
