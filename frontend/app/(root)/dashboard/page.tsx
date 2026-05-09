"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useMeQuery } from "@/queries/auth"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function DashboardPage() {
  const router = useRouter()
  const { actingUserId, actingUser, clearActingUser } = useActingUserStore()
  const { data: me } = useMeQuery(actingUserId)

  const currentUser = me ?? actingUser

  function handleLogout() {
    clearActingUser()
    router.replace("/login")
  }

  return (
    <main className="min-h-svh bg-background px-4 py-8 text-foreground">
      {currentUser && (
        <div>
          <p>User: {currentUser.name}</p>
          <p>Role: {currentUser.role}</p>
        </div>
      )}
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </main>
  )
}
