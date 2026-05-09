"use client"

import { useMeQuery } from "@/queries/auth"
import { useActingUserStore } from "@/stores/acting-user-store"
import { roleLabels } from "@/types/api"

export default function DashboardPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const { data: me } = useMeQuery(actingUserId)

  const currentUser = me ?? actingUser

  return currentUser ? (
    <div>
      <p>{currentUser.name}</p>
      <p>{roleLabels[currentUser.role]}</p>
    </div>
  ) : null
}
