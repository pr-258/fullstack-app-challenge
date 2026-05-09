"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { VacationRequestForm } from "@/components/vacation-requests/vacation-request-form"
import { ApiError } from "@/api/client/fetcher"
import {
  useVacationRequestQuery,
  useUpdateVacationRequestMutation,
} from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function EditVacationRequestPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { actingUserId } = useActingUserStore()
  const [rootError, setRootError] = useState<string>()

  const { data: request, isLoading } = useVacationRequestQuery(id, actingUserId)
  const update = useUpdateVacationRequestMutation(id, actingUserId!)

  function onSubmit(values: {
    startDate: string
    endDate: string
    reason?: string
  }) {
    update.mutate(
      {
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason || null,
      },
      {
        onSuccess: () => router.replace("/vacation-requests"),
        onError: (err) => {
          const message =
            err instanceof ApiError && err.code === "VACATION_OVERLAP"
              ? "Já existe um pedido de férias aprovado neste período."
              : err instanceof Error
                ? err.message
                : "Erro desconhecido"

          setRootError(message)
        },
      }
    )
  }

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
        isPending={update.isPending}
        onCancel={() => router.replace("/vacation-requests")}
        submitLabel="Guardar"
        rootError={rootError}
      />
    </>
  )
}
