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
    <div className="min-h-svh flex flex-col items-center justify-center p-4 bg-background text-center select-none">
      <div
        aria-hidden="true"
        className="absolute font-sans text-[10rem] sm:text-[14rem] font-bold text-muted-foreground/[0.08] select-none pointer-events-none tabular-nums"
      >
        {code}
      </div>
      <div className="relative flex flex-col items-center gap-4 z-10">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description}
        {children ? (
          <div className="flex items-center gap-3 mt-4">{children}</div>
        ) : null}
      </div>
    </div>
  )
}
