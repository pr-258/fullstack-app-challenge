"use client"

import { useState } from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useDeleteUserMutation } from "@/queries/users"
import { roleLabels } from "@/types/api"
import type { User } from "@/types/api"

interface UserDetailDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  actingUserId: string
  isAdmin?: boolean
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? "-"}</p>
    </div>
  )
}

export function UserDetailDrawer({
  user,
  open,
  onOpenChange,
  actingUserId,
  isAdmin,
}: UserDetailDrawerProps) {
  const [deleting, setDeleting] = useState(false)

  const deleteUser = useDeleteUserMutation(actingUserId)

  function handleOpenChange(next: boolean) {
    if (!next) setDeleting(false)
    onOpenChange(next)
  }

  function handleConfirmDelete() {
    if (!user) return
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        onOpenChange(false)
        setDeleting(false)
      },
    })
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Colaborador</DrawerTitle>
        </DrawerHeader>

        {user && (
          <div className="space-y-4 p-4">
            <Field label="Nome" value={user.name} />
            <Field label="Email" value={user.email} />
            <Field label="Role" value={roleLabels[user.role]} />
            <Field label="Manager" value={user.managerName} />
            <Field label="Ativo" value={user.active ? "Sim" : "Não"} />
            <Field label="Criado em" value={user.createdAt} />
          </div>
        )}

        {isAdmin && <DrawerFooter>
          {deleting ? (
            <div className="space-y-2">
              <p className="text-sm">Tens a certeza que queres apagar este colaborador?</p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  disabled={deleteUser.isPending}
                  onClick={handleConfirmDelete}
                >
                  Confirmar
                </Button>
                <Button variant="outline" onClick={() => setDeleting(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/users/${user?.id}/edit`}>Editar</Link>
              </Button>
              <Button variant="outline" onClick={() => setDeleting(true)}>
                Apagar
              </Button>
            </div>
          )}
        </DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}
