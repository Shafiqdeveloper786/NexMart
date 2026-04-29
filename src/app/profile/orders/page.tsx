import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserOrders, type OrderWithItems } from "@/lib/actions/order.actions";
import { deriveDisplayId } from "@/lib/utils/orderUtils";
import { AddToCartButton } from "@/components/home/AddToCartButton";
import { CancelOrderButton } from "./CancelOrderButton";
import {
  ShoppingBag, Package, Truck, CheckCircle,
  Clock, XCircle, ArrowLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "My Orders | NexMart",
  description: "View your NexMart order history and track deliveries.",
};

/* ══════════════════════════════════════════════════════
   TIME-BASED STATUS ENGINE
   Rules (override DB status unless CANCELLED):
     < 6 h  → Processing   (amber/yellow)
     6–12 h → Shipped      (blue)  + doorstep message
     > 12 h → Delivered    (green)
══════════════════════════════════════════════════════ */

type TimeStatus = "processing" | "shipped" | "delivered" | "cancelled";

function getTimeStatus(dbStatus: string, createdAt: Date): TimeStatus {
  if (dbStatus === "CANCELLED") return "cancelled";
  const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hours < 6)  return "processing";
  if (hours < 12) return "shipped";
  return "delivered";
}

/* ── Badge & tracker config per status ── */
const STATUS_META: Record<TimeStatus, {
  label:      string;
  badgeCls:   string;
  dotCls:     string;
  message?:   string;
}> = {
  processing: {
    label:    "Processing",
    badgeCls: "bg-amber-100  dark:bg-amber-950/40  text-amber-800  dark:text-amber-300  border border-amber-200  dark:border-amber-800/50",
    dotCls:   "bg-amber-500",
    message:  "We've received your order and are preparing it for dispatch.",
  },
  shipped: {
    label:    "Shipped",
    badgeCls: "bg-blue-100   dark:bg-blue-950/40   text-blue-800   dark:text-blue-300   border border-blue-200   dark:border-blue-800/50",
    dotCls:   "bg-blue-500",
    message:  "Your order will reach your doorstep soon! 🚚",
  },
  delivered: {
    label:    "Delivered",
    badgeCls: "bg-green-100  dark:bg-green-950/40  text-green-800  dark:text-green-300  border border-green-200  dark:border-green-800/50",
    dotCls:   "bg-green-500",
    message:  "Delivered! Enjoy your purchase. 🎉",
  },
  cancelled: {
    label:    "Cancelled",
    badgeCls: "bg-red-100    dark:bg-red-950/40    text-red-800    dark:text-red-300    border border-red-200    dark:border-red-800/50",
    dotCls:   "bg-red-500",
  },
};

/* ── 3-step visual tracker (Processing → Shipped → Delivered) ── */
const TRACK_STEPS: { key: TimeStatus; label: string; icon: React.ElementType }[] = [
  { key: "processing", label: "Processing", icon: Package      },
  { key: "shipped",    label: "Shipped",    icon: Truck        },
  { key: "delivered",  label: "Delivered",  icon: CheckCircle  },
];
const STEP_ORDER: TimeStatus[] = ["processing", "shipped", "delivered"];

