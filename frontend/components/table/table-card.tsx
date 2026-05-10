import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

type TableCardProps = {
  title?: ReactNode
  description?: ReactNode
  titleIcon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

type TablePartProps = {
  children: ReactNode
  className?: string
}

export function TableCard({
  title,
  description,
  titleIcon,
  action,
  children,
  className,
}: TableCardProps) {
  const hasHeader = title || description || titleIcon || action

  return (
    <section className={cn("rounded-xl border bg-muted p-1", className)}>
      {hasHeader ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 space-y-1">
            {title || titleIcon ? (
              <div className="flex min-w-0 items-center gap-2">
                {title ? (
                  <h2 className="truncate text-sm font-semibold">{title}</h2>
                ) : null}
                {titleIcon}
              </div>
            ) : null}
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {action}
        </div>
      ) : null}

      {children}
    </section>
  )
}

export function TableCardToolbar({ children, className }: TablePartProps) {
  return <div className={cn("bg-muted px-2 py-3", className)}>{children}</div>
}

export function TableCardContent({ children, className }: TablePartProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card", className)}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

export function TableCardFooter({ children, className }: TablePartProps) {
  return <div className={cn("px-4 py-3", className)}>{children}</div>
}

export function Table({
  children,
  className,
  ...props
}: ComponentProps<"table">) {
  return (
    <table className={cn("w-full text-left text-xs", className)} {...props}>
      {children}
    </table>
  )
}

export function TableHeader({ children, className }: TablePartProps) {
  return (
    <thead className={cn("bg-muted/60 text-muted-foreground", className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TablePartProps) {
  return <tbody className={className}>{children}</tbody>
}

export function TableRow({ children, className }: TablePartProps) {
  return (
    <tr
      className={cn("border-t transition-colors hover:bg-muted/40", className)}
    >
      {children}
    </tr>
  )
}

export function TableHeadCell({ children, className }: ComponentProps<"th">) {
  return (
    <th className={cn("px-4 py-3 font-semibold", className)}>{children}</th>
  )
}

export function TableCell({ children, className }: ComponentProps<"td">) {
  return <td className={cn("px-4 py-3", className)}>{children}</td>
}

export function TableEmptyState({
  colSpan,
  children = "Sem dados para apresentar.",
}: {
  colSpan: number
  children?: ReactNode
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-8 text-center text-muted-foreground"
      >
        {children}
      </td>
    </tr>
  )
}
