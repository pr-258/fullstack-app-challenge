"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { User } from "@/types/api"

import { ActionsBar } from "./actions-bar"
import { Details } from "./details"
import { Footer } from "./footer"
import { useUserDetailActions } from "@/hooks/use-user-detail-actions"

interface UserDetailDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  actingUserId: string
  isAdmin?: boolean
}

export function UserDetailDrawer({
  user,
  open,
  onOpenChange,
  actingUserId,
  isAdmin,
}: UserDetailDrawerProps) {
  const {
    deleting,
    deletePending,
    setDeleting,
    handleOpenChange,
    handleConfirmDelete,
  } = useUserDetailActions({
    user,
    actingUserId,
    onOpenChange,
  })

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Colaborador</DrawerTitle>
        </DrawerHeader>

        <ActionsBar user={user} />

        <Details user={user} />

        <Footer
          userId={user?.id}
          isAdmin={isAdmin}
          deleting={deleting}
          deletePending={deletePending}
          onStartDelete={() => setDeleting(true)}
          onCancelDelete={() => setDeleting(false)}
          onConfirmDelete={handleConfirmDelete}
        />
      </DrawerContent>
    </Drawer>
  )
}
