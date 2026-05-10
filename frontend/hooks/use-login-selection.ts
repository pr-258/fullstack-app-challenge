import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { useMockUsersQuery } from "@/queries/auth"
import { useActingUserStore } from "@/stores/acting-user-store"
import type { MockUser, Role } from "@/types/api"

const roleOrder: Role[] = ["ADMIN", "MANAGER", "COLLABORATOR"]

export function useLoginSelection() {
  const router = useRouter()
  const { actingUserId, hasHydrated, setActingUser } = useActingUserStore()
  const { data: users = [], error, isError, isLoading } = useMockUsersQuery()
  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN")
  const [selectedUserId, setSelectedUserId] = useState("")

  const usersForSelectedRole = useMemo(
    () => users.filter((user) => user.role === selectedRole),
    [selectedRole, users]
  )

  const selectedUser = useMemo(
    () =>
      usersForSelectedRole.find((user) => user.id === selectedUserId) ??
      usersForSelectedRole[0] ??
      null,
    [selectedUserId, usersForSelectedRole]
  )

  useEffect(() => {
    if (hasHydrated && actingUserId) {
      router.replace("/dashboard")
    }
  }, [actingUserId, hasHydrated, router])

  function handleRoleChange(value: string) {
    const nextRole = value as Role
    const nextUser = users.find((user) => user.role === nextRole)
    setSelectedRole(nextRole)
    setSelectedUserId(nextUser?.id ?? "")
  }

  function handleSelectUser(user: MockUser | null) {
    if (!user) return
    setActingUser(user)
    router.replace("/dashboard")
  }

  return {
    roleOrder,
    users,
    error,
    isError,
    isLoading,
    hasHydrated,
    selectedRole,
    selectedUser,
    usersForSelectedRole,
    handleRoleChange,
    handleUserChange: setSelectedUserId,
    handleSelectUser,
  }
}
