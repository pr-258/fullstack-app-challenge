"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import {
  useApproveVacationRequestMutation,
  useCancelVacationRequestMutation,
  useRejectVacationRequestMutation,
} from "@/queries/vacation-requests"
import { statusLabels } from "@/types/api"
import type { VacationRequest } from "@/types/api"

interface DetailDrawerProps {
  request: VacationRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  actingUserId?: string
  canActOnRequests?: boolean
  canCancel?: boolean
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? "-"}</p>
    </div>
  )
}

export function DetailDrawer({
  request,
  open,
  onOpenChange,
  actingUserId,
  canActOnRequests,
  canCancel,
}: DetailDrawerProps) {
  const [rejecting, setRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [cancelling, setCancelling] = useState(false)

  const approve = useApproveVacationRequestMutation(actingUserId ?? "")
  const reject = useRejectVacationRequestMutation(actingUserId ?? "")
  const cancel = useCancelVacationRequestMutation(actingUserId ?? "")

  const isPending = request?.status === "PENDING"
  const showApproveReject = canActOnRequests && isPending

  function handleApprove() {
    if (!request) return
    approve.mutate(request.id, { onSuccess: () => onOpenChange(false) })
  }

  function handleRejectConfirm() {
    if (!request) return
    reject.mutate(
      { id: request.id, body: { rejectionReason } },
      {
        onSuccess: () => {
          onOpenChange(false)
          setRejecting(false)
          setRejectionReason("")
        },
      }
    )
  }

  function handleCancel() {
    if (!request) return
    cancel.mutate(request.id, { onSuccess: () => onOpenChange(false) })
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setRejecting(false)
      setRejectionReason("")
      setCancelling(false)
    }
    onOpenChange(next)
  }

  const hasFooter = showApproveReject || canCancel

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
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

        {hasFooter && (
          <DrawerFooter>
            {showApproveReject && (
              <>
                {rejecting ? (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Motivo da rejeição"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        disabled={!rejectionReason.trim() || reject.isPending}
                        onClick={handleRejectConfirm}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRejecting(false)
                          setRejectionReason("")
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button disabled={approve.isPending} onClick={handleApprove}>
                      Aprovar
                    </Button>
                    <Button
                      variant="outline"
                      disabled={reject.isPending}
                      onClick={() => setRejecting(true)}
                    >
                      Rejeitar
                    </Button>
                  </div>
                )}
              </>
            )}

            {canCancel && !rejecting && (
              <>
                {cancelling ? (
                  <div className="space-y-2">
                    <p className="text-sm">Tens a certeza que queres cancelar este pedido?</p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        disabled={cancel.isPending}
                        onClick={handleCancel}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCancelling(false)}
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setCancelling(true)}
                  >
                    Cancelar pedido
                  </Button>
                )}
              </>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
