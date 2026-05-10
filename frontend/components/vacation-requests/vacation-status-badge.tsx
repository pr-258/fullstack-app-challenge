import {
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  RemoveCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { statusLabels, type VacationRequestStatus } from "@/types/api"

type VacationStatusBadgeProps = {
  status: VacationRequestStatus
}

const statusConfig = {
  PENDING: {
    icon: Clock01Icon,
    className: "text-amber-600 dark:text-amber-400",
  },
  APPROVED: {
    icon: CheckmarkCircle01Icon,
    className: "text-emerald-600 dark:text-emerald-400",
  },
  REJECTED: {
    icon: CancelCircleIcon,
    className: "text-destructive",
  },
  CANCELLED: {
    icon: RemoveCircleIcon,
    className: "text-muted-foreground",
  },
}

export function VacationStatusBadge({ status }: VacationStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-xs font-semibold",
        config.className
      )}
    >
      <HugeiconsIcon
        icon={config.icon}
        strokeWidth={2}
        className="size-3.5 shrink-0"
      />
      {statusLabels[status]}
    </span>
  )
}
