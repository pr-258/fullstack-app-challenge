import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  options: Option[]
  onValueChange: (value: string) => void
  disabled?: boolean
}

export function SelectField({
  label,
  value,
  options,
  onValueChange,
  disabled,
}: SelectFieldProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}
