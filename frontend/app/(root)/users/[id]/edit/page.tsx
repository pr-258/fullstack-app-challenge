"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { PageHeader } from "@/components/layout/page-header"
import { UserForm } from "@/components/users/user-form"
import { ApiError } from "@/api/client/fetcher"
import { useUserQuery, useUpdateUserMutation, useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { actingUserId } = useActingUserStore()
  const [rootError, setRootError] = useState<string>()

  const { data: user, isLoading } = useUserQuery(id, actingUserId)
  const { data: managersData } = useUsersQuery(
    actingUserId ? { actingUserId, role: "MANAGER" } : null
  )
  const managers = managersData?.items ?? []

  const update = useUpdateUserMutation(id, actingUserId!)

  function onSubmit(values: {
    name: string
    email: string
    role: "ADMIN" | "MANAGER" | "COLLABORATOR"
    managerId?: string
  }) {
    update.mutate(
      {
        name: values.name,
        email: values.email,
        role: values.role,
        managerId: values.role === "COLLABORATOR" ? (values.managerId ?? null) : null,
      },
      {
        onSuccess: () => router.replace("/users"),
        onError: (err) => {
          const message =
            err instanceof ApiError && err.code === "EMAIL_CONFLICT"
              ? "Já existe um utilizador com este email."
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
        isPending={update.isPending}
        onCancel={() => router.replace("/users")}
        submitLabel="Guardar"
        managers={managers}
        rootError={rootError}
      />
    </>
  )
}
