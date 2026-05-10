import { DrawerActionBar } from "@/components/details-drawer/detail-drawer-primitives"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { VacationStatusBadge } from "@/components/vacation-requests/vacation-status-badge"
import type { VacationRequest } from "@/types/api"

type ActionsBarProps = {
  request: VacationRequest | null
  showApproveReject: boolean
  rejecting: boolean
  rejectionReason: string
  approvePending: boolean
  rejectPending: boolean
  actionError?: string | null
  onApprove: () => void
  onStartReject: () => void
  onCancelReject: () => void
  onRejectionReasonChange: (value: string) => void
  onConfirmReject: () => void
}

export function ActionsBar({
  request,
  showApproveReject,
  rejecting,
  rejectionReason,
  approvePending,
  rejectPending,
  actionError,
  onApprove,
  onStartReject,
  onCancelReject,
  onRejectionReasonChange,
  onConfirmReject,
}: ActionsBarProps) {
  if (!request) return null

  return (
    <>
      <DrawerActionBar>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Status:
          </span>
          <VacationStatusBadge status={request.status} />
        </div>

        {showApproveReject && !rejecting && (
          <div className="flex gap-2">
            <Button disabled={approvePending} onClick={onApprove}>
              Aprovar
            </Button>
            <Button
              variant="destructive"
              disabled={rejectPending}
              onClick={onStartReject}
            >
              Rejeitar
            </Button>
          </div>
        )}
      </DrawerActionBar>

      {actionError && (
        <p className="border-b bg-muted/30 px-4 py-2 text-sm text-destructive">
          {actionError}
        </p>
      )}

      {showApproveReject && rejecting && (
        <div className="space-y-3 border-b bg-muted/30 px-4 py-3">
          <Textarea
            placeholder="Motivo da rejeição"
            value={rejectionReason}
            onChange={(event) => onRejectionReasonChange(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancelReject}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              disabled={!rejectionReason.trim() || rejectPending}
              onClick={onConfirmReject}
            >
              Confirmar rejeição
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
