"use client"

import { useRouter } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { VacationRequestForm } from "@/components/vacation-requests/vacation-request-form"
import { useVacationRequestFormSubmit } from "@/hooks/use-vacation-request-form-submit"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function NewVacationRequestPage() {
  const router = useRouter()
  const { actingUserId, actingUser } = useActingUserStore()

  const isAdmin = actingUser?.role === "ADMIN"

  const { data: usersData } = useUsersQuery(
    isAdmin && actingUserId
      ? { actingUserId, size: 100, sort: "name,asc" }
      : null
  )
  const collaborators = usersData?.items.filter((u) => u.role !== "ADMIN")

  const { rootError, isPending, onSubmit } = useVacationRequestFormSubmit({
    mode: "create",
    actingUserId: actingUserId ?? undefined,
    isAdmin,
  })

  return (
    <>
      <PageHeader
        title="Novo Pedido de Férias"
        description="Preenche os campos para submeter um pedido."
      />
      <VacationRequestForm
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={() => router.replace("/vacation-requests")}
        collaborators={isAdmin ? (collaborators ?? []) : undefined}
        rootError={rootError}
      />
    </>
  )
}
