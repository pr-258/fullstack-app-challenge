import { ACTING_USER_HEADER, API_BASE_URL } from "@/api/client/config"
import type { ApiErrorResponse } from "@/types/api"

type RequestOptions = Omit<RequestInit, "body"> & {
  actingUserId?: string | null
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fieldErrors: ApiErrorResponse["fieldErrors"]
  readonly payload: ApiErrorResponse

  constructor(payload: ApiErrorResponse) {
    super(payload.message)
    this.name = "ApiError"
    this.status = payload.status
    this.code = payload.error
    this.fieldErrors = payload.fieldErrors ?? []
    this.payload = payload
  }
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${API_BASE_URL}${normalizedPath}`)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

function buildHeaders(options: RequestOptions) {
  const headers = new Headers(options.headers)

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (options.actingUserId) {
    headers.set(ACTING_USER_HEADER, options.actingUserId)
  }

  return headers
}

async function parseError(response: Response): Promise<ApiErrorResponse> {
  const fallback = {
    timestamp: new Date().toISOString(),
    status: response.status,
    error: response.statusText || "REQUEST_ERROR",
    message: "Request failed",
    fieldErrors: [],
  }

  try {
    return { ...fallback, ...(await response.json()) }
  } catch {
    return fallback
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
) {
  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers: buildHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (!response.ok) {
    throw new ApiError(await parseError(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
