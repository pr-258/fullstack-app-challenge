import Link from "next/link"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Table,
  TableBody,
  TableCard,
  TableCardContent,
  TableCell,
  TableEmptyState,
  TableHeadCell,
  TableHeader,
  TableRow,
} from "@/components/table/table-card"
import { Button } from "@/components/ui/button"
import { VacationStatusBadge } from "@/components/vacation-requests/vacation-status-badge"
import type { VacationRequest } from "@/types/api"
import { formatDate, formatDateTime } from "@/lib/dates"

type VacationRequestsTableProps = {
  requests: VacationRequest[]
  title?: string
  action?: React.ReactNode
  emptyMessage?: string
  showUpdatedAt?: boolean
  onView?: (request: VacationRequest) => void
}

type VacationRequestsTableContentProps = Omit<
  VacationRequestsTableProps,
  "title" | "action"
>

export function VacationRequestsTable({
  requests,
  title,
  action,
  emptyMessage = "Sem pedidos de férias.",
  showUpdatedAt = false,
  onView,
}: VacationRequestsTableProps) {
  return (
    <TableCard
      title={title}
      titleIcon={
        title ? (
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="size-3.5 shrink-0 text-muted-foreground"
          />
        ) : undefined
      }
      action={action}
    >
      <TableCardContent>
        <VacationRequestsTableContent
          requests={requests}
          emptyMessage={emptyMessage}
          showUpdatedAt={showUpdatedAt}
          onView={onView}
        />
      </TableCardContent>
    </TableCard>
  )
}

export function VacationRequestsTableContent({
  requests,
  emptyMessage = "Sem pedidos de férias.",
  showUpdatedAt = false,
  onView,
}: VacationRequestsTableContentProps) {
  const columnCount = showUpdatedAt ? 7 : 6

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeadCell>Colaborador</TableHeadCell>
          <TableHeadCell>Início</TableHeadCell>
          <TableHeadCell>Fim</TableHeadCell>
          <TableHeadCell>Dias</TableHeadCell>
          <TableHeadCell>Estado</TableHeadCell>
          {showUpdatedAt ? (
            <TableHeadCell className="hidden lg:table-cell">
              Última atualização
            </TableHeadCell>
          ) : null}
          <TableHeadCell>Ação</TableHeadCell>
        </tr>
      </TableHeader>
      <TableBody>
        {requests.length > 0 ? (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {request.collaboratorName}
              </TableCell>
              <TableCell>{formatDate(request.startDate)}</TableCell>
              <TableCell>{formatDate(request.endDate)}</TableCell>
              <TableCell>{request.inclusiveDays}</TableCell>
              <TableCell>
                <VacationStatusBadge status={request.status} />
              </TableCell>
              {showUpdatedAt ? (
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {formatDateTime(request.updatedAt)}
                </TableCell>
              ) : null}
              <TableCell>
                {onView ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(request)}
                  >
                    Ver
                  </Button>
                ) : (
                  <Link
                    href="/vacation-requests"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Ver
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState colSpan={columnCount}>{emptyMessage}</TableEmptyState>
        )}
      </TableBody>
    </Table>
  )
}
