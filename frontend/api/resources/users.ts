import { apiRequest } from "@/api/client/fetcher"
import { API_ENDPOINTS } from "@/api/client/config"
import type { PageResponse, Role, User, UserPayload } from "@/types/api"

export type ListUsersParams = {
  actingUserId: string
  role?: Role
  managerId?: string
  search?: string
  page?: number
  size?: number
  sort?: string
}

export function listUsers({ actingUserId, ...query }: ListUsersParams) {
  return apiRequest<PageResponse<User>>(API_ENDPOINTS.users, {
    actingUserId,
    query,
  })
}

export function getUser(id: string, actingUserId: string) {
  return apiRequest<User>(`${API_ENDPOINTS.users}/${id}`, { actingUserId })
}

export function createUser(body: UserPayload, actingUserId: string) {
  return apiRequest<User>(API_ENDPOINTS.users, {
    method: "POST",
    actingUserId,
    body,
  })
}

export function updateUser(
  id: string,
  body: UserPayload,
  actingUserId: string
) {
  return apiRequest<User>(`${API_ENDPOINTS.users}/${id}`, {
    method: "PUT",
    actingUserId,
    body,
  })
}

export function deleteUser(id: string, actingUserId: string) {
  return apiRequest<void>(`${API_ENDPOINTS.users}/${id}`, {
    method: "DELETE",
    actingUserId,
  })
}
