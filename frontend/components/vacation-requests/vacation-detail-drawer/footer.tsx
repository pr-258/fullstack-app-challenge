import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DrawerFooter } from "@/components/ui/drawer"

type FooterProps = {
  requestId?: string
  canEdit?: boolean
  canCancel?: boolean
  cancelling: boolean
  cancelPending: boolean
  cancelError?: string | null
  onStartCancel: () => void
  onCancelCancel: () => void
  onConfirmCancel: () => void
}

export function Footer({
  requestId,
  canEdit,
  canCancel,
  cancelling,
  cancelPending,
  cancelError,
  onStartCancel,
  onCancelCancel,
  onConfirmCancel,
}: FooterProps) {
  const hasFooter = canEdit || canCancel

  if (!hasFooter) return null

  return (
    <DrawerFooter className="border-t bg-muted/50">
      {canCancel && cancelling ? (
        <div className="space-y-2">
          <p className="text-sm">
            Tens a certeza que queres cancelar este pedido?
          </p>
          {cancelError && (
            <p className="text-sm text-destructive">{cancelError}</p>
          )}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              disabled={cancelPending}
              onClick={onConfirmCancel}
            >
              Confirmar
            </Button>
            <Button variant="outline" onClick={onCancelCancel}>
              Voltar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          {canEdit && (
            <Button asChild variant="outline" size="lg">
              <Link href={`/vacation-requests/${requestId}/edit`}>Editar</Link>
            </Button>
          )}

          {canCancel && (
            <Button variant="destructive" size="lg" onClick={onStartCancel}>
              Cancelar pedido
            </Button>
          )}
        </div>
      )}
    </DrawerFooter>
  )
}
