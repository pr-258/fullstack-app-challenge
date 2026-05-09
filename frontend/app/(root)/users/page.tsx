"use client"

import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import { roleLabels } from "@/types/api"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UsersPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const { data, isLoading, isError, error } = useUsersQuery(
    actingUserId ? { actingUserId } : null
  )

  const canCreate = actingUser?.role === "ADMIN"

  if (isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (isError)
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Erro desconhecido"}
      </p>
    )

  const items = data?.items ?? []

  if (items.length === 0)
    return <p className="text-sm text-muted-foreground">Sem colaboradores.</p>

  return (
    <>
      <PageHeader
        title="Colaboradores"
        description="Gere os colaboradores da organização."
        action={
          canCreate ? (
            <Button asChild size="lg">
              <Link href="/users/new">Adicionar Colaborador</Link>
            </Button>
          ) : undefined
        }
      />
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Nome</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Role</th>
              <th className="px-3 py-2 text-left font-medium">Manager</th>
              <th className="px-3 py-2 text-left font-medium">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr
                key={user.id}
                className="border-t transition-colors hover:bg-muted/50"
              >
                <td className="px-3 py-2 font-medium">{user.name}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-3 py-2">{roleLabels[user.role]}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {user.managerName ?? "-"}
                </td>
                <td className="px-3 py-2">{user.active ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
