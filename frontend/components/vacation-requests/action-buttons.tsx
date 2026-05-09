"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  useApproveVacationRequestMutation,
  useRejectVacationRequestMutation,
} from "@/queries/vacation-requests"
import type { VacationRequestStatus } from "@/types/api"

interface ActionButtonsProps {
  id: string
  status: VacationRequestStatus
  actingUserId: string
}

export function ActionButtons({ id, status, actingUserId }: ActionButtonsProps) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const approve = useApproveVacationRequestMutation(actingUserId)
  const reject = useRejectVacationRequestMutation(actingUserId)

  if (status !== "PENDING") return null

  function handleRejectConfirm() {
    reject.mutate(
      { id, body: { rejectionReason } },
      {
        onSuccess: () => {
          setRejectOpen(false)
          setRejectionReason("")
        },
      }
    )
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={approve.isPending}
          onClick={() => approve.mutate(id)}
        >
          Aprovar
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={reject.isPending}
          onClick={() => setRejectOpen(true)}
        >
          Rejeitar
        </Button>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar pedido</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Motivo da rejeição"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!rejectionReason.trim() || reject.isPending}
              onClick={handleRejectConfirm}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
