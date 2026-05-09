"use client"

import { useState } from "react"

import Link from "next/link"

import { DetailDrawer } from "@/components/vacation-requests/detail-drawer"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
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

  const canCreate =
    actingUser?.role === "ADMIN" || actingUser?.role === "COLLABORATOR"

  const canCancel =
    selected !== null &&
    selected.status === "PENDING" &&
    (actingUser?.role === "ADMIN" || selected.collaboratorId === actingUserId)

  if (isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (isError)
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Erro desconhecido"}
      </p>
    )

  const items = data?.items ?? []

  return (
    <>
      <PageHeader
        title="Pedidos de Férias"
        description="Lista e gere os pedidos de férias."
        action={
          canCreate ? (
            <Button asChild size="lg">
              <Link href="/vacation-requests/new">Novo Pedido</Link>
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem pedidos de férias.</p>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-xs">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Colaborador</th>
                <th className="px-3 py-2 text-left font-medium">Início</th>
                <th className="px-3 py-2 text-left font-medium">Fim</th>
                <th className="px-3 py-2 text-left font-medium">Dias</th>
                <th className="px-3 py-2 text-left font-medium">Estado</th>
                <th className="px-3 py-2 text-left font-medium">Ações</th>
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(item)}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DetailDrawer
        request={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        actingUserId={actingUserId ?? undefined}
        canActOnRequests={canActOnRequests}
        canCancel={canCancel}
      />
    </>
  )
}
