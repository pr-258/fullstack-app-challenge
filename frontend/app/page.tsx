"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useActingUserStore } from "@/stores/acting-user-store"

export default function Page() {
  const router = useRouter()
  const { actingUserId, hasHydrated } = useActingUserStore()

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    router.replace(actingUserId ? "/dashboard" : "/login")
  }, [actingUserId, hasHydrated, router])

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">A preparar aplicação...</p>
    </main>
  )
}
