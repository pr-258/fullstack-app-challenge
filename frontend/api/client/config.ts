export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const ACTING_USER_HEADER = "X-Acting-User-Id"

export const API_ENDPOINTS = {
  auth: "/api/auth",
  users: "/api/users",
  vacationRequests: "/api/vacation-requests",
} as const
