import {
  DetailField,
  DetailGrid,
  DetailSection,
} from "@/components/details-drawer/detail-drawer-primitives"
import { PersonCard } from "@/components/details-drawer/person-card"
import type { VacationRequest } from "@/types/api"
import { formatDate } from "@/lib/dates"

import { History } from "./history"

type DetailsProps = {
  request: VacationRequest | null
}

export function Details({ request }: DetailsProps) {
  if (!request) return null

  return (
    <div className="space-y-6 p-4">
      <DetailSection>
        <DetailGrid className="grid-cols-3">
          <DetailField label="Início" value={formatDate(request.startDate)} />
          <DetailField label="Fim" value={formatDate(request.endDate)} />
          <DetailField label="Dias" value={request.inclusiveDays} />
        </DetailGrid>
      </DetailSection>

      <PersonCard
        label="Colaborador"
        name={request.collaboratorName}
        description="Pedido de férias"
      />

      <PersonCard
        label="Manager"
        name={request.managerName}
        description={request.managerName ? "Responsável direto" : "-"}
      />

      <DetailSection title="Motivo">
        <p className="text-sm break-words">{request.reason || "-"}</p>
      </DetailSection>

      <History request={request} />
    </div>
  )
}
