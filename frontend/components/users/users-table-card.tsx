import { PaginationControls } from "@/components/table/pagination-controls"
import {
  TableCard,
  TableCardContent,
  TableCardFooter,
  TableCardToolbar,
} from "@/components/table/table-card"
import type { Role, User } from "@/types/api"

import { ALL_MANAGERS, ALL_ROLES, UsersTableFilters } from "./users-table-filters"
import { UsersTable } from "./users-table"

type UsersTableCardProps = {
  users: User[]
  totalItems: number
  totalPages: number
  page: number
  size: number
  search: string
  role: Role | typeof ALL_ROLES
  managerId: string
  managerOptions: User[]
  activeFilterCount: number
  onSearchChange: (value: string) => void
  onRoleChange: (value: Role | typeof ALL_ROLES) => void
  onManagerChange: (value: typeof ALL_MANAGERS | string) => void
  onClearFilters: () => void
  onView: (user: User) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function UsersTableCard({
  users,
  totalItems,
  totalPages,
  page,
  size,
  search,
  role,
  managerId,
  managerOptions,
  activeFilterCount,
  onSearchChange,
  onRoleChange,
  onManagerChange,
  onClearFilters,
  onView,
  onPageChange,
  onPageSizeChange,
}: UsersTableCardProps) {
  return (
    <TableCard>
      <TableCardToolbar>
        <UsersTableFilters
          totalItems={totalItems}
          activeFilterCount={activeFilterCount}
          search={search}
          role={role}
          managerId={managerId}
          managerOptions={managerOptions}
          onSearchChange={onSearchChange}
          onRoleChange={onRoleChange}
          onManagerChange={onManagerChange}
          onClearFilters={onClearFilters}
        />
      </TableCardToolbar>

      <TableCardContent>
        <UsersTable users={users} onView={onView} />
      </TableCardContent>

      <TableCardFooter>
        <PaginationControls
          page={page}
          size={size}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </TableCardFooter>
    </TableCard>
  )
}
