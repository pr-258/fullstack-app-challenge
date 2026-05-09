import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  approveVacationRequest,
  cancelVacationRequest,
  createVacationRequest,
  getVacationRequest,
  listVacationRequests,
  rejectVacationRequest,
  updateVacationRequest,
  type ListVacationRequestsParams,
} from "@/api/resources/vacation-requests"
import type {
  CreateVacationRequestPayload,
  RejectVacationRequestPayload,
  UpdateVacationRequestPayload,
} from "@/types/api"

export const vacationRequestQueryKeys = {
  all: ["vacation-requests"] as const,
  lists: () => [...vacationRequestQueryKeys.all, "list"] as const,
  list: (params: ListVacationRequestsParams) =>
    [...vacationRequestQueryKeys.lists(), params] as const,
  detail: (id: string, actingUserId: string) =>
    [...vacationRequestQueryKeys.all, "detail", id, actingUserId] as const,
}

export function useVacationRequestsQuery(
  params: ListVacationRequestsParams | null
) {
  return useQuery({
    queryKey: params
      ? vacationRequestQueryKeys.list(params)
      : vacationRequestQueryKeys.lists(),
    queryFn: () => listVacationRequests(params as ListVacationRequestsParams),
    enabled: Boolean(params?.actingUserId),
  })
}

export function useVacationRequestQuery(
  id: string | null,
  actingUserId: string | null
) {
  return useQuery({
    queryKey:
      id && actingUserId
        ? vacationRequestQueryKeys.detail(id, actingUserId)
        : vacationRequestQueryKeys.all,
    queryFn: () => getVacationRequest(id as string, actingUserId as string),
    enabled: Boolean(id && actingUserId),
  })
}

export function useCreateVacationRequestMutation(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateVacationRequestPayload) =>
      createVacationRequest(body, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vacationRequestQueryKeys.all }),
  })
}

export function useUpdateVacationRequestMutation(
  id: string,
  actingUserId: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateVacationRequestPayload) =>
      updateVacationRequest(id, body, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vacationRequestQueryKeys.all }),
  })
}

export function useApproveVacationRequestMutation(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => approveVacationRequest(id, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vacationRequestQueryKeys.all }),
  })
}

export function useRejectVacationRequestMutation(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: RejectVacationRequestPayload
    }) => rejectVacationRequest(id, body, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vacationRequestQueryKeys.all }),
  })
}

export function useCancelVacationRequestMutation(actingUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cancelVacationRequest(id, actingUserId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vacationRequestQueryKeys.all }),
  })
}
