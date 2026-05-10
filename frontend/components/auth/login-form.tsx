"use client"

import { Button } from "@/components/ui/button"
import { RadioCardField } from "@/components/form/radio-card-field"
import { SelectField } from "@/components/form/select-field"
import { useLoginSelection } from "../../hooks/use-login-selection"

const roleOptions = [
  {
    value: "ADMIN",
    label: "Admin",
    description: "Acesso total a utilizadores e todos os pedidos de férias",
  },
  {
    value: "MANAGER",
    label: "Manager",
    description: "Aprova/rejeita pedidos da sua equipa",
  },
  {
    value: "COLLABORATOR",
    label: "Colaborador",
    description: "Pode criar, ver, editar e cancelar os seus pedidos",
  },
]

export function LoginForm() {
  const {
    error,
    isError,
    isLoading,
    hasHydrated,
    selectedRole,
    selectedUser,
    usersForSelectedRole,
    handleRoleChange,
    handleUserChange,
    handleSelectUser,
  } = useLoginSelection()

  return (
    <section className="w-full px-4 sm:max-w-sm">
      <div className="space-y-6 py-8 sm:rounded-xl sm:border sm:p-8 sm:shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            TaskFlow Ltda.
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Acesso ao sistema
          </h2>
          <p className="text-xs text-muted-foreground">
            Seleciona o utilizador que está a atuar na aplicação. Esta
            autenticação é mockada para o assessment.
          </p>
        </div>
        <div className="space-y-4">
          <RadioCardField
            label="Role"
            value={selectedRole}
            options={roleOptions}
            onChange={handleRoleChange}
            cols={1}
          />

          <SelectField
            label="Utilizador"
            value={selectedUser?.id ?? ""}
            options={usersForSelectedRole.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            onValueChange={handleUserChange}
            disabled={isLoading || isError || usersForSelectedRole.length === 0}
          />

          {selectedUser && (
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{selectedUser.name}</p>
              <p>{selectedUser.email}</p>
              <p>Manager: {selectedUser.managerName ?? "-"}</p>
            </div>
          )}

          {isError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs">
              <p className="font-medium">Backend indisponível.</p>
              <p className="mt-1 text-muted-foreground">
                {error instanceof Error ? error.message : "Erro desconhecido"}
              </p>
            </div>
          )}

          <Button
            className="w-full"
            disabled={!hasHydrated || isLoading || isError || !selectedUser}
            onClick={() => handleSelectUser(selectedUser)}
          >
            Entrar no dashboard
          </Button>
        </div>
      </div>
    </section>
  )
}
