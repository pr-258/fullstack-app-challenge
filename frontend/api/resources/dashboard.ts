import { apiRequest } from "@/api/client/fetcher"
import { API_ENDPOINTS } from "@/api/client/config"
import type { DashboardStats } from "@/types/api"

export function getDashboardStats(actingUserId: string) {
  return apiRequest<DashboardStats>(API_ENDPOINTS.dashboardStats, {
    actingUserId,
  })
}
