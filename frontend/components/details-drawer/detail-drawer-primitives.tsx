import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type DetailSectionProps = {
  title?: string
  children: ReactNode
  className?: string
}

export function DetailSection({
  title,
  children,
  className,
}: DetailSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {title ? (
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      ) : null}
      {children}
    </section>
  )
}

type DetailGridProps = {
  children: ReactNode
  className?: string
}

export function DetailGrid({ children, className }: DetailGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>{children}</div>
  )
}

type DetailFieldProps = {
  label: string
  value: ReactNode
  className?: string
}

export function DetailField({ label, value, className }: DetailFieldProps) {
  return (
    <div className={cn("min-w-0 space-y-1", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-words text-sm text-foreground">{value ?? "-"}</p>
    </div>
  )
}

type DrawerActionBarProps = {
  children: ReactNode
  className?: string
}

export function DrawerActionBar({ children, className }: DrawerActionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-y bg-muted/50 px-4 py-3",
        className
      )}
    >
      {children}
    </div>
  )
}
