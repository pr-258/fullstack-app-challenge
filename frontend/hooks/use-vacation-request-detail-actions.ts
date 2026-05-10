import { useState } from "react"

import {
  useApproveVacationRequestMutation,
  useCancelVacationRequestMutation,
  useRejectVacationRequestMutation,
} from "@/queries/vacation-requests"
import type { VacationRequest } from "@/types/api"

type UseVacationRequestDetailActionsParams = {
  request: VacationRequest | null
  actingUserId?: string
  onOpenChange: (open: boolean) => void
}

export function useVacationRequestDetailActions({
  request,
  actingUserId,
  onOpenChange,
}: UseVacationRequestDetailActionsParams) {
  const [rejecting, setRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [cancelling, setCancelling] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const approve = useApproveVacationRequestMutation(actingUserId ?? "")
  const reject = useRejectVacationRequestMutation(actingUserId ?? "")
  const cancel = useCancelVacationRequestMutation(actingUserId ?? "")

  function resetTransientState() {
    setRejecting(false)
    setRejectionReason("")
    setCancelling(false)
    setActionError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetTransientState()
    onOpenChange(next)
  }

  function handleApprove() {
    if (!request) return
    approve.mutate(request.id, {
      onSuccess: () => onOpenChange(false),
      onError: () => setActionError("Ocorreu um erro. Tenta novamente."),
    })
  }

  function handleRejectConfirm() {
    if (!request) return
    reject.mutate(
      { id: request.id, body: { rejectionReason } },
      {
        onSuccess: () => {
          onOpenChange(false)
          resetTransientState()
        },
        onError: () => setActionError("Ocorreu um erro. Tenta novamente."),
      }
    )
  }

  function handleCancel() {
    if (!request) return
    cancel.mutate(request.id, {
      onSuccess: () => onOpenChange(false),
      onError: () => setActionError("Erro ao cancelar pedido. Tenta novamente."),
    })
  }

  return {
    rejecting,
    rejectionReason,
    cancelling,
    actionError,
    approvePending: approve.isPending,
    rejectPending: reject.isPending,
    cancelPending: cancel.isPending,
    setRejecting,
    setRejectionReason,
    setCancelling,
    handleOpenChange,
    handleApprove,
    handleRejectConfirm,
    handleCancel,
  }
}
