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
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const deleteUser = useDeleteUserMutation(actingUserId)

  function handleOpenChange(next: boolean) {
    if (!next) {
      setDeleting(false)
      setDeleteError(null)
    }
    onOpenChange(next)
  }

  function handleConfirmDelete() {
    if (!user) return
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        onOpenChange(false)
        setDeleting(false)
      },
      onError: () => setDeleteError("Erro ao apagar colaborador. Tenta novamente."),
    })
  }

  return {
    deleting,
    deleteError,
    deletePending: deleteUser.isPending,
    setDeleting,
    handleOpenChange,
    handleConfirmDelete,
  }
}
