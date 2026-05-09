"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { useActingUserStore } from "@/stores/acting-user-store"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { actingUserId, hasHydrated } = useActingUserStore()

  useEffect(() => {
    if (hasHydrated && !actingUserId) {
      router.replace("/login")
    }
  }, [actingUserId, hasHydrated, router])

  if (!hasHydrated || !actingUserId) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">A validar sessão...</p>
      </div>
    )
  }

  return (
    <div className="flex h-svh bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
