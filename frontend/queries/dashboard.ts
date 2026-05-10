import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "@/api/resources/dashboard"

export const dashboardQueryKeys = {
  stats: (actingUserId: string) => ["dashboard", "stats", actingUserId] as const,
}

export function useDashboardStatsQuery(actingUserId: string | null) {
  return useQuery({
    queryKey: actingUserId
      ? dashboardQueryKeys.stats(actingUserId)
      : ["dashboard", "stats"],
    queryFn: () => getDashboardStats(actingUserId as string),
    enabled: Boolean(actingUserId),
  })
}
