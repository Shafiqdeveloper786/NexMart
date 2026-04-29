"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { cancelOrder } from "@/lib/actions/order.actions";
import { cn } from "@/lib/utils/cn";

interface Props {
  orderId:   string;
  displayId: string;
}

export function CancelOrderButton({ orderId, displayId }: Props) {
  const router = useRouter();
  const [open,       setOpen]       = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  async function handleConfirm() {
    setCancelling(true);
    setError(null);
    const result = await cancelOrder(orderId);
    setCancelling(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      setOpen(false);
      router.refresh();
    }, 3500);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setDone(false); setError(null); }}
        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/50 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
        Cancel Order
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget && !cancelling) setOpen(false); }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">

            {done ? (
              /* ── Success state ── */
              <div className="p-8 text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Order Cancelled</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Order <span className="font-semibold text-foreground">{displayId}</span> has been cancelled.
                  </p>
                </div>
                <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    If you have already paid, your payment will be <strong>refunded to your account within 24 hours</strong>.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Redirecting…</p>
              </div>
            ) : (
              /* ── Confirmation state ── */
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-950/40">
                      <AlertTriangle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Cancel Order?</h3>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    disabled={cancelling}
                    aria-label="Close"
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You are about to cancel order{" "}
                    <span className="font-semibold text-foreground">{displayId}</span>.
                    This action cannot be undone and you will not receive these items.
                  </p>

                  {/* Refund notice */}
                  <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 space-y-1">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      Refund Policy
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      If you have already paid via Easypaisa, JazzCash, or card, your payment
                      will be <strong>refunded to your account within 24 hours</strong> of cancellation.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-xs text-red-500 font-medium">{error}</p>
                  )}
                </div>

                {/* Footer */}
                <div className={cn(
                  "flex gap-3 px-5 py-4 border-t border-border",
                  "flex-col xs:flex-row sm:flex-row"
                )}>
                  <button
                    onClick={() => setOpen(false)}
                    disabled={cancelling}
                    className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={cancelling}
                    className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {cancelling
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Cancelling…</>
                      : "Yes, Cancel Order"
                    }
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
