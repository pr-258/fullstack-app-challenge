"use client"

import Link from "next/link"

import { StatCard } from "@/components/dashboard/stat-card"
import { PageHeader } from "@/components/layout/page-header"
import { VacationRequestsTable } from "@/components/vacation-requests/vacation-requests-table"
import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"

function toBars(values: number[]): string[] {
  const max = Math.max(...values, 1)
  const minH = 20
  return values.map((v) => `${Math.round(minH + (v / max) * (100 - minH))}%`)
}

export default function DashboardPage() {
  const { actingUserId, actingUser } = useActingUserStore()

  const isAdmin = actingUser?.role === "ADMIN"
  const isManager = actingUser?.role === "MANAGER"
  const isCollaborator = actingUser?.role === "COLLABORATOR"

  const { data: requestsData } = useVacationRequestsQuery(
    actingUserId ? { actingUserId } : null
  )

  const { data: usersData } = useUsersQuery(
    actingUserId && (isAdmin || isManager) ? { actingUserId } : null
  )

  const requests = requestsData?.items ?? []
  const pending = requests.filter((r) => r.status === "PENDING").length
  const approved = requests.filter((r) => r.status === "APPROVED").length
  const rejected = requests.filter((r) => r.status === "REJECTED").length
  const cancelled = requests.filter((r) => r.status === "CANCELLED").length
  const totalDaysApproved = requests
    .filter((r) => r.status === "APPROVED")
    .reduce((sum, r) => sum + r.inclusiveDays, 0)
  const totalUsers = usersData?.totalItems ?? 0

  const recentRequests = requests.slice(0, 5)

  const today = new Date().toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <>
      <PageHeader title="Dashboard" description={formattedDate} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(isAdmin || isManager) && (
          <StatCard
            value={totalUsers}
            label={
              isAdmin ? "Total de colaboradores" : "Colaboradores na equipa"
            }
            bars={toBars([totalUsers, totalUsers, totalUsers, totalUsers])}
          />
        )}

        <StatCard
          value={pending}
          label="Pedidos pendentes"
          bars={toBars([pending, approved, rejected, cancelled])}
        />

        <StatCard
          value={approved}
          label="Pedidos aprovados"
          bars={toBars([approved, pending, rejected, cancelled])}
        />

        {isCollaborator ? (
          <StatCard
            value={totalDaysApproved}
            label="Dias aprovados"
            bars={toBars([
              totalDaysApproved,
              approved * 5,
              pending * 5,
              rejected * 5,
            ])}
          />
        ) : (
          <StatCard
            value={rejected}
            label="Pedidos rejeitados"
            bars={toBars([rejected, approved, pending, cancelled])}
          />
        )}
      </div>

      <div className="mt-6">
        <VacationRequestsTable
          requests={recentRequests}
          title={
            isCollaborator
              ? "Meus pedidos de férias recentes"
              : "Pedidos de férias recentes"
          }
          action={
            <Link
              href="/vacation-requests"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Ver todos
            </Link>
          }
          emptyMessage="Ainda não existem pedidos para apresentar."
          showUpdatedAt
        />
      </div>
    </>
  )
}
