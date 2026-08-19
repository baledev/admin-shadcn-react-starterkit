import * as React from "react"

import { Button } from "@workspace/ui/components/button"

import { ErrorState } from "@/components/error-state"

interface AppErrorBoundaryProps {
  children: React.ReactNode
}

interface AppErrorBoundaryState {
  error: Error | null
}

/**
 * Last-resort boundary for crashes that happen outside the router (theme
 * provider, RouterProvider itself). Router-level errors are handled by
 * `defaultErrorComponent` in `@/router`.
 */
export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error(error, info.componentStack)
    }
  }

  render() {
    const { error } = this.state

    if (!error) return this.props.children

    return (
      <ErrorState
        code="500"
        title="Something went wrong"
        description={
          <p className="max-w-lg overflow-x-auto rounded border border-border bg-muted/40 p-2 text-left font-mono text-sm text-[11px] text-muted-foreground">
            {error.message || "An unexpected error occurred."}
          </p>
        }
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
        <Button size="sm" render={<a href="/dashboard" />}>
          Go to Dashboard
        </Button>
      </ErrorState>
    )
  }
}
