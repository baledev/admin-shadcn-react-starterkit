import { Link, useRouter } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"

export function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-svh flex flex-col items-center justify-center p-4 bg-background text-center select-none">
      <div className="absolute font-sans text-[10rem] sm:text-[14rem] font-bold text-muted-foreground/[0.08] select-none pointer-events-none">
        404
      </div>
      <div className="relative flex flex-col items-center gap-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.history.back()}
          >
            Go Back
          </Button>
          <Button
            size="sm"
            render={<Link to="/dashboard" />}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
export default NotFoundPage
