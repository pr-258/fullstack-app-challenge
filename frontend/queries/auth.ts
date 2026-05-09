import { useQuery } from "@tanstack/react-query"

import { getMe, getMockUsers } from "@/api/resources/auth"

export const authQueryKeys = {
  all: ["auth"] as const,
  mockUsers: () => [...authQueryKeys.all, "mock-users"] as const,
  me: (actingUserId: string | null | undefined) =>
    [...authQueryKeys.all, "me", actingUserId] as const,
}

export function useMockUsersQuery() {
  return useQuery({
    queryKey: authQueryKeys.mockUsers(),
    queryFn: getMockUsers,
  })
}

export function useMeQuery(actingUserId: string | null | undefined) {
  return useQuery({
    queryKey: authQueryKeys.me(actingUserId),
    queryFn: () => getMe(actingUserId as string),
    enabled: Boolean(actingUserId),
  })
}
