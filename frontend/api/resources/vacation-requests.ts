import { apiRequest } from "@/api/client/fetcher"
import { API_ENDPOINTS } from "@/api/client/config"
import type {
  CreateVacationRequestPayload,
  PageResponse,
  RejectVacationRequestPayload,
  UpdateVacationRequestPayload,
  VacationRequest,
  VacationRequestStatus,
} from "@/types/api"

export type ListVacationRequestsParams = {
  actingUserId: string
  status?: VacationRequestStatus
  collaboratorId?: string
  managerId?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  size?: number
  sort?: string
}

export function listVacationRequests({
  actingUserId,
  ...query
}: ListVacationRequestsParams) {
  return apiRequest<PageResponse<VacationRequest>>(
    API_ENDPOINTS.vacationRequests,
    {
      actingUserId,
      query,
    }
  )
}

export function getVacationRequest(id: string, actingUserId: string) {
  return apiRequest<VacationRequest>(
    `${API_ENDPOINTS.vacationRequests}/${id}`,
    {
      actingUserId,
    }
  )
}

export function createVacationRequest(
  body: CreateVacationRequestPayload,
  actingUserId: string
) {
  return apiRequest<VacationRequest>(API_ENDPOINTS.vacationRequests, {
    method: "POST",
    actingUserId,
    body,
  })
}

export function updateVacationRequest(
  id: string,
  body: UpdateVacationRequestPayload,
  actingUserId: string
) {
  return apiRequest<VacationRequest>(
    `${API_ENDPOINTS.vacationRequests}/${id}`,
    {
      method: "PUT",
      actingUserId,
      body,
    }
  )
}

export function approveVacationRequest(id: string, actingUserId: string) {
  return apiRequest<VacationRequest>(
    `${API_ENDPOINTS.vacationRequests}/${id}/approve`,
    {
      method: "POST",
      actingUserId,
    }
  )
}

export function rejectVacationRequest(
  id: string,
  body: RejectVacationRequestPayload,
  actingUserId: string
) {
  return apiRequest<VacationRequest>(
    `${API_ENDPOINTS.vacationRequests}/${id}/reject`,
    {
      method: "POST",
      actingUserId,
      body,
    }
  )
}

export function cancelVacationRequest(id: string, actingUserId: string) {
  return apiRequest<void>(`${API_ENDPOINTS.vacationRequests}/${id}/cancel`, {
    method: "POST",
    actingUserId,
  })
}
