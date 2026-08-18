import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, subtitle, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <div>
        {subtitle && (
          <p className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {subtitle}
          </p>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
