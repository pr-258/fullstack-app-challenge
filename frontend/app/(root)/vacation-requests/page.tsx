"use client"

import { useState } from "react"

import Link from "next/link"

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
  ALL_COLLABORATORS,
  ALL_MANAGERS,
  ALL_STATUSES,
  VacationRequestTableFilters,
} from "@/components/vacation-requests/vacation-request-table-filters"
import { DetailDrawer } from "@/components/vacation-requests/detail-drawer"
import { VacationRequestsTableContent } from "@/components/vacation-requests/vacation-requests-table"
import { usePagination } from "@/hooks/use-pagination"
import { useUsersQuery } from "@/queries/users"
import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"
import type { VacationRequest, VacationRequestStatus } from "@/types/api"

export default function VacationRequestsPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<
    VacationRequestStatus | typeof ALL_STATUSES
  >(ALL_STATUSES)
  const [collaboratorId, setCollaboratorId] = useState(ALL_COLLABORATORS)
  const [managerId, setManagerId] = useState(ALL_MANAGERS)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { page, size, setPage, setSize, resetPage } = usePagination()
  const [selected, setSelected] = useState<VacationRequest | null>(null)

  const { data, isLoading, isError, error } = useVacationRequestsQuery(
    actingUserId
      ? {
          actingUserId,
          search,
          status: status === ALL_STATUSES ? undefined : status,
          collaboratorId:
            collaboratorId === ALL_COLLABORATORS ? undefined : collaboratorId,
          managerId: managerId === ALL_MANAGERS ? undefined : managerId,
          startDate,
          endDate,
          page,
          size,
          sort: "startDate,asc",
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

  const canActOnRequests =
    actingUser?.role === "ADMIN" || actingUser?.role === "MANAGER"

  const canCreate =
    actingUser?.role === "ADMIN" || actingUser?.role === "COLLABORATOR"

  const canModifySelected =
    selected !== null &&
    selected.status === "PENDING" &&
    (actingUser?.role === "ADMIN" || selected.collaboratorId === actingUserId)

  if (isLoading)
    return <p className="text-sm text-muted-foreground">A carregar...</p>

  if (isError)
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Erro desconhecido"}
      </p>
    )

  const items = data?.items ?? []
  const filterUsers = filterOptionsData?.items ?? []
  const collaboratorOptions = filterUsers.filter(
    (user) => user.role === "COLLABORATOR"
  )
  const managerOptions = filterUsers.filter((user) => user.role === "MANAGER")
  const activeFilterCount = [
    search !== "",
    status !== ALL_STATUSES,
    collaboratorId !== ALL_COLLABORATORS,
    managerId !== ALL_MANAGERS,
    startDate !== "",
    endDate !== "",
  ].filter(Boolean).length

  function resetFilters() {
    setSearch("")
    setStatus(ALL_STATUSES)
    setCollaboratorId(ALL_COLLABORATORS)
    setManagerId(ALL_MANAGERS)
    setStartDate("")
    setEndDate("")
    resetPage()
  }

  return (
    <>
      <PageHeader
        title="Pedidos de Férias"
        description="Lista e gere os pedidos de férias."
        action={
          canCreate ? (
            <Button asChild size="lg">
              <Link href="/vacation-requests/new">Novo Pedido</Link>
            </Button>
          ) : undefined
        }
      />

      <TableCard>
        <TableCardToolbar>
          <VacationRequestTableFilters
            totalItems={data?.totalItems ?? 0}
            activeFilterCount={activeFilterCount}
            search={search}
            status={status}
            collaboratorId={collaboratorId}
            managerId={managerId}
            startDate={startDate}
            endDate={endDate}
            collaboratorOptions={collaboratorOptions}
            managerOptions={managerOptions}
            onSearchChange={(value) => {
              setSearch(value)
              resetPage()
            }}
            onStatusChange={(value) => {
              setStatus(value)
              resetPage()
            }}
            onCollaboratorChange={(value) => {
              setCollaboratorId(value)
              resetPage()
            }}
            onManagerChange={(value) => {
              setManagerId(value)
              resetPage()
            }}
            onStartDateChange={(value) => {
              setStartDate(value)
              resetPage()
            }}
            onEndDateChange={(value) => {
              setEndDate(value)
              resetPage()
            }}
            onClearFilters={resetFilters}
          />
        </TableCardToolbar>

        <TableCardContent>
          <VacationRequestsTableContent
            requests={items}
            emptyMessage="Sem pedidos de férias."
            onView={setSelected}
          />
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

      <DetailDrawer
        request={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        actingUserId={actingUserId ?? undefined}
        canActOnRequests={canActOnRequests}
        canCancel={canModifySelected}
        canEdit={canModifySelected}
      />
    </>
  )
}
