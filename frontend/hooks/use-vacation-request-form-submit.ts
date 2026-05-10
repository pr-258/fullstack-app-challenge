import { useState } from "react"
import { useRouter } from "next/navigation"

import { ApiError } from "@/api/client/fetcher"
import {
  useCreateVacationRequestMutation,
  useUpdateVacationRequestMutation,
} from "@/queries/vacation-requests"

type VacationRequestFormValues = {
  startDate: string
  endDate: string
  reason?: string
  collaboratorId?: string
}

type UseVacationRequestFormSubmitParams =
  | {
      mode: "create"
      actingUserId?: string
      isAdmin?: boolean
    }
  | {
      mode: "edit"
      requestId: string
      actingUserId?: string
    }

export function useVacationRequestFormSubmit(
  params: UseVacationRequestFormSubmitParams
) {
  const router = useRouter()
  const [rootError, setRootError] = useState<string>()

  const create = useCreateVacationRequestMutation(params.actingUserId!)
  const update = useUpdateVacationRequestMutation(
    params.mode === "edit" ? params.requestId : "",
    params.actingUserId!
  )

  function onSubmit(values: VacationRequestFormValues) {
    const mutationOptions = {
      onSuccess: () => router.replace("/vacation-requests"),
      onError: (err: unknown) => {
        setRootError(getVacationRequestFormErrorMessage(err))
      },
    }

    if (params.mode === "create") {
      create.mutate(
        {
          collaboratorId: params.isAdmin
            ? values.collaboratorId!
            : params.actingUserId!,
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.reason || null,
        },
        mutationOptions
      )
      return
    }

    update.mutate(
      {
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason || null,
      },
      mutationOptions
    )
  }

  return {
    rootError,
    isPending: params.mode === "create" ? create.isPending : update.isPending,
    onSubmit,
  }
}

function getVacationRequestFormErrorMessage(err: unknown) {
  if (err instanceof ApiError && err.code === "VACATION_OVERLAP") {
    return "Já existe um pedido de férias aprovado neste período."
  }

  if (err instanceof Error) return err.message

  return "Erro desconhecido"
}
