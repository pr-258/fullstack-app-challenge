"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiError } from "@/api/client/fetcher"
import { useCreateVacationRequestMutation } from "@/queries/vacation-requests"
import { useUsersQuery } from "@/queries/users"
import { useActingUserStore } from "@/stores/acting-user-store"
import {
  adminVacationSchema,
  collaboratorVacationSchema,
} from "@/types/schemas/vacation-request"

export default function NewVacationRequestPage() {
  const router = useRouter()
  const { actingUserId, actingUser } = useActingUserStore()

  const isAdmin = actingUser?.role === "ADMIN"

  const schema = useMemo(
    () => (isAdmin ? adminVacationSchema : collaboratorVacationSchema),
    [isAdmin]
  )

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const { data: usersData } = useUsersQuery(
    isAdmin && actingUserId ? { actingUserId, role: "COLLABORATOR" } : null
  )
  const collaborators = usersData?.items ?? []

  const create = useCreateVacationRequestMutation(actingUserId!)

  function onSubmit(values: FormValues) {
    const payload = {
      collaboratorId: isAdmin
        ? (values as z.infer<typeof adminVacationSchema>).collaboratorId
        : actingUserId!,
      startDate: values.startDate,
      endDate: values.endDate,
      reason: values.reason || null,
    }

    create.mutate(payload, {
      onSuccess: () => router.replace("/vacation-requests"),
      onError: (err) => {
        const message =
          err instanceof ApiError && err.code === "VACATION_OVERLAP"
            ? "Já existe um pedido de férias aprovado neste período."
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
        title="Novo Pedido de Férias"
        description="Preenche os campos para submeter um pedido."
      />
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
                    {collaborators.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.root && (
              <p className="text-xs text-destructive">{errors.root.message}</p>
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
            Motivo{" "}
            <span className="text-muted-foreground">(opcional)</span>
          </span>
          <Textarea
            {...register("reason")}
            placeholder="Descreve o motivo do pedido"
          />
        </label>

        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || create.isPending}>
            Submeter
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.replace("/vacation-requests")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </>
  )
}
