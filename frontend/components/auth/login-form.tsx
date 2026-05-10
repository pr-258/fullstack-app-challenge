"use client"

import { Button } from "@/components/ui/button"
import { SelectField } from "@/components/form/select-field"
import { roleLabels } from "@/types/api"

import { useLoginSelection } from "../../hooks/use-login-selection"

export function LoginForm() {
  const {
    roleOrder,
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
    <section className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6 p-6 shadow-sm">
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
          <SelectField
            label="Role"
            value={selectedRole}
            options={roleOrder.map((role) => ({
              value: role,
              label: roleLabels[role],
            }))}
            onValueChange={handleRoleChange}
            disabled={isLoading || isError}
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
