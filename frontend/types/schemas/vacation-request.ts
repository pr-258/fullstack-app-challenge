import { z } from "zod"

export const collaboratorVacationSchema = z
  .object({
    startDate: z.string().min(1, "Campo obrigatório"),
    endDate: z.string().min(1, "Campo obrigatório"),
    reason: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "A data de fim não pode ser anterior à data de início",
    path: ["endDate"],
  })

export const adminVacationSchema = collaboratorVacationSchema.and(
  z.object({
    collaboratorId: z.string().min(1, "Campo obrigatório"),
  })
)
