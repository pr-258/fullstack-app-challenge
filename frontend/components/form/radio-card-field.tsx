interface RadioCardOption {
  value: string
  label: string
  description: string
}

interface RadioCardFieldProps {
  label: string
  value: string | undefined
  options: RadioCardOption[]
  onChange: (value: string) => void
  error?: string
}

export function RadioCardField({
  label,
  value,
  options,
  onChange,
  error,
}: RadioCardFieldProps) {
  return (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                "flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-background hover:border-muted-foreground/40",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "mt-0.5 size-3.5 shrink-0 rounded-full border-2 transition-colors",
                    selected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/50",
                  ].join(" ")}
                />
                <span className="font-medium leading-tight">{option.label}</span>
              </div>
              <p className="pl-5 text-xs text-muted-foreground leading-snug">
                {option.description}
              </p>
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
