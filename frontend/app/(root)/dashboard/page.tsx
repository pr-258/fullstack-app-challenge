"use client"

import Link from "next/link"

import { PageHeader } from "@/components/layout/page-header"
import { VacationRequestsTable } from "@/components/vacation-requests/vacation-requests-table"
import { useDashboardStatsQuery } from "@/queries/dashboard"
import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"
import { StatCard } from "@/components/stat-card"

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

  const { data: stats } = useDashboardStatsQuery(actingUserId)

  const { data: recentData } = useVacationRequestsQuery(
    actingUserId ? { actingUserId, size: 5, sort: "createdAt,desc" } : null
  )

  const pending = stats?.pendingRequests ?? 0
  const approved = stats?.approvedRequests ?? 0
  const rejected = stats?.rejectedRequests ?? 0
  const totalCollaborators = stats?.totalCollaborators ?? 0
  const totalApprovedDays = stats?.totalApprovedDays ?? 0

  const recentRequests = recentData?.items ?? []

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
            value={totalCollaborators}
            label={
              isAdmin ? "Total de colaboradores" : "Colaboradores na equipa"
            }
            bars={toBars([
              totalCollaborators,
              totalCollaborators,
              totalCollaborators,
              totalCollaborators,
            ])}
          />
        )}

        <StatCard
          value={pending}
          label="Pedidos pendentes"
          bars={toBars([pending, approved, rejected])}
        />

        <StatCard
          value={approved}
          label="Pedidos aprovados"
          bars={toBars([approved, pending, rejected])}
        />

        {isCollaborator ? (
          <StatCard
            value={totalApprovedDays}
            label="Dias aprovados"
            bars={toBars([totalApprovedDays, approved * 5, pending * 5])}
          />
        ) : (
          <StatCard
            value={rejected}
            label="Pedidos rejeitados"
            bars={toBars([rejected, approved, pending])}
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
