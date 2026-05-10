"use client"

import { useState } from "react"

import Link from "next/link"

import { DetailDrawer } from "@/components/vacation-requests/detail-drawer"
import { VacationRequestsTable } from "@/components/vacation-requests/vacation-requests-table"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"
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

  const canEdit =
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

      <VacationRequestsTable
        requests={items}
        emptyMessage="Sem pedidos de férias."
        onView={setSelected}
      />

      <DetailDrawer
        request={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        actingUserId={actingUserId ?? undefined}
        canActOnRequests={canActOnRequests}
        canCancel={canCancel}
        canEdit={canEdit}
      />
    </>
  )
}
