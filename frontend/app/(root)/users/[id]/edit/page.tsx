"use client"

import { useParams, useRouter } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { UserForm } from "@/components/users/user-form"
import { useUserFormSubmit } from "@/components/users/use-user-form-submit"
import { useUserQuery, useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { actingUserId } = useActingUserStore()

  const { data: user, isLoading } = useUserQuery(id, actingUserId)
  const { data: managersData } = useUsersQuery(
    actingUserId ? { actingUserId, role: "MANAGER" } : null
  )
  const managers = managersData?.items ?? []

  const { rootError, isPending, onSubmit } = useUserFormSubmit({
    mode: "edit",
    userId: id,
    actingUserId: actingUserId ?? undefined,
  })

  if (isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (!user)
    return <p className="text-sm text-destructive">Utilizador não encontrado.</p>

  return (
    <>
      <PageHeader
        title="Editar Colaborador"
        description="Altera os dados do colaborador e guarda."
      />
      <UserForm
        defaultValues={{
          name: user.name,
          email: user.email,
          role: user.role,
          managerId: user.managerId ?? undefined,
        }}
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={() => router.replace("/users")}
        submitLabel="Guardar"
        managers={managers}
        rootError={rootError}
      />
    </>
  )
}
