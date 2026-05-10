"use client"

import { useState } from "react"
import Link from "next/link"

import { usePagination } from "@/hooks/use-pagination"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import type { Role, User } from "@/types/api"
import { PageHeader } from "@/components/layout/page-header"
import { PaginationControls } from "@/components/table/pagination-controls"
import {
  TableCard,
  TableCardContent,
  TableCardFooter,
  TableCardToolbar,
} from "@/components/table/table-card"
import { Button } from "@/components/ui/button"
import {
  ALL_MANAGERS,
  ALL_ROLES,
  UsersTableFilters,
} from "@/components/users/users-table-filters"
import { UserDetailDrawer } from "@/components/users/user-detail-drawer/user-detail-drawer"
import { UsersTable } from "@/components/users/users-table"

export default function UsersPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<Role | typeof ALL_ROLES>(ALL_ROLES)
  const [managerId, setManagerId] = useState(ALL_MANAGERS)
  const { page, size, setPage, setSize, resetPage } = usePagination()
  const [selected, setSelected] = useState<User | null>(null)

  const { data, isLoading, isError, error } = useUsersQuery(
    actingUserId
      ? {
          actingUserId,
          search,
          role: role === ALL_ROLES ? undefined : role,
          managerId: managerId === ALL_MANAGERS ? undefined : managerId,
          page,
          size,
          sort: "name,asc",
        }
      : null
  )
  const { data: filterOptionsData } = useUsersQuery(
    actingUserId
      ? {
          actingUserId,
          size: 100,
          sort: "name,asc",
        }
      : null
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
  const managerOptions =
    filterOptionsData?.items.filter((user) => user.role === "MANAGER") ?? []
  const activeFilterCount = [
    search !== "",
    role !== ALL_ROLES,
    managerId !== ALL_MANAGERS,
  ].filter(Boolean).length

  function resetFilters() {
    setSearch("")
    setRole(ALL_ROLES)
    setManagerId(ALL_MANAGERS)
    resetPage()
  }

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
        <TableCardToolbar>
          <UsersTableFilters
            totalItems={data?.totalItems ?? 0}
            activeFilterCount={activeFilterCount}
            search={search}
            role={role}
            managerId={managerId}
            managerOptions={managerOptions}
            onSearchChange={(value) => {
              setSearch(value)
              resetPage()
            }}
            onRoleChange={(value) => {
              setRole(value)
              resetPage()
            }}
            onManagerChange={(value) => {
              setManagerId(value)
              resetPage()
            }}
            onClearFilters={resetFilters}
          />
        </TableCardToolbar>

        <TableCardContent>
          <UsersTable users={items} onView={setSelected} />
        </TableCardContent>

        <TableCardFooter>
          <PaginationControls
            page={data?.page ?? page}
            size={data?.size ?? size}
            totalItems={data?.totalItems ?? 0}
            totalPages={data?.totalPages ?? 0}
            onPageChange={setPage}
            onPageSizeChange={(nextSize) => {
              setSize(nextSize)
              resetPage()
            }}
          />
        </TableCardFooter>
      </TableCard>

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
