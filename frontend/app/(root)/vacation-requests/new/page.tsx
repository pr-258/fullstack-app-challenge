"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { VacationRequestForm } from "@/components/vacation-requests/vacation-request-form"
import { ApiError } from "@/api/client/fetcher"
import { useCreateVacationRequestMutation } from "@/queries/vacation-requests"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function NewVacationRequestPage() {
  const router = useRouter()
  const { actingUserId, actingUser } = useActingUserStore()
  const [rootError, setRootError] = useState<string>()

  const isAdmin = actingUser?.role === "ADMIN"

  const { data: usersData } = useUsersQuery(
    isAdmin && actingUserId ? { actingUserId, size: 100, sort: "name,asc" } : null
  )
  const collaborators = usersData?.items.filter((u) => u.role !== "ADMIN")

  const create = useCreateVacationRequestMutation(actingUserId!)

  function onSubmit(values: {
    startDate: string
    endDate: string
    reason?: string
    collaboratorId?: string
  }) {
    const payload = {
      collaboratorId: isAdmin ? values.collaboratorId! : actingUserId!,
      startDate: values.startDate,
      endDate: values.endDate,
      reason: values.reason || null,
    }

    create.mutate(payload, {
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
    })
  }

  return (
    <>
      <PageHeader
        title="Novo Pedido de Férias"
        description="Preenche os campos para submeter um pedido."
      />
      <VacationRequestForm
        onSubmit={onSubmit}
        isPending={create.isPending}
        onCancel={() => router.replace("/vacation-requests")}
        collaborators={isAdmin ? (collaborators ?? []) : undefined}
        rootError={rootError}
      />
    </>
  )
}
