import { useState } from "react"
import { useRouter } from "next/navigation"

import { ApiError } from "@/api/client/fetcher"
import { useCreateUserMutation, useUpdateUserMutation } from "@/queries/users"
import type { Role } from "@/types/api"

type UserFormValues = {
  name: string
  email: string
  role: Role
  managerId?: string
}

type UseUserFormSubmitParams =
  | {
      mode: "create"
      actingUserId?: string
    }
  | {
      mode: "edit"
      userId: string
      actingUserId?: string
    }

export function useUserFormSubmit(params: UseUserFormSubmitParams) {
  const router = useRouter()
  const [rootError, setRootError] = useState<string>()

  const create = useCreateUserMutation(params.actingUserId!)
  const update = useUpdateUserMutation(
    params.mode === "edit" ? params.userId : "",
    params.actingUserId!
  )

  const mutation = params.mode === "create" ? create : update

  function onSubmit(values: UserFormValues) {
    mutation.mutate(
      {
        name: values.name,
        email: values.email,
        role: values.role,
        managerId:
          values.role === "COLLABORATOR" ? (values.managerId ?? null) : null,
      },
      {
        onSuccess: () => router.replace("/users"),
        onError: (err) => {
          setRootError(getUserFormErrorMessage(err))
        },
      }
    )
  }

  return {
    rootError,
    isPending: mutation.isPending,
    onSubmit,
  }
}

function getUserFormErrorMessage(err: unknown) {
  if (err instanceof ApiError && err.code === "EMAIL_CONFLICT") {
    return "Já existe um utilizador com este email."
  }

  if (err instanceof Error) return err.message

  return "Erro desconhecido"
}
