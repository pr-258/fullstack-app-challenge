import { z } from "zod"

export const roleSchema = z.enum(["ADMIN", "MANAGER", "COLLABORATOR"], {
  message: "Campo obrigatório",
})

export const userSchema = z
  .object({
    name: z.string().min(1, "Campo obrigatório"),
    email: z.string().min(1, "Campo obrigatório").email("Email inválido"),
    role: roleSchema,
    managerId: z.string().optional(),
  })
  .refine((data) => data.role !== "COLLABORATOR" || !!data.managerId, {
    message: "Campo obrigatório",
    path: ["managerId"],
  })
