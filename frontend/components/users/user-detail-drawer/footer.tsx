import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DrawerFooter } from "@/components/ui/drawer"

type FooterProps = {
  userId?: string
  isAdmin?: boolean
  deleting: boolean
  deletePending: boolean
  onStartDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
}

export function Footer({
  userId,
  isAdmin,
  deleting,
  deletePending,
  onStartDelete,
  onCancelDelete,
  onConfirmDelete,
}: FooterProps) {
  if (!isAdmin) return null

  return (
    <DrawerFooter className="border-t bg-muted/50">
      {deleting ? (
        <div className="space-y-2">
          <p className="text-sm">
            Tens a certeza que queres apagar este colaborador?
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              disabled={deletePending}
              onClick={onConfirmDelete}
            >
              Confirmar
            </Button>
            <Button variant="outline" onClick={onCancelDelete}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" size="lg">
            <Link href={`/users/${userId}/edit`}>Editar</Link>
          </Button>
          <Button variant="destructive" size="lg" onClick={onStartDelete}>
            Apagar
          </Button>
        </div>
      )}
    </DrawerFooter>
  )
}
