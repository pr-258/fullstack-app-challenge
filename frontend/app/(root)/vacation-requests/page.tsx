"use client"

import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"
import { statusLabels } from "@/types/api"

export default function VacationRequestsPage() {
  const { actingUserId } = useActingUserStore()
  const { data, isLoading, isError, error } = useVacationRequestsQuery(
    actingUserId ? { actingUserId } : null
  )

  if (isLoading) return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (isError)
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Erro desconhecido"}
      </p>
    )

  const items = data?.items ?? []

  if (items.length === 0)
    return <p className="text-sm text-muted-foreground">Sem pedidos de férias.</p>

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-xs">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium text-left">Colaborador</th>
            <th className="px-3 py-2 font-medium text-left">Início</th>
            <th className="px-3 py-2 font-medium text-left">Fim</th>
            <th className="px-3 py-2 font-medium text-left">Dias</th>
            <th className="px-3 py-2 font-medium text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t transition-colors hover:bg-muted/50">
              <td className="px-3 py-2 font-medium">{item.collaboratorName}</td>
              <td className="px-3 py-2">{item.startDate}</td>
              <td className="px-3 py-2">{item.endDate}</td>
              <td className="px-3 py-2">{item.inclusiveDays}</td>
              <td className="px-3 py-2">{statusLabels[item.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
