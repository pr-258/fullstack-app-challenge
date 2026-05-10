import { roleLabels } from "@/types/api"
import type { User } from "@/types/api"
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHeadCell,
  TableHeader,
  TableRow,
} from "@/components/table/table-card"
import { Button } from "@/components/ui/button"

type UsersTableProps = {
  users: User[]
  onView: (user: User) => void
}

export function UsersTable({ users, onView }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeadCell>Nome</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Role</TableHeadCell>
          <TableHeadCell>Manager</TableHeadCell>
          <TableHeadCell>Ativo</TableHeadCell>
          <TableHeadCell>Ação</TableHeadCell>
        </tr>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>{roleLabels[user.role]}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.managerName ?? "-"}
              </TableCell>
              <TableCell>{user.active ? "Sim" : "Não"}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => onView(user)}>
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState colSpan={6}>Sem colaboradores.</TableEmptyState>
        )}
      </TableBody>
    </Table>
  )
}
