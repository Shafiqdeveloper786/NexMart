"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Home, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const SIDEBAR_ITEMS = [
  { label: "Dashboard",  href: "/admin",          icon: LayoutDashboard },
  { label: "Products",   href: "/admin/products",  icon: Package },
  { label: "Orders",     href: "/admin/orders",    icon: ShoppingCart },
  { label: "Users",      href: "/admin/users",     icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col justify-between shrink-0 p-6 space-y-8 md:sticky md:top-0 md:h-screen">
        <div className="space-y-8">
          {/* Admin title */}
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs">
                NM
              </div>
              <span className="font-bold text-sm tracking-wide group-hover:text-primary transition-colors">
                NexMart
              </span>
            </Link>
            <p className="text-[10px] text-muted-foreground mt-1.5 pl-9">Admin Panel</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-item ${isActive ? "active font-bold" : ""}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            <span>Go to Store</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6 md:p-10 space-y-8 bg-background">
        {children}
      </main>
    </div>
  );
}
