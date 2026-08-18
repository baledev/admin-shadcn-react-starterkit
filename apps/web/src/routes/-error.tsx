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
        <div className="max-w-lg w-full">
          <p className="text-sm text-muted-foreground font-mono bg-muted/40 p-2 rounded border border-border text-left overflow-x-auto text-[11px]">
            {message}
          </p>
          {import.meta.env.DEV && error?.stack ? (
            <pre className="mt-2 max-h-64 text-muted-foreground/80 font-mono bg-muted/40 p-2 rounded border border-border text-left overflow-auto text-[10px] whitespace-pre">
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
