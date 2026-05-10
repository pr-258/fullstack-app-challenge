"use client"

import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userSchema } from "@/types/schemas/user"
import { roleLabels } from "@/types/api"
import type { User } from "@/types/api"

type FormValues = z.infer<typeof userSchema>

const roles = ["ADMIN", "MANAGER", "COLLABORATOR"] as const

interface UserFormProps {
  defaultValues?: Partial<FormValues>
  onSubmit: (values: FormValues) => void
  isPending?: boolean
  onCancel: () => void
  submitLabel?: string
  managers: User[]
  rootError?: string
}

export function UserForm({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
  submitLabel = "Criar",
  managers,
  rootError,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  const selectedRole = useWatch({ control, name: "role" })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <label className="grid gap-2 text-sm">
        <span className="font-medium">Nome</span>
        <input
          type="text"
          {...register("name")}
          placeholder="Nome completo"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Email</span>
        <input
          type="email"
          {...register("email")}
          placeholder="email@empresa.com"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Role</span>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleciona um role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabels[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-xs text-destructive">{errors.role.message}</p>
        )}
      </label>

      {selectedRole === "COLLABORATOR" && (
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Manager</span>
          <Controller
            name="managerId"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleciona um manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.managerId && (
            <p className="text-xs text-destructive">{errors.managerId.message}</p>
          )}
        </label>
      )}

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
