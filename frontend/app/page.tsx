"use client"

import { useMockUsersQuery } from "@/queries/auth"
import { API_BASE_URL } from "@/api/client/config"
import { Button } from "@/components/ui/button"

const roleLabels = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  COLLABORATOR: "Collaborator",
} as const

export default function Page() {
  const {
    data: users,
    error,
    isError,
    isLoading,
    refetch,
  } = useMockUsersQuery()

  return (
    <main className="min-h-svh p-6">
      <div className="flex max-w-3xl min-w-0 flex-col gap-6 text-sm">
        <section className="space-y-2">
          <h1 className="text-xl font-semibold">
            Frontend foundation smoke test
          </h1>
          <p className="text-muted-foreground">
            Temporary home page to verify the API resource layer, TanStack
            Query, and React Query Devtools before building the real layout.
          </p>
        </section>

        <section className="rounded-md border p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-medium">Backend connection</h2>
              <p className="font-mono text-xs text-muted-foreground">
                {API_BASE_URL}/api/auth/mock-users
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Refetch
            </Button>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading mock users...</p>
          ) : isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <p className="font-medium">Could not load mock users.</p>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-3 py-2">
                        <div className="font-medium">{user.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {user.id}
                        </div>
                      </td>
                      <td className="px-3 py-2">{roleLabels[user.role]}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {user.managerName ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
