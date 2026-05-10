"use client"

import { useState } from "react"
import Link from "next/link"

import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import { roleLabels } from "@/types/api"
import type { User } from "@/types/api"
import { PageHeader } from "@/components/layout/page-header"
import {
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableEmptyState,
  TableHeadCell,
  TableHeader,
  TableRow,
} from "@/components/table/table-card"
import { Button } from "@/components/ui/button"
import { UserDetailDrawer } from "@/components/users/user-detail-drawer"

export default function UsersPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const { data, isLoading, isError, error } = useUsersQuery(
    actingUserId ? { actingUserId } : null
  )

  const [selected, setSelected] = useState<User | null>(null)

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

      <TableCard>
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell>Nome</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Role</TableHeadCell>
              <TableHeadCell>Manager</TableHeadCell>
              <TableHeadCell>Ativo</TableHeadCell>
              <TableHeadCell>Ação</TableHeadCell>
            </tr>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>{roleLabels[user.role]}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.managerName ?? "-"}
                  </TableCell>
                  <TableCell>{user.active ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(user)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmptyState colSpan={6}>Sem colaboradores.</TableEmptyState>
            )}
          </TableBody>
        </Table>
      </TableCard>

      <UserDetailDrawer
        user={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        actingUserId={actingUserId!}
        isAdmin={isAdmin}
      />
    </>
  )
}
