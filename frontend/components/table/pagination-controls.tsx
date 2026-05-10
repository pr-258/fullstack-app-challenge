import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type PaginationControlsProps = {
  page: number
  size: number
  totalItems: number
  totalPages: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  className?: string
}

export function PaginationControls({
  page,
  size,
  totalItems,
  totalPages,
  pageSizeOptions = [5, 10, 20],
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationControlsProps) {
  const currentPage = totalPages === 0 ? 0 : page + 1
  const startItem = totalItems === 0 ? 0 : page * size + 1
  const endItem = Math.min((page + 1) * size, totalItems)
  const canGoPrevious = page > 0
  const canGoNext = page + 1 < totalPages

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground",
        className
      )}
    >
      <p>
        A mostrar {startItem}-{endItem} de {totalItems}
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span>Tamanho</span>
          <Select
            value={String(size)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-20 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span>
          Página {currentPage} de {totalPages}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canGoPrevious}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canGoNext}
            onClick={() => onPageChange(page + 1)}
            aria-label="Página seguinte"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  )
}
