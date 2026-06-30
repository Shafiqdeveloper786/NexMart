"use client";

import { updateOrderStatus } from "@/lib/actions/order.actions";
import { Search, Eye, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrderWithUser {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
  shippingAddress: any;
}

interface OrderCrudTableProps {
  initialOrders: OrderWithUser[];
}

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export function OrderCrudTable({ initialOrders }: OrderCrudTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const filteredOrders = initialOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesTab = activeTab === "ALL" || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Refresh the page to show updated data
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Tabs control bar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch gap-4 bg-muted/40 p-4 rounded-2xl border border-border">
        {/* Search */}
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs focus:border-foreground outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", ...STATUS_OPTIONS].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all ${
                activeTab === tab
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-card border border-border overflow-hidden rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th className="text-right">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-mono text-xs text-foreground uppercase font-bold">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">
                          {order.user?.name ?? "Guest User"}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground block">
                          {order.user?.email ?? "No Email linked"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono font-bold text-foreground">${order.totalAmount.toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                        {order.paymentMethod || "cod"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                          order.status === "PENDING" ? "status-pending" :
                          order.status === "PROCESSING" ? "status-processing" :
                          order.status === "PAID" ? "status-paid" :
                          order.status === "SHIPPED" ? "status-shipped" :
                          order.status === "DELIVERED" ? "status-delivered" :
                          "status-cancelled"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-3.5">
                        {/* Selector for Status stage */}
                        <select
                          value={order.status}
                          disabled={isPending}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          className="bg-background border border-border rounded-xl px-2.5 py-1 text-[10px] font-mono font-bold text-foreground focus:border-foreground outline-none transition-colors cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status} className="bg-background text-foreground font-mono text-xs">
                              {status}
                            </option>
                          ))}
                        </select>
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
