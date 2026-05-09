"use client"

import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useActingUserStore } from "@/stores/acting-user-store"

const pageLabels: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/users": "Colaboradores",
  "/vacation-requests": "Pedidos de Férias",
}

export function Topbar() {
  const pathname = usePathname()
  const { actingUser } = useActingUserStore()

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageLabels[pathname] ?? pathname}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Avatar size="sm">
        <AvatarFallback>{actingUser?.name?.[0]}</AvatarFallback>
      </Avatar>
    </header>
  )
}
