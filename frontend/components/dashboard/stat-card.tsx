import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string | number
  bars?: string[]
  className?: string
}

export function StatCard({
  label,
  value,
  bars = ["35%", "60%", "90%", "50%"],
  className,
}: StatCardProps) {
  return (
    <article
      className={cn("w-full rounded-xl border bg-muted p-1 pb-0", className)}
    >
      <div className="space-y-3 rounded-lg bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-3xl font-bold tracking-normal text-foreground">
            {value}
          </p>

          <div className="flex h-8 min-w-8 items-end gap-1" aria-hidden="true">
            {bars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={cn(
                  "w-1 flex-1 rounded-sm",
                  index === 2 ? "bg-primary" : "bg-muted-foreground/30"
                )}
                style={{ height }}
              />
            ))}
          </div>
        </div>

      </div>

      <div className="px-4 py-3">
        <p className="text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {label}
        </p>
      </div>
    </article>
  )
}
