"use client"

import { useState, type ReactNode } from "react"
import { FilterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CollapsibleFilterPanelProps = {
  summary: string
  activeFilterCount: number
  onClearFilters: () => void
  children: ReactNode
  className?: string
}

export function CollapsibleFilterPanel({
  summary,
  activeFilterCount,
  onClearFilters,
  children,
  className,
}: CollapsibleFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasActiveFilters = activeFilterCount > 0
  const isPanelOpen = isOpen || hasActiveFilters

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-medium text-muted-foreground">{summary}</p>

        <div className="flex items-center gap-2">
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => {
                onClearFilters()
                setIsOpen(false)
              }}
            >
              Limpar
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="lg"
            aria-expanded={isPanelOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            <HugeiconsIcon icon={FilterIcon} strokeWidth={2} />
            {hasActiveFilters ? `Filtros (${activeFilterCount})` : "Filtros"}
          </Button>
        </div>
      </div>

      {isPanelOpen ? children : null}
    </div>
  )
}

type FilterBarProps = {
  children: ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-end gap-3", className)}>
      {children}
    </div>
  )
}

type FilterFieldProps = {
  label: string
  children: ReactNode
  className?: string
}

export function FilterField({ label, children, className }: FilterFieldProps) {
  return (
    <label className={cn("grid min-w-40 gap-1.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

type FilterTextInputProps = React.ComponentProps<"input">

export function FilterTextInput({ className, ...props }: FilterTextInputProps) {
  return (
    <input
      className={cn(
        "h-8 rounded-md border border-input bg-background px-3 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        className
      )}
      {...props}
    />
  )
}
