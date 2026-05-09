"use client"

import Link from "next/link"

import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import { roleLabels } from "@/types/api"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"

export default function UsersPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const { data, isLoading, isError, error } = useUsersQuery(
    actingUserId ? { actingUserId } : null
  )

  const isAdmin = actingUser?.role === "ADMIN"

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
        title="Colaboradores"
        description="Gere os colaboradores da organização."
        action={
          isAdmin ? (
            <Button asChild size="lg">
              <Link href="/users/new">Adicionar Colaborador</Link>
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem colaboradores.</p>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-xs">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Nome</th>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Role</th>
                <th className="px-3 py-2 text-left font-medium">Manager</th>
                <th className="px-3 py-2 text-left font-medium">Ativo</th>
                {isAdmin && (
                  <th className="px-3 py-2 text-left font-medium">Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr
                  key={user.id}
                  className="border-t transition-colors hover:bg-muted/50"
                >
                  <td className="px-3 py-2 font-medium">{user.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{user.email}</td>
                  <td className="px-3 py-2">{roleLabels[user.role]}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {user.managerName ?? "-"}
                  </td>
                  <td className="px-3 py-2">{user.active ? "Sim" : "Não"}</td>
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/users/${user.id}/edit`}>Editar</Link>
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
