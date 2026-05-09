"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiError } from "@/api/client/fetcher"
import { useCreateUserMutation } from "@/queries/users"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import { roleLabels } from "@/types/api"
import { userSchema } from "@/types/schemas/user"

type FormValues = z.infer<typeof userSchema>

const roles = ["ADMIN", "MANAGER", "COLLABORATOR"] as const

export default function NewUserPage() {
  const router = useRouter()
  const { actingUserId } = useActingUserStore()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
  })

  const selectedRole = watch("role")

  const { data: managersData } = useUsersQuery(
    actingUserId && selectedRole === "COLLABORATOR"
      ? { actingUserId, role: "MANAGER" }
      : null
  )
  const managers = managersData?.items ?? []

  const create = useCreateUserMutation(actingUserId!)

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      email: values.email,
      role: values.role,
      managerId: values.role === "COLLABORATOR" ? (values.managerId ?? null) : null,
    }

    create.mutate(payload, {
      onSuccess: () => router.replace("/users"),
      onError: (err) => {
        const message =
          err instanceof ApiError && err.code === "EMAIL_CONFLICT"
            ? "Já existe um utilizador com este email."
            : err instanceof Error
              ? err.message
              : "Erro desconhecido"

        setError("root", { message })
      },
    })
  }

  return (
    <>
      <PageHeader
        title="Novo Colaborador"
        description="Preenche os campos para adicionar um colaborador."
      />
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
              <p className="text-xs text-destructive">
                {errors.managerId.message}
              </p>
            )}
          </label>
        )}

        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || create.isPending}>
            Criar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.replace("/users")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </>
  )
}
