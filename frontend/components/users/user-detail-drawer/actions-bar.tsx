import { DrawerActionBar } from "@/components/details-drawer/detail-drawer-primitives"
import type { User } from "@/types/api"

type ActionsBarProps = {
  user: User | null
}

export function ActionsBar({ user }: ActionsBarProps) {
  if (!user) return null

  return (
    <DrawerActionBar>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Status:
        </span>
        <span className="rounded-full border bg-card px-2 py-1 text-xs font-medium">
          {user.active ? "Ativo" : "Inativo"}
        </span>
      </div>
    </DrawerActionBar>
  )
}
