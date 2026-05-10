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
  "/users/new": "Novo Colaborador",
  "/vacation-requests": "Pedidos de Férias",
  "/vacation-requests/new": "Novo Pedido",
  "/calendar": "Calendário",
}

const leafLabels: Record<string, string> = {
  new: "Novo",
  edit: "Editar",
}

export function Topbar() {
  const pathname = usePathname()
  const { actingUser } = useActingUserStore()

  const segments = pathname.split("/").filter(Boolean)
  const isSubPage = segments.length > 1
  const sectionPath = `/${segments[0]}`
  const sectionLabel = pageLabels[sectionPath] ?? segments[0]
  const lastSegment = segments[segments.length - 1]
  const currentLabel =
    pageLabels[pathname] ?? leafLabels[lastSegment] ?? lastSegment

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {isSubPage ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={sectionPath}>{sectionLabel}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <Avatar size="sm">
        <AvatarFallback>{actingUser?.name?.[0]}</AvatarFallback>
      </Avatar>
    </header>
  )
}