function StatusTracker({ status }: { status: TimeStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
        <XCircle className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = STEP_ORDER.indexOf(status);

  return (
    <div className="space-y-2.5">
      {/* Step row */}
      <div className="flex items-center w-full" role="list" aria-label="Order progress">
        {TRACK_STEPS.map((step, i) => {
          const done   = i <= currentIdx;
          const active = i === currentIdx;
          const Icon   = step.icon;
          return (
            <div key={step.key} className={cn("flex items-center", i < TRACK_STEPS.length - 1 && "flex-1")}>
              <div className="flex flex-col items-center gap-1 shrink-0">
                {/* Circle */}
                <div className={cn(
                  "flex items-center justify-center rounded-full border-2 h-8 w-8 transition-all duration-300",
                  done
                    ? cn(
                        "border-transparent text-white shadow-sm",
                        step.key === "processing" && "bg-amber-500",
                        step.key === "shipped"    && "bg-blue-500",
                        step.key === "delivered"  && "bg-green-500"
                      )
                    : "border-border bg-muted/40 text-muted-foreground/30",
                  active && "ring-2 ring-offset-2 ring-offset-card scale-110",
                  active && step.key === "processing" && "ring-amber-300 dark:ring-amber-700",
                  active && step.key === "shipped"    && "ring-blue-300  dark:ring-blue-700",
                  active && step.key === "delivered"  && "ring-green-300 dark:ring-green-700",
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                {/* Label */}
                <span className={cn(
                  "text-[9px] whitespace-nowrap leading-none font-semibold",
                  done
                    ? step.key === "processing" ? "text-amber-600 dark:text-amber-400"
                    : step.key === "shipped"    ? "text-blue-600  dark:text-blue-400"
                    : "text-green-600 dark:text-green-400"
                    : "text-muted-foreground/40"
                )}>
                  {step.label}
                </span>
              </div>
              {/* Connector line */}
              {i < TRACK_STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 rounded-full mx-1.5 mb-4 transition-colors duration-500",
                  i < currentIdx ? "bg-foreground/40" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Thin progress bar */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            status === "processing" && "bg-amber-500",
            status === "shipped"    && "bg-blue-500",
            status === "delivered"  && "bg-green-500"
          )}
          style={{ width: `${((currentIdx + 1) / TRACK_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Status message */}
      {STATUS_META[status].message && (
        <p className={cn(
          "text-xs font-medium leading-relaxed",
          status === "processing" && "text-amber-700 dark:text-amber-400",
          status === "shipped"    && "text-blue-700  dark:text-blue-400",
          status === "delivered"  && "text-green-700 dark:text-green-400"
        )}>
          {STATUS_META[status].message}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ORDER CARD
══════════════════════════════════════════════════════ */
function OrderCard({ order }: { order: OrderWithItems }) {
  const displayId  = deriveDisplayId(order.id);
  const status     = getTimeStatus(order.status, order.createdAt);
  const meta       = STATUS_META[status];
  const canCancel  = status !== "delivered" && status !== "cancelled";

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
  const itemCount    = order.items.reduce((s, i) => s + i.quantity, 0);
  const visibleItems = order.items.slice(0, 3);
  const overflow     = order.items.length - 3;

  return (
    <article className="rounded-2xl border border-border dark:border-white/[0.07] bg-card overflow-hidden">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 bg-muted/30 dark:bg-white/[0.02] border-b border-border dark:border-white/[0.06]">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-wide">
              {displayId}
            </span>
            {/* Coloured status badge */}
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0", meta.badgeCls)}>
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", meta.dotCls)} />
              {meta.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-400 flex-wrap">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{date}</span>
            <span>·</span>
            <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground dark:text-slate-500">Total</p>
            <p className="text-base font-black text-slate-900 dark:text-white tabular-nums">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
          {canCancel && <CancelOrderButton orderId={order.id} displayId={displayId} />}
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-4">
        <ul className="space-y-3">
          {visibleItems.map(item => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-border dark:border-white/[0.07] bg-muted/40">
                {item.product?.images?.[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={item.product.images[0]} alt={item.product.name ?? ""}
                      className="h-full w-full object-cover" />
                  : <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                  {item.product?.name ?? "Product unavailable"}
                </p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Qty {item.quantity} · ${item.price.toFixed(2)} each
                </p>
              </div>
              <div className="shrink-0">
                {item.product && (
                  <AddToCartButton
                    product={{
                      id:     item.productId,
                      name:   item.product.name,
                      price:  item.price,
                      images: item.product.images,
                    }}
                  />
                )}
              </div>
            </li>
          ))}
          {overflow > 0 && (
            <li className="text-xs text-muted-foreground dark:text-slate-400 pl-1">
              +{overflow} more item{overflow !== 1 ? "s" : ""}
            </li>
          )}
        </ul>

        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="pt-3 border-t border-border dark:border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-500 mb-2">
              Deliver To
            </p>
            <div className="rounded-xl bg-muted/40 dark:bg-white/[0.03] border border-border dark:border-white/[0.06] px-4 py-3 space-y-0.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                {order.shippingAddress.street}, {order.shippingAddress.city}
                {order.shippingAddress.zipCode ? ` — ${order.shippingAddress.zipCode}` : ""}
              </p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                📞 {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        )}

        {/* Status tracker */}
        <div className="pt-3 border-t border-border dark:border-white/[0.06]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-500 mb-3">
            Delivery Status
          </p>
          <StatusTracker status={status} />
        </div>
      </div>
    </article>
  );
}

/* ── Empty state ── */
function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-2xl bg-muted/60 p-8 mb-5">
        <Package className="h-14 w-14 text-muted-foreground mx-auto" />
      </div>
      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">No orders yet</h2>
      <p className="text-sm text-muted-foreground dark:text-slate-400 max-w-xs mb-7">
        Looks like you haven&apos;t placed any orders. Start shopping and your orders will appear here.
      </p>
      <Link href="/"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background hover:opacity-85 transition-opacity shadow-md">
        <ShoppingBag className="h-4 w-4" />
        Start Shopping
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Page (Server Component)
══════════════════════════════════════════════════════ */
export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const orders = await getUserOrders();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground dark:text-slate-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-foreground dark:hover:text-white transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-slate-900 dark:text-white font-medium">My Orders</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground dark:text-slate-400 mt-1">
            {orders.length > 0
              ? `${orders.length} order${orders.length !== 1 ? "s" : ""} · most recent first`
              : "No orders placed yet"}
          </p>
        </div>
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Continue shopping
        </Link>
      </div>

      {/* Status legend */}
      {orders.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {(["processing","shipped","delivered"] as TimeStatus[]).map(s => (
            <span key={s} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide", STATUS_META[s].badgeCls)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[s].dotCls)} />
              {STATUS_META[s].label}
            </span>
          ))}
        </div>
      )}

      {/* Orders list */}
      {orders.length === 0
        ? <EmptyOrders />
        : (
          <div className="space-y-5">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )
      }
    </div>
  );
}
