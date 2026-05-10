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
import { statusLabels } from "@/types/api"
import type { User, VacationRequestStatus } from "@/types/api"

const ALL_STATUSES = "all"
const ALL_COLLABORATORS = "all"
const ALL_MANAGERS = "all"

type VacationRequestTableFiltersProps = {
  totalItems: number
  activeFilterCount: number
  search: string
  status: VacationRequestStatus | typeof ALL_STATUSES
  collaboratorId: string
  managerId: string
  startDate: string
  endDate: string
  collaboratorOptions: User[]
  managerOptions: User[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: VacationRequestStatus | typeof ALL_STATUSES) => void
  onCollaboratorChange: (value: string) => void
  onManagerChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onClearFilters: () => void
}

export function VacationRequestTableFilters({
  totalItems,
  activeFilterCount,
  search,
  status,
  collaboratorId,
  managerId,
  startDate,
  endDate,
  collaboratorOptions,
  managerOptions,
  onSearchChange,
  onStatusChange,
  onCollaboratorChange,
  onManagerChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: VacationRequestTableFiltersProps) {
  return (
    <CollapsibleFilterPanel
      summary={`${totalItems} pedidos`}
      activeFilterCount={activeFilterCount}
      onClearFilters={onClearFilters}
    >
      <FilterBar>
        <FilterField label="Pesquisar" className="min-w-64 flex-1">
          <FilterTextInput
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Colaborador ou motivo"
          />
        </FilterField>

        <FilterField label="Estado">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>Todos</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Colaborador">
          <Select value={collaboratorId} onValueChange={onCollaboratorChange}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_COLLABORATORS}>Todos</SelectItem>
              {collaboratorOptions.map((collaborator) => (
                <SelectItem key={collaborator.id} value={collaborator.id}>
                  {collaborator.name}
                </SelectItem>
              ))}
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

        <FilterField label="Início">
          <FilterTextInput
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
        </FilterField>

        <FilterField label="Fim">
          <FilterTextInput
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </FilterField>
      </FilterBar>
    </CollapsibleFilterPanel>
  )
}

export { ALL_COLLABORATORS, ALL_MANAGERS, ALL_STATUSES }
