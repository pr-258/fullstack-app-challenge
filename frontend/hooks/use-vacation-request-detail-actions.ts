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

  const approve = useApproveVacationRequestMutation(actingUserId ?? "")
  const reject = useRejectVacationRequestMutation(actingUserId ?? "")
  const cancel = useCancelVacationRequestMutation(actingUserId ?? "")

  function resetTransientState() {
    setRejecting(false)
    setRejectionReason("")
    setCancelling(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetTransientState()
    onOpenChange(next)
  }

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
          resetTransientState()
        },
      }
    )
  }

  function handleCancel() {
    if (!request) return
    cancel.mutate(request.id, { onSuccess: () => onOpenChange(false) })
  }

  return {
    rejecting,
    rejectionReason,
    cancelling,
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
