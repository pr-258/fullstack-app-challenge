"use client"

import { useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  adminVacationSchema,
  collaboratorVacationSchema,
} from "@/types/schemas/vacation-request"
import type { User } from "@/types/api"

type BaseValues = z.infer<typeof collaboratorVacationSchema>
type FormValues = BaseValues & { collaboratorId?: string }

interface VacationRequestFormProps {
  defaultValues?: Partial<BaseValues>
  onSubmit: (values: FormValues) => void
  isPending?: boolean
  onCancel: () => void
  submitLabel?: string
  collaborators?: User[]
  rootError?: string
}

export function VacationRequestForm({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
  submitLabel = "Submeter",
  collaborators,
  rootError,
}: VacationRequestFormProps) {
  const isAdmin = !!collaborators

  const schema = useMemo(
    () => (isAdmin ? adminVacationSchema : collaboratorVacationSchema),
    [isAdmin]
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      {isAdmin && (
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Colaborador</span>
          <Controller
            name="collaboratorId"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleciona um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {collaborators!.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.collaboratorId && (
            <p className="text-xs text-destructive">
              {errors.collaboratorId.message}
            </p>
          )}
        </label>
      )}

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Data de início</span>
        <input
          type="date"
          {...register("startDate")}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        {errors.startDate && (
          <p className="text-xs text-destructive">{errors.startDate.message}</p>
        )}
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Data de fim</span>
        <input
          type="date"
          {...register("endDate")}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        {errors.endDate && (
          <p className="text-xs text-destructive">{errors.endDate.message}</p>
        )}
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">
          Motivo <span className="text-muted-foreground">(opcional)</span>
        </span>
        <Textarea
          {...register("reason")}
          placeholder="Descreve o motivo do pedido"
        />
      </label>

      {rootError && (
        <p className="text-sm text-destructive">{rootError}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting || isPending}>
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
