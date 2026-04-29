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

/* ── DB status types and display config ── */
type DbStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_BADGE: Record<DbStatus, { label: string; cls: string }> = {
  PENDING:   { label: "Pending",    cls: "bg-blue-100   dark:bg-blue-950/40   text-blue-700   dark:text-blue-300"   },
  PAID:      { label: "Paid",       cls: "bg-amber-100  dark:bg-amber-950/40  text-amber-700  dark:text-amber-300"  },
  SHIPPED:   { label: "Shipped",    cls: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300" },
  DELIVERED: { label: "Delivered",  cls: "bg-green-100  dark:bg-green-950/40  text-green-700  dark:text-green-300"  },
  CANCELLED: { label: "Cancelled",  cls: "bg-red-100    dark:bg-red-950/40    text-red-700    dark:text-red-300"    },
};

/* ── 4-step tracker (DB-driven) ── */
const TRACK_STEPS: { key: DbStatus; label: string; icon: React.ElementType }[] = [
  { key: "PENDING",   label: "Placed",    icon: ShoppingBag  },
  { key: "PAID",      label: "Paid",      icon: Package      },
  { key: "SHIPPED",   label: "Shipped",   icon: Truck        },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle  },
];

function StatusTracker({ status }: { status: DbStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
        <XCircle className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = TRACK_STEPS.findIndex(s => s.key === status);

  return (
    <div className="space-y-2">
      <div className="flex items-center w-full" role="list" aria-label="Order progress">
        {TRACK_STEPS.map((step, i) => {
          const done   = i <= currentIdx;
          const active = i === currentIdx;
          const Icon   = step.icon;
          return (
            <div key={step.key} className={cn("flex items-center", i < TRACK_STEPS.length - 1 && "flex-1")}>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={cn(
                  "flex items-center justify-center rounded-full border-2 h-8 w-8 transition-all",
                  done
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/40 text-muted-foreground/30",
                  active && "ring-2 ring-foreground/20 ring-offset-2 ring-offset-card scale-110"
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className={cn(
                  "text-[9px] whitespace-nowrap leading-none",
                  done ? "font-bold text-foreground dark:text-white" : "text-muted-foreground/50"
                )}>
                  {step.label}
                </span>
              </div>
              {i < TRACK_STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 rounded-full mx-1 mb-4",
                  i < currentIdx ? "bg-foreground" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>
      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all duration-500"
          style={{ width: `${Math.max(((currentIdx + 1) / TRACK_STEPS.length) * 100, 10)}%` }}
        />
      </div>
    </div>
  );
}

/* ── Order card ── */
function OrderCard({ order }: { order: OrderWithItems }) {
  const displayId = deriveDisplayId(order.id);
  const status    = order.status as DbStatus;
  const badge     = STATUS_BADGE[status] ?? STATUS_BADGE.PENDING;
  const canCancel = status !== "DELIVERED" && status !== "CANCELLED";

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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-wide">
              {displayId}
            </span>
            <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0", badge.cls)}>
              {badge.label}
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

        {/* Tracker */}
        <div className="pt-3 border-t border-border dark:border-white/[0.06]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-500 mb-3">
            Order Status
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

/* ══════════════════════════════════════
   Page
══════════════════════════════════════ */
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

      {/* Orders */}
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
