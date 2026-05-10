"use client"

import Link from "next/link"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { useVacationRequestsList } from "@/components/vacation-requests/use-vacation-requests-list"
import { VacationRequestDetailDrawer } from "@/components/vacation-requests/vacation-detail-drawer/vacation-detail-drawer"
import { VacationRequestsTableCard } from "@/components/vacation-requests/vacation-requests-table-card"

export default function VacationRequestsPage() {
  const {
    actingUserId,
    canCreate,
    selected,
    setSelected,
    requestsQuery,
    table,
    drawer,
  } = useVacationRequestsList()

  if (requestsQuery.isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (requestsQuery.isError)
    return (
      <p className="text-sm text-destructive">
        {requestsQuery.error instanceof Error
          ? requestsQuery.error.message
          : "Erro desconhecido"}
      </p>
    )

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

      <VacationRequestsTableCard {...table} />

      <VacationRequestDetailDrawer
        request={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        actingUserId={actingUserId ?? undefined}
        canActOnRequests={drawer.canActOnRequests}
        canCancel={drawer.canCancel}
        canEdit={drawer.canEdit}
      />
    </>
  )
}
