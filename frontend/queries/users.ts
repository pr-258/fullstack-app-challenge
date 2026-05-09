import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
  type ListUsersParams,
} from "@/api/resources/users"
import type { UserPayload } from "@/types/api"

export const usersQueryKeys = {
  all: ["users"] as const,
  lists: () => [...usersQueryKeys.all, "list"] as const,
  list: (params: ListUsersParams) =>
    [...usersQueryKeys.lists(), params] as const,
  detail: (id: string, actingUserId: string) =>
    [...usersQueryKeys.all, "detail", id, actingUserId] as const,
}

export function useUsersQuery(params: ListUsersParams | null) {
  return useQuery({
    queryKey: params ? usersQueryKeys.list(params) : usersQueryKeys.lists(),
    queryFn: () => listUsers(params as ListUsersParams),
    enabled: Boolean(params?.actingUserId),
  })
}

export function useUserQuery(id: string | null, actingUserId: string | null) {
  return useQuery({
    queryKey:
      id && actingUserId
        ? usersQueryKeys.detail(id, actingUserId)
        : usersQueryKeys.all,
    queryFn: () => getUser(id as string, actingUserId as string),
    enabled: Boolean(id && actingUserId),
  })
}

export function useCreateUserMutation(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UserPayload) => createUser(body, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() }),
  })
}

export function useUpdateUserMutation(id: string, actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UserPayload) => updateUser(id, body, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all }),
  })
}

export function useDeleteUserMutation(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all }),
  })
}
