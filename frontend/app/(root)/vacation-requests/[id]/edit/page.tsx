"use client"

import { useParams, useRouter } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { VacationRequestForm } from "@/components/vacation-requests/vacation-request-form"
import { useVacationRequestFormSubmit } from "@/hooks/use-vacation-request-form-submit"
import { useVacationRequestQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function EditVacationRequestPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { actingUserId } = useActingUserStore()

  const { data: request, isLoading } = useVacationRequestQuery(id, actingUserId)
  const { rootError, isPending, onSubmit } = useVacationRequestFormSubmit({
    mode: "edit",
    requestId: id,
    actingUserId: actingUserId ?? undefined,
  })

  if (isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (!request)
    return <p className="text-sm text-destructive">Pedido não encontrado.</p>

  return (
    <>
      <PageHeader
        title="Editar Pedido de Férias"
        description="Altera os dados do pedido e submete."
      />
      <VacationRequestForm
        defaultValues={{
          startDate: request.startDate,
          endDate: request.endDate,
          reason: request.reason ?? "",
        }}
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={() => router.replace("/vacation-requests")}
        submitLabel="Guardar"
        rootError={rootError}
      />
    </>
  )
}
