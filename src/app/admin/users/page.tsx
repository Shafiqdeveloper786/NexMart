import { getAllUsers } from "@/lib/actions/user.actions";
import { UserCrudTable } from "@/components/admin/UserCrudTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-8 text-foreground bg-background">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View accounts and manage user roles</p>
      </div>

      {/* Control matrix */}
      <UserCrudTable initialUsers={users as any} />
    </div>
  );
}
