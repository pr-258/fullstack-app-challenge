"use client"

import { useRouter } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { UserForm } from "@/components/users/user-form"
import { useUserFormSubmit } from "@/components/users/use-user-form-submit"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function NewUserPage() {
  const router = useRouter()
  const { actingUserId } = useActingUserStore()

  const { data: managersData } = useUsersQuery(
    actingUserId ? { actingUserId, role: "MANAGER" } : null
  )
  const managers = managersData?.items ?? []

  const { rootError, isPending, onSubmit } = useUserFormSubmit({
    mode: "create",
    actingUserId: actingUserId ?? undefined,
  })

  return (
    <>
      <PageHeader
        title="Novo Colaborador"
        description="Preenche os campos para adicionar um colaborador."
      />
      <UserForm
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={() => router.replace("/users")}
        managers={managers}
        rootError={rootError}
      />
    </>
  )
}
