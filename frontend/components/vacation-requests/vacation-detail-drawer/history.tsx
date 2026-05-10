import { DetailSection } from "@/components/details-drawer/detail-drawer-primitives"
import type { VacationRequest } from "@/types/api"
import { formatDateTime } from "@/lib/dates"

type HistoryProps = {
  request: VacationRequest
}

export function History({ request }: HistoryProps) {
  const items: HistoryItemData[] = [
    {
      title: "Pendente",
      description: "Pedido criado pelo colaborador.",
      timestamp: request.createdAt,
      tone: "pending",
    },
  ]

  if (request.status === "APPROVED") {
    items.push({
      title: "Aprovado",
      description: request.reviewedByName
        ? `Aprovado por ${request.reviewedByName}.`
        : "Pedido aprovado.",
      timestamp: request.reviewedAt,
      tone: "approved",
    })
  }

  if (request.status === "REJECTED") {
    items.push({
      title: "Rejeitado",
      description: request.rejectionReason ?? "Pedido rejeitado.",
      timestamp: request.reviewedAt,
      tone: "rejected",
    })
  }

  if (request.status === "CANCELLED") {
    items.push({
      title: "Cancelado",
      description: "Pedido cancelado.",
      timestamp: request.cancelledAt,
      tone: "cancelled",
    })
  }

  return (
    <DetailSection title="Histórico do pedido">
      <div className="space-y-0">
        {items.map((item, index) => (
          <HistoryItem
            key={item.title}
            title={item.title}
            description={item.description}
            timestamp={item.timestamp}
            tone={item.tone}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </DetailSection>
  )
}

type HistoryItemData = {
  title: string
  description: string
  timestamp?: string | null
  tone: "pending" | "approved" | "rejected" | "cancelled"
}

function HistoryItem({
  title,
  description,
  timestamp,
  tone,
  isLast,
}: HistoryItemData & { isLast: boolean }) {
  const toneClassName = {
    pending: "bg-amber-500",
    approved: "bg-primary",
    rejected: "bg-destructive",
    cancelled: "bg-muted-foreground",
  }[tone]

  return (
    <div className="grid grid-cols-[0.875rem_1fr] gap-3">
      <div className="relative flex justify-center">
        <span
          className={`mt-1 size-3 rounded-full ${toneClassName}`}
          aria-hidden="true"
        />
        {!isLast ? (
          <span
            className="absolute top-5 bottom-0 w-px bg-border"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="min-w-0 space-y-1 pb-5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(timestamp)}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
