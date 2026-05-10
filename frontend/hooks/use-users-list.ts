import { useState } from "react"

import { usePagination } from "@/hooks/use-pagination"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import type { Role, User } from "@/types/api"

import {
  ALL_MANAGERS,
  ALL_ROLES,
} from "../components/users/users-table-filters"

export function useUsersList() {
  const { actingUserId, actingUser } = useActingUserStore()
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<Role | typeof ALL_ROLES>(ALL_ROLES)
  const [managerId, setManagerId] = useState(ALL_MANAGERS)
  const { page, size, setPage, setSize, resetPage } = usePagination()
  const [selected, setSelected] = useState<User | null>(null)

  const usersQuery = useUsersQuery(
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

  const filterOptionsQuery = useUsersQuery(
    actingUserId
      ? {
          actingUserId,
          size: 100,
          sort: "name,asc",
        }
      : null
  )

  const isAdmin = actingUser?.role === "ADMIN"
  const items = usersQuery.data?.items ?? []
  const managerOptions =
    filterOptionsQuery.data?.items.filter((user) => user.role === "MANAGER") ??
    []
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

  return {
    actingUserId,
    isAdmin,
    selected,
    setSelected,
    usersQuery,
    table: {
      users: items,
      totalItems: usersQuery.data?.totalItems ?? 0,
      totalPages: usersQuery.data?.totalPages ?? 0,
      page: usersQuery.data?.page ?? page,
      size: usersQuery.data?.size ?? size,
      search,
      role,
      managerId,
      managerOptions,
      activeFilterCount,
      onSearchChange: (value: string) => {
        setSearch(value)
        resetPage()
      },
      onRoleChange: (value: Role | typeof ALL_ROLES) => {
        setRole(value)
        resetPage()
      },
      onManagerChange: (value: string) => {
        setManagerId(value)
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
