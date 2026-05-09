import { apiRequest } from "@/api/client/fetcher"
import { API_ENDPOINTS } from "@/api/client/config"
import type { MeResponse, MockUser } from "@/types/api"

export function getMockUsers() {
  return apiRequest<MockUser[]>(`${API_ENDPOINTS.auth}/mock-users`)
}

export function getMe(actingUserId: string) {
  return apiRequest<MeResponse>(`${API_ENDPOINTS.auth}/me`, { actingUserId })
}
