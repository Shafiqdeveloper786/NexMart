"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Calendar, Shield, User, ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteUser } from "@/lib/actions/user.actions";

interface UserDetails {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  orders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    createdAt: Date;
    product: {
      name: string;
    };
  }>;
}

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`/api/users/${resolvedParams.id}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        toast.error("Failed to load user details");
        router.push("/admin/users");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [resolvedParams.id, router]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user ${user?.name || user?.email}? This action cannot be undone.`)) return;

    setDeleting(true);
    try {
      await deleteUser(resolvedParams.id);
      toast.success("User deleted successfully");
      router.push("/admin/users");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <User className="h-12 w-12 text-rose-500" />
        <p className="text-muted-foreground">User not found</p>
        <Link href="/admin/users" className="text-primary hover:underline">
          Back to users
        </Link>
      </div>
    );
  }

  const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">User Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage user information
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete User"}
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            {user.name ? (
              <span className="text-2xl font-bold text-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {user.name || "Anonymous User"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${
                user.role === "ADMIN"
                  ? "bg-violet-500/10 text-violet-600 border border-violet-500/30 font-bold"
                  : "bg-muted text-muted-foreground border border-border"
              }`}>
                {user.role}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{user.orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20">
              <CreditCard className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reviews</p>
              <p className="text-2xl font-bold text-foreground">{user.reviews.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Order History</h3>
        {user.orders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {user.orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-foreground/20 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider mt-1 ${
                    order.status === "DELIVERED" ? "bg-green-50 text-green-700 border border-green-200" :
                    order.status === "CANCELLED" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                    "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Recent Reviews</h3>
        {user.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {user.reviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-xl border border-border"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.title || "Review"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {review.product.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`h-3 w-3 rounded-full ${
                          star <= review.rating
                            ? "bg-amber-400"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}