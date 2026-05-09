"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useActingUserStore } from "@/stores/acting-user-store"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { actingUserId, hasHydrated } = useActingUserStore()

  useEffect(() => {
    if (hasHydrated && !actingUserId) {
      router.replace("/login")
    }
  }, [actingUserId, hasHydrated, router])

  if (!hasHydrated || !actingUserId) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">A validar sessão...</p>
      </main>
    )
  }

  return <>{children}</>
}
