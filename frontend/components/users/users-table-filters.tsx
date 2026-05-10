import {
  CollapsibleFilterPanel,
  FilterBar,
  FilterField,
  FilterTextInput,
} from "@/components/table/table-filters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Role, User } from "@/types/api"

const ALL_ROLES = "all"
const ALL_MANAGERS = "all"

type UsersTableFiltersProps = {
  totalItems: number
  activeFilterCount: number
  search: string
  role: Role | typeof ALL_ROLES
  managerId: string
  managerOptions: User[]
  onSearchChange: (value: string) => void
  onRoleChange: (value: Role | typeof ALL_ROLES) => void
  onManagerChange: (value: string) => void
  onClearFilters: () => void
}

export function UsersTableFilters({
  totalItems,
  activeFilterCount,
  search,
  role,
  managerId,
  managerOptions,
  onSearchChange,
  onRoleChange,
  onManagerChange,
  onClearFilters,
}: UsersTableFiltersProps) {
  return (
    <CollapsibleFilterPanel
      summary={`${totalItems} colaboradores`}
      activeFilterCount={activeFilterCount}
      onClearFilters={onClearFilters}
    >
      <FilterBar>
        <FilterField label="Pesquisar" className="min-w-64 flex-1">
          <FilterTextInput
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Nome ou email"
          />
        </FilterField>

        <FilterField label="Role">
          <Select value={role} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ROLES}>Todas</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="COLLABORATOR">Colaborador</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Manager">
          <Select value={managerId} onValueChange={onManagerChange}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_MANAGERS}>Todos</SelectItem>
              {managerOptions.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
      </FilterBar>
    </CollapsibleFilterPanel>
  )
}

export { ALL_MANAGERS, ALL_ROLES }
