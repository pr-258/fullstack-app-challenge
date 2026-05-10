"use client"

import { useState } from "react"

import { PageHeader } from "@/components/layout/page-header"
import { VacationCalendar } from "@/components/vacation-calendar"
import { VacationRequestDetailDrawer } from "@/components/vacation-requests/vacation-detail-drawer/vacation-detail-drawer"
import { useVacationRequestsQuery } from "@/queries/vacation-requests"
import { useActingUserStore } from "@/stores/acting-user-store"
import type { VacationRequest, VacationRequestStatus } from "@/types/api"

const FILTER_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "APPROVED", label: "Aprovados" },
  { value: "PENDING", label: "Pendentes" },
] as const

type StatusFilter = "ALL" | VacationRequestStatus

export default function CalendarPage() {
  const { actingUserId, actingUser } = useActingUserStore()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [selected, setSelected] = useState<VacationRequest | null>(null)

  const { data, isLoading } = useVacationRequestsQuery(
    actingUserId ? { actingUserId, size: 200, sort: "startDate,asc" } : null
  )

  const canActOnRequests =
    actingUser?.role === "ADMIN" || actingUser?.role === "MANAGER"

  const canModifySelected =
    selected !== null &&
    selected.status === "PENDING" &&
    (actingUser?.role === "ADMIN" || selected.collaboratorId === actingUserId)

  const visibleRequests = (data?.items ?? []).filter(
    (r) => r.status === "APPROVED" || r.status === "PENDING"
  )

  const filteredRequests =
    statusFilter === "ALL"
      ? visibleRequests
      : visibleRequests.filter((r) => r.status === statusFilter)

  return (
    <>
      <PageHeader
        title="Calendário de Férias"
        description="Vista mensal dos períodos de férias."
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-emerald-500" />
            Aprovados
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-amber-400" />
            Pendentes
          </span>
        </div>

        <div className="flex gap-1 rounded-md border p-1">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value as StatusFilter)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">A carregar...</p>
      ) : (
        <VacationCalendar
          requests={filteredRequests}
          onSelectEvent={setSelected}
        />
      )}

      <VacationRequestDetailDrawer
        request={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        actingUserId={actingUserId ?? undefined}
        canActOnRequests={canActOnRequests}
        canCancel={canModifySelected}
        canEdit={canModifySelected}
      />
    </>
  )
}
