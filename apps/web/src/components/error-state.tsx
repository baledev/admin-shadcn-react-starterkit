import * as React from "react"

interface ErrorStateProps {
  code: string
  title: string
  description?: React.ReactNode
  children?: React.ReactNode
}

export function ErrorState({
  code,
  title,
  description,
  children,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4 text-center select-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute font-sans text-[10rem] font-bold text-muted-foreground/[0.08] tabular-nums select-none sm:text-[14rem]"
      >
        {code}
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description}
        {children ? (
          <div className="mt-4 flex items-center gap-3">{children}</div>
        ) : null}
      </div>
    </div>
  )
}
