"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { VacationRequest } from "@/types/api"

import { ActionsBar } from "./actions-bar"
import { Details } from "./details"
import { Footer } from "./footer"
import { useVacationRequestDetailActions } from "@/hooks/use-vacation-request-detail-actions"

interface VacationRequestDetailDrawerProps {
  request: VacationRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  actingUserId?: string
  canActOnRequests?: boolean
  canCancel?: boolean
  canEdit?: boolean
}

export function VacationRequestDetailDrawer({
  request,
  open,
  onOpenChange,
  actingUserId,
  canActOnRequests,
  canCancel,
  canEdit,
}: VacationRequestDetailDrawerProps) {
  const {
    rejecting,
    rejectionReason,
    cancelling,
    approvePending,
    rejectPending,
    cancelPending,
    setRejecting,
    setRejectionReason,
    setCancelling,
    handleOpenChange,
    handleApprove,
    handleRejectConfirm,
    handleCancel,
  } = useVacationRequestDetailActions({
    request,
    actingUserId,
    onOpenChange,
  })

  const isPending = request?.status === "PENDING"
  const showApproveReject = Boolean(canActOnRequests && isPending)

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pedido de Férias</DrawerTitle>
        </DrawerHeader>

        <ActionsBar
          request={request}
          showApproveReject={showApproveReject}
          rejecting={rejecting}
          rejectionReason={rejectionReason}
          approvePending={approvePending}
          rejectPending={rejectPending}
          onApprove={handleApprove}
          onStartReject={() => setRejecting(true)}
          onCancelReject={() => {
            setRejecting(false)
            setRejectionReason("")
          }}
          onRejectionReasonChange={setRejectionReason}
          onConfirmReject={handleRejectConfirm}
        />

        <Details request={request} />

        {!rejecting && (
          <Footer
            requestId={request?.id}
            canEdit={canEdit}
            canCancel={canCancel}
            cancelling={cancelling}
            cancelPending={cancelPending}
            onStartCancel={() => setCancelling(true)}
            onCancelCancel={() => setCancelling(false)}
            onConfirmCancel={handleCancel}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}
