import Link from "next/link"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { statusLabels, type VacationRequestStatus } from "@/types/api"
import type { VacationRequest } from "@/types/api"

type RecentVacationRequestsProps = {
  requests: VacationRequest[]
  title?: string
}

const statusToneStyles: Record<VacationRequestStatus, string> = {
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  APPROVED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  REJECTED:
    "border-destructive/30 bg-destructive/10 text-destructive dark:text-destructive",
  CANCELLED: "border-muted-foreground/30 bg-muted text-muted-foreground",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function RecentVacationRequests({
  requests,
  title = "Pedidos de férias recentes",
}: RecentVacationRequestsProps) {
  return (
    <section className="rounded-xl border bg-muted p-1 pt-0">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{title}</h2>
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="size-3.5 text-muted-foreground"
          />
        </div>

        <Link
          href="/vacation-requests"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Colaborador</th>
                <th className="px-4 py-3 font-semibold">Início</th>
                <th className="px-4 py-3 font-semibold">Fim</th>
                <th className="px-4 py-3 font-semibold">Dias</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  Última atualização
                </th>
                <th className="px-4 py-3 font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-medium">
                      {request.collaboratorName}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-4 py-3">{formatDate(request.endDate)}</td>
                    <td className="px-4 py-3">{request.inclusiveDays}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                          statusToneStyles[request.status]
                        )}
                      >
                        {statusLabels[request.status]}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {formatDateTime(request.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href="/vacation-requests"
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Ainda não existem pedidos para apresentar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
