import {
  DetailField,
  DetailGrid,
} from "@/components/details-drawer/detail-drawer-primitives"
import { PersonCard } from "@/components/details-drawer/person-card"
import { roleLabels } from "@/types/api"
import type { User } from "@/types/api"
import { formatDateTime } from "@/lib/dates"

type DetailsProps = {
  user: User | null
}

export function Details({ user }: DetailsProps) {
  if (!user) return null

  const managerCard = getManagerCardCopy(user)

  return (
    <div className="space-y-6 p-4">
      <PersonCard label="Colaborador" name={user.name} description={user.email} />

      <PersonCard
        label="Manager"
        name={managerCard.name}
        description={managerCard.description}
      />

      <DetailGrid>
        <DetailField label="Role" value={roleLabels[user.role]} />
        <DetailField
          label="Criado em"
          value={formatDateTime(user.createdAt)}
          className="col-span-2"
        />
      </DetailGrid>
    </div>
  )
}

function getManagerCardCopy(user: User) {
  if (user.managerName) {
    return {
      name: user.managerName,
      description: "Responsável direto",
    }
  }

  if (user.role === "COLLABORATOR") {
    return {
      name: "Sem manager",
      description: "Colaborador sem responsável atribuído.",
    }
  }

  return {
    name: "Não aplicável",
    description: "Este perfil não requer manager.",
  }
}
