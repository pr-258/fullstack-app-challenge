"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { statusLabels } from "@/types/api"
import type { VacationRequest } from "@/types/api"

interface DetailDrawerProps {
  request: VacationRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? "-"}</p>
    </div>
  )
}

export function DetailDrawer({ request, open, onOpenChange }: DetailDrawerProps) {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pedido de Férias</DrawerTitle>
        </DrawerHeader>
        {request && (
          <div className="space-y-4 p-4">
            <Field label="Colaborador" value={request.collaboratorName} />
            <Field label="Manager" value={request.managerName} />
            <Field label="Início" value={request.startDate} />
            <Field label="Fim" value={request.endDate} />
            <Field label="Dias" value={request.inclusiveDays} />
            <Field label="Estado" value={statusLabels[request.status]} />
            <Field label="Motivo" value={request.reason} />
            {request.status === "REJECTED" && (
              <Field label="Motivo de rejeição" value={request.rejectionReason} />
            )}
            {request.reviewedByName && (
              <Field label="Revisto por" value={request.reviewedByName} />
            )}
            {request.reviewedAt && (
              <Field label="Revisto em" value={request.reviewedAt} />
            )}
            <Field label="Criado em" value={request.createdAt} />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
