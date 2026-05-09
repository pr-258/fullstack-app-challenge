"use client"

import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import { roleLabels } from "@/types/api"

export default function UsersPage() {
  const { actingUserId } = useActingUserStore()
  const { data, isLoading, isError, error } = useUsersQuery(
    actingUserId ? { actingUserId } : null
  )

  if (isLoading) return <p className="text-sm text-muted-foreground">A carregar...</p>

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
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-xs">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium text-left">Nome</th>
            <th className="px-3 py-2 font-medium text-left">Email</th>
            <th className="px-3 py-2 font-medium text-left">Role</th>
            <th className="px-3 py-2 font-medium text-left">Manager</th>
            <th className="px-3 py-2 font-medium text-left">Ativo</th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id} className="border-t transition-colors hover:bg-muted/50">
              <td className="px-3 py-2 font-medium">{user.name}</td>
              <td className="px-3 py-2 text-muted-foreground">{user.email}</td>
              <td className="px-3 py-2">{roleLabels[user.role]}</td>
              <td className="px-3 py-2 text-muted-foreground">{user.managerName ?? "-"}</td>
              <td className="px-3 py-2">{user.active ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
