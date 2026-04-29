"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut, ShoppingBag, ChevronRight,
  Mail, User, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ── Avatar: photo if available, coloured initials otherwise ── */
function Avatar({ name, image, size = 80 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User"}
        width={size}
        height={size}
        className="rounded-full object-cover ring-4 ring-border dark:ring-white/10"
      />
    );
  }
  const initials = name
    ? name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-foreground text-background font-black text-2xl select-none ring-4 ring-border dark:ring-white/10"
    >
      {initials}
    </div>
  );
}

/* ── Info row ── */
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-border dark:border-white/[0.07] last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted dark:bg-white/[0.06]">
        <Icon className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-slate-500">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   Page
══════════════════════════════════════ */
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const { name, email, image, role } = session.user as {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-10 sm:py-16 space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground dark:text-slate-400">
        <Link href="/" className="hover:text-foreground dark:hover:text-white transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-slate-900 dark:text-white font-medium">Profile</span>
      </nav>

      {/* Hero card */}
      <div className="rounded-2xl border border-border dark:border-white/[0.07] bg-card dark:bg-white/[0.02] overflow-hidden">

        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <Avatar name={name} image={image} size={80} />
          </div>

          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {name ?? "My Account"}
            </h1>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              {email ?? "No email on record"}
            </p>
            {role && role !== "USER" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400 mt-1">
                <Shield className="h-3 w-3" /> {role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="rounded-2xl border border-border dark:border-white/[0.07] bg-card dark:bg-white/[0.02] overflow-hidden">
        <InfoRow icon={User}  label="Full Name"      value={name  ?? "—"} />
        <InfoRow icon={Mail}  label="Email Address"  value={email ?? "—"} />
        <InfoRow icon={Shield} label="Account Type"  value={role === "ADMIN" ? "Administrator" : "Customer"} />
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-border dark:border-white/[0.07] bg-card dark:bg-white/[0.02] overflow-hidden">
        <Link
          href="/profile/orders"
          className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted dark:bg-white/[0.06]">
            <ShoppingBag className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">My Orders</p>
            <p className="text-xs text-muted-foreground dark:text-slate-400">View your order history</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-slate-500 shrink-0" />
        </Link>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-2xl border-2",
          "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20",
          "py-3.5 text-sm font-bold text-red-600 dark:text-red-400",
          "hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors active:scale-[0.98]"
        )}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      <p className="text-center text-xs text-muted-foreground dark:text-slate-500">
        NexMart · Your account is secure 🔒
      </p>
    </div>
  );
}
