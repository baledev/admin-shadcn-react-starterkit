import { Link, useRouter } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"

import { ErrorState } from "@/components/error-state"

export function NotFoundPage() {
  const router = useRouter()

  return (
    <ErrorState
      code="404"
      title="Page Not Found"
      description={
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you are looking for doesn't exist, has been removed, or is
          temporarily unavailable.
        </p>
      }
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.history.back()}
      >
        Go Back
      </Button>
      <Button size="sm" render={<Link to="/dashboard" />}>
        Go to Dashboard
      </Button>
    </ErrorState>
  )
}
