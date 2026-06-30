import { prisma } from "@/lib/prismadb";
import { DollarSign, ShoppingBag, Users, Layers, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Status badge helper
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING:    "bg-amber-50  text-amber-700  border-amber-200",
    PROCESSING: "bg-blue-50   text-blue-700   border-blue-200",
    PAID:       "bg-emerald-50 text-emerald-700 border-emerald-200",
    SHIPPED:    "bg-sky-50    text-sky-700    border-sky-200",
    DELIVERED:  "bg-green-50  text-green-700  border-green-200",
    CANCELLED:  "bg-rose-50   text-rose-700   border-rose-200",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide ${styles[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

export default async function AdminDashboard() {
  const [userCount, productCount, orderCount, revenueAggregate] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
  ]);

  const totalRevenue = revenueAggregate._sum.totalAmount ?? 0;

  // Fetch monthly revenue data for the last 6 months
  const now = new Date();
  
  // Fetch all revenue-generating orders (no date filter for debugging)
  const allRevenueOrders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
    },
    select: {
      id: true,
      totalAmount: true,
      createdAt: true,
    },
  });
  
  // Aggregate by month in JavaScript - last 6 months
  const monthlyData: number[] = Array(6).fill(0);
  const monthLabels: string[] = [];
  
  // Generate labels for last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthLabels.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }
  
  // Simple month-based aggregation with year boundary handling
  allRevenueOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const orderMonth = orderDate.getMonth();
    const orderYear = orderDate.getFullYear();
    
    // Calculate months difference using total months
    const currentTotalMonths = now.getFullYear() * 12 + now.getMonth();
    const orderTotalMonths = orderYear * 12 + orderMonth;
    const monthsDiff = currentTotalMonths - orderTotalMonths;
    
    // If order is within last 6 months
    if (monthsDiff >= 0 && monthsDiff < 6) {
      const monthIndex = 5 - monthsDiff;
      monthlyData[monthIndex] += order.totalAmount;
    }
  });

  // Use actual values for display (no scaling)
  const bars = monthlyData;
  const maxBar = Math.max(...bars, 1); // Avoid division by zero
  const hasRevenueData = bars.some(val => val > 0);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const kpis = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      sub: "Paid, shipped & delivered",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: "Total Orders",
      value: orderCount,
      sub: "All order statuses",
      icon: ShoppingBag,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/20",
    },
    {
      label: "Registered Users",
      value: userCount,
      sub: "Accounts created",
      icon: Users,
      color: "text-pink-600",
      bg: "bg-pink-50 dark:bg-pink-950/20",
    },
    {
      label: "Total Products",
      value: productCount,
      sub: "Items in catalog",
      icon: Layers,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
  ];

  // Bar chart data (real monthly revenue from database - last 6 months)
  const months = monthLabels;

  return (
    <div className="space-y-8 text-foreground">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's a snapshot of your store performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow transition-shadow">
            <div className={`p-2.5 rounded-xl ${kpi.bg} shrink-0`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-sm text-foreground">Revenue Overview</h2>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Last 6 months · Real revenue data</span>
          </div>

          {/* Bar Chart */}
          {hasRevenueData ? (
            <div className="h-64 flex items-end gap-3">
              {bars.map((val, idx) => {
                const heightPercent = (val / maxBar) * 100;
                const isCurrentMonth = idx === 5;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    {/* Value tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      ${val.toFixed(2)}
                    </div>
                    
                    {/* Bar with gradient */}
                    <div className="w-full relative">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          val > 0 
                            ? isCurrentMonth 
                              ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/50' 
                              : 'bg-gradient-to-t from-blue-500 to-blue-400 shadow-lg shadow-blue-500/50'
                            : 'bg-muted/30'
                        }`}
                        style={{ 
                          height: `${val > 0 ? heightPercent : 0}%`,
                          minHeight: val > 0 ? '4px' : '0px'
                        }}
                      >
                        {/* Shine effect for non-zero bars */}
                        {val > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-lg" />
                        )}
                      </div>
                    </div>
                    
                    {/* Month label */}
                    <span className={`text-[10px] font-semibold ${
                      isCurrentMonth 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    } transition-colors`}>
                      {months[idx]}
                    </span>
                    
                    {/* Current month indicator */}
                    {isCurrentMonth && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No revenue data available</p>
                <p className="text-xs mt-2 max-w-xs">Revenue will appear when orders are marked as PAID, SHIPPED, or DELIVERED</p>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-t from-emerald-500 to-emerald-400" />
                <span className="text-[10px] text-muted-foreground">Current Month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-500 to-blue-400" />
                <span className="text-[10px] text-muted-foreground">Previous Months</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Live data from database
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-sm text-foreground">Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="text-[10px] text-primary hover:underline font-semibold">
              View all →
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recentOrders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                <ShoppingBag className="h-7 w-7 opacity-40" />
                <p className="text-xs">No orders yet</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {order.user?.name ?? order.user?.email ?? "Guest"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      #{order.id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-xs font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Add New Product", href: "/admin/products/new", desc: "List a new item in the catalog" },
          { label: "Manage Orders",   href: "/admin/orders",       desc: "View, filter and update order statuses" },
          { label: "Manage Users",    href: "/admin/users",        desc: "Assign roles and review accounts" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-card border border-border rounded-2xl p-5 hover:border-foreground/30 hover:shadow transition-all group"
          >
            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{link.label} →</p>
            <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}
