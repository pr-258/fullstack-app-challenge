"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Calendar02Icon,
  Calendar03Icon,
  DashboardSquare01Icon,
  Logout01Icon,
  UserMultiple02Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useActingUserStore } from "@/stores/acting-user-store"
import { roleLabels } from "@/types/api"
import type { Role } from "@/types/api"
import { cn } from "@/lib/utils"

type navItem = {
  label: string
  href: string
  icon: typeof DashboardSquare01Icon
  roles?: Role[]
}

const navItems: navItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
  {
    label: "Colaboradores",
    href: "/users",
    icon: UserMultiple02Icon,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Pedidos de Férias",
    href: "/vacation-requests",
    icon: Calendar03Icon,
  },
  {
    label: "Calendário",
    href: "/calendar",
    icon: Calendar02Icon,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { actingUser, clearActingUser } = useActingUserStore()

  function handleLogout() {
    clearActingUser()
    router.replace("/login")
  }

  return (
    <aside className="flex h-svh w-56 shrink-0 flex-col border-r bg-card">
      <div className="flex items-center gap-3 p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
          T
        </div>
        <div>
          <p className="text-sm font-semibold">TaskFlow</p>
          <p className="text-xs text-muted-foreground">Férias</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems
          .filter(
            (item) =>
              !item.roles ||
              (actingUser?.role && item.roles.includes(actingUser.role))
          )
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className="size-4 shrink-0"
              />
              {item.label}
            </Link>
          ))}
      </nav>

      <div className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50">
            <Avatar size="sm">
              <AvatarFallback>{actingUser?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate font-medium">{actingUser?.name}</p>
              <p className="text-xs text-muted-foreground">
                {actingUser?.role ? roleLabels[actingUser.role] : null}
              </p>
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="size-4 shrink-0 text-muted-foreground"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            <DropdownMenuItem onClick={handleLogout}>
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
              Terminar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
