"use client"
import Link from "next/link"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { useUsersList } from "@/components/users/use-users-list"
import { UserDetailDrawer } from "@/components/users/user-detail-drawer/user-detail-drawer"
import { UsersTableCard } from "@/components/users/users-table-card"

export default function UsersPage() {
  const { actingUserId, isAdmin, selected, setSelected, usersQuery, table } =
    useUsersList()

  if (usersQuery.isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (usersQuery.isError)
    return (
      <p className="text-sm text-destructive">
        {usersQuery.error instanceof Error
          ? usersQuery.error.message
          : "Erro desconhecido"}
      </p>
    )

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

      <UsersTableCard {...table} />

      {actingUserId && (
        <UserDetailDrawer
          user={selected}
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
          actingUserId={actingUserId}
          isAdmin={isAdmin}
        />
      )}
    </>
  )
}
