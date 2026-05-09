"use client"

import { useState } from "react"

import { ActionButtons } from "@/components/vacation-requests/action-buttons"
import { DetailDrawer } from "@/components/vacation-requests/detail-drawer"
import { Button } from "@/components/ui/button"
import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"
import { statusLabels } from "@/types/api"
import type { VacationRequest } from "@/types/api"

export default function VacationRequestsPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const { data, isLoading, isError, error } = useVacationRequestsQuery(
    actingUserId ? { actingUserId } : null
  )

  const [selected, setSelected] = useState<VacationRequest | null>(null)

  const canActOnRequests =
    actingUser?.role === "ADMIN" || actingUser?.role === "MANAGER"

  if (isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

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
    <>
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium text-left">Colaborador</th>
              <th className="px-3 py-2 font-medium text-left">Início</th>
              <th className="px-3 py-2 font-medium text-left">Fim</th>
              <th className="px-3 py-2 font-medium text-left">Dias</th>
              <th className="px-3 py-2 font-medium text-left">Estado</th>
              <th className="px-3 py-2 font-medium text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t transition-colors hover:bg-muted/50"
              >
                <td className="px-3 py-2 font-medium">{item.collaboratorName}</td>
                <td className="px-3 py-2">{item.startDate}</td>
                <td className="px-3 py-2">{item.endDate}</td>
                <td className="px-3 py-2">{item.inclusiveDays}</td>
                <td className="px-3 py-2">{statusLabels[item.status]}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(item)}
                    >
                      Ver
                    </Button>
                    {canActOnRequests && (
                      <ActionButtons
                        id={item.id}
                        status={item.status}
                        actingUserId={actingUserId!}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailDrawer
        request={selected}
        open={selected !== null}
        onOpenChange={(open) => { if (!open) setSelected(null) }}
      />
    </>
  )
}
