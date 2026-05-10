import { useState } from "react"

import { useDeleteUserMutation } from "@/queries/users"
import type { User } from "@/types/api"

type UseUserDetailActionsParams = {
  user: User | null
  actingUserId: string
  onOpenChange: (open: boolean) => void
}

export function useUserDetailActions({
  user,
  actingUserId,
  onOpenChange,
}: UseUserDetailActionsParams) {
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

  return {
    deleting,
    deletePending: deleteUser.isPending,
    setDeleting,
    handleOpenChange,
    handleConfirmDelete,
  }
}
