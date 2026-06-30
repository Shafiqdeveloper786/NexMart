import { prisma } from "@/lib/prismadb";
import { OrderCrudTable } from "@/components/admin/OrderCrudTable";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable all caching

export default async function AdminOrdersPage() {
  // Fetch all orders from Prisma DB
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-8 text-foreground bg-background">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Order Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View, filter, and update the status of customer orders</p>
      </div>

      {/* Control table */}
      <OrderCrudTable initialOrders={orders} />
    </div>
  );
}
