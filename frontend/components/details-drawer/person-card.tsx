import type { ReactNode } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/text"

type PersonCardProps = {
  label: string
  name?: string | null
  description?: ReactNode
  className?: string
}

export function PersonCard({
  label,
  name,
  description,
  className,
}: PersonCardProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <Avatar size="lg">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name ?? "-"}</p>
          {description ? (
            <p className="truncate text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
