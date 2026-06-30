"use client";

import { toggleUserRole, deleteUser } from "@/lib/actions/user.actions";
import { Search, ShieldAlert, ShieldCheck, Trash2, Eye, Ban, UserCheck } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
}

interface UserCrudTableProps {
  initialUsers: UserItem[];
}

export function UserCrudTable({ initialUsers }: UserCrudTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const filteredUsers = initialUsers.filter((user) =>
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleRole = async (userId: string, name: string | null, currentRole: string) => {
    const labelName = name ?? "User";
    if (!confirm(`Are you sure you want to change ${labelName}'s security clearance?`)) return;

    try {
      await toggleUserRole(userId);
      toast.success(`Clearance adjusted for ${labelName}`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to adjust security clearance");
    }
  };

  const handleDeleteUser = async (userId: string, name: string | null) => {
    const labelName = name ?? "User";
    if (!confirm(`Are you sure you want to delete user ${labelName}? This action cannot be undone.`)) return;

    try {
      await deleteUser(userId);
      toast.success(`User ${labelName} deleted successfully`);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const handleViewDetails = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex bg-muted/40 p-4 rounded-2xl border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs focus:border-foreground outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="bg-card border border-border overflow-hidden rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="font-mono text-xs text-muted-foreground uppercase">
                        #{user.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-foreground block">
                        {user.name ?? "Anonymous"}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                          user.role === "ADMIN" 
                            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30 font-bold" 
                            : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-muted-foreground">
                        {isHydrated ? new Date(user.createdAt).toLocaleDateString() : new Date(user.createdAt).toISOString().split('T')[0]}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                          title="View details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleToggleRole(user.id, user.name, user.role)}
                          disabled={isPending}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border transition-all ${
                            user.role === "ADMIN"
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                              : "bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-background"
                          } disabled:opacity-50`}
                        >
                          {user.role === "ADMIN" ? (
                            <>
                              <ShieldAlert size={11} />
                              <span>Revoke Admin</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={11} />
                              <span>Make Admin</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={isPending}
                          className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
