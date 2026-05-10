import { useState } from "react"

import { usePagination } from "@/hooks/use-pagination"
import { useUsersQuery } from "@/queries/users"
import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"
import type { VacationRequest, VacationRequestStatus } from "@/types/api"

import {
  ALL_COLLABORATORS,
  ALL_MANAGERS,
  ALL_STATUSES,
} from "../components/vacation-requests/vacation-request-table-filters"

export function useVacationRequestsList() {
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

  const requestsQuery = useVacationRequestsQuery(
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

  const filterOptionsQuery = useUsersQuery(
    actingUserId
      ? {
          actingUserId,
          size: 100,
          sort: "name,asc",
        }
      : null
  )

  const canActOnRequests =
    (actingUser?.role === "ADMIN" || actingUser?.role === "MANAGER") &&
    selected?.collaboratorId !== actingUserId

  const canCreate =
    actingUser?.role === "ADMIN" ||
    actingUser?.role === "MANAGER" ||
    actingUser?.role === "COLLABORATOR"

  const canModifySelected =
    selected !== null &&
    selected.status === "PENDING" &&
    (actingUser?.role === "ADMIN" || selected.collaboratorId === actingUserId)

  const filterUsers = filterOptionsQuery.data?.items ?? []
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

  return {
    actingUserId,
    canCreate,
    selected,
    setSelected,
    requestsQuery,
    drawer: {
      canActOnRequests,
      canCancel: canModifySelected,
      canEdit: canModifySelected,
    },
    table: {
      requests: requestsQuery.data?.items ?? [],
      totalItems: requestsQuery.data?.totalItems ?? 0,
      totalPages: requestsQuery.data?.totalPages ?? 0,
      page: requestsQuery.data?.page ?? page,
      size: requestsQuery.data?.size ?? size,
      search,
      status,
      collaboratorId,
      managerId,
      startDate,
      endDate,
      collaboratorOptions,
      managerOptions,
      activeFilterCount,
      onSearchChange: (value: string) => {
        setSearch(value)
        resetPage()
      },
      onStatusChange: (value: VacationRequestStatus | typeof ALL_STATUSES) => {
        setStatus(value)
        resetPage()
      },
      onCollaboratorChange: (value: string) => {
        setCollaboratorId(value)
        resetPage()
      },
      onManagerChange: (value: string) => {
        setManagerId(value)
        resetPage()
      },
      onStartDateChange: (value: string) => {
        setStartDate(value)
        resetPage()
      },
      onEndDateChange: (value: string) => {
        setEndDate(value)
        resetPage()
      },
      onClearFilters: resetFilters,
      onView: setSelected,
      onPageChange: setPage,
      onPageSizeChange: (nextSize: number) => {
        setSize(nextSize)
        resetPage()
      },
    },
  }
}
