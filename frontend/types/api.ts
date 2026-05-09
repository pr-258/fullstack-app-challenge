export type Role = "ADMIN" | "MANAGER" | "COLLABORATOR"

export type VacationRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"

export type ApiFieldError = {
  field: string
  message: string
}

export type ApiErrorResponse = {
  timestamp: string
  status: number
  error: string
  message: string
  fieldErrors: ApiFieldError[]
}

export type PageResponse<T> = {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type MockUser = {
  id: string
  name: string
  email: string
  role: Role
  managerId: string | null
  managerName: string | null
}

export type MeResponse = {
  id: string
  name: string
  email: string
  role: Role
  permissions: string[]
}

export type User = {
  id: string
  name: string
  email: string
  role: Role
  managerId: string | null
  managerName: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type UserPayload = {
  name: string
  email: string
  role: Role
  managerId?: string | null
}

export type VacationRequest = {
  id: string
  collaboratorId: string
  collaboratorName: string
  managerId: string | null
  managerName: string | null
  startDate: string
  endDate: string
  inclusiveDays: number
  status: VacationRequestStatus
  reason: string | null
  rejectionReason: string | null
  reviewedById: string | null
  reviewedByName: string | null
  reviewedAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
}

export type CreateVacationRequestPayload = {
  collaboratorId: string
  startDate: string
  endDate: string
  reason?: string | null
}

export type UpdateVacationRequestPayload = {
  startDate: string
  endDate: string
  reason?: string | null
}

export type RejectVacationRequestPayload = {
  rejectionReason: string
}
