import { PaginationControls } from "@/components/table/pagination-controls"
import {
  TableCard,
  TableCardContent,
  TableCardFooter,
  TableCardToolbar,
} from "@/components/table/table-card"
import type {
  User,
  VacationRequest,
  VacationRequestStatus,
} from "@/types/api"

import {
  ALL_COLLABORATORS,
  ALL_MANAGERS,
  ALL_STATUSES,
  VacationRequestTableFilters,
} from "./vacation-request-table-filters"
import { VacationRequestsTableContent } from "./vacation-requests-table"

type VacationRequestsTableCardProps = {
  requests: VacationRequest[]
  totalItems: number
  totalPages: number
  page: number
  size: number
  search: string
  status: VacationRequestStatus | typeof ALL_STATUSES
  collaboratorId: string
  managerId: string
  startDate: string
  endDate: string
  collaboratorOptions: User[]
  managerOptions: User[]
  activeFilterCount: number
  onSearchChange: (value: string) => void
  onStatusChange: (value: VacationRequestStatus | typeof ALL_STATUSES) => void
  onCollaboratorChange: (value: typeof ALL_COLLABORATORS | string) => void
  onManagerChange: (value: typeof ALL_MANAGERS | string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onClearFilters: () => void
  onView: (request: VacationRequest) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function VacationRequestsTableCard({
  requests,
  totalItems,
  totalPages,
  page,
  size,
  search,
  status,
  collaboratorId,
  managerId,
  startDate,
  endDate,
  collaboratorOptions,
  managerOptions,
  activeFilterCount,
  onSearchChange,
  onStatusChange,
  onCollaboratorChange,
  onManagerChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
  onView,
  onPageChange,
  onPageSizeChange,
}: VacationRequestsTableCardProps) {
  return (
    <TableCard>
      <TableCardToolbar>
        <VacationRequestTableFilters
          totalItems={totalItems}
          activeFilterCount={activeFilterCount}
          search={search}
          status={status}
          collaboratorId={collaboratorId}
          managerId={managerId}
          startDate={startDate}
          endDate={endDate}
          collaboratorOptions={collaboratorOptions}
          managerOptions={managerOptions}
          onSearchChange={onSearchChange}
          onStatusChange={onStatusChange}
          onCollaboratorChange={onCollaboratorChange}
          onManagerChange={onManagerChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onClearFilters={onClearFilters}
        />
      </TableCardToolbar>

      <TableCardContent>
        <VacationRequestsTableContent
          requests={requests}
          emptyMessage="Sem pedidos de férias."
          onView={onView}
        />
      </TableCardContent>

      <TableCardFooter>
        <PaginationControls
          page={page}
          size={size}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </TableCardFooter>
    </TableCard>
  )
}
