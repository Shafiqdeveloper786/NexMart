"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, Truck,
  Banknote, ChevronRight, Loader2,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";
import { createOrder } from "@/lib/actions/order.actions";

/* ─────────────────────── constants ─────────────────────── */
const SHIPPING_FEE = 5.00;
type PayMethod = "cod" | "card" | "easypaisa" | "jazzcash";

/* ─────────────────────── validators ─────────────────────── */
const V = {
  fullName:      (v: string) => v.trim().length >= 3                                  ? "" : "Full name must be at least 3 characters",
  email:         (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())          ? "" : "Enter a valid email address",
  phone:         (v: string) => /^03\d{9}$/.test(v.replace(/[\s-]/g, ""))            ? "" : "Pakistani format required (03XX-XXXXXXX)",
  address:       (v: string) => v.trim().length >= 5                                  ? "" : "Enter a complete street address",
  city:          (v: string) => v.trim().length >= 2                                  ? "" : "Enter your city",
  cardName:      (v: string) => v.trim().length >= 3                                  ? "" : "Name on card is required",
  cardNumber:    (v: string) => v.replace(/\s/g, "").length === 16                   ? "" : "Enter a valid 16-digit card number",
  expiry:        (v: string) => /^\d{2}\/\d{2}$/.test(v)                             ? "" : "Enter expiry as MM/YY",
  cvv:           (v: string) => /^\d{3,4}$/.test(v)                                  ? "" : "Enter 3–4 digit CVV",
};

/* ─────────────────────── format helpers ─────────────────────── */
const fmtCard   = (v: string) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
const fmtExpiry = (v: string) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?`${d.slice(0,2)}/${d.slice(2)}`:d; };
const fmtPhone  = (v: string) => v.replace(/[^\d\s-]/g,"").slice(0,13);

/* ─────────────────────── sub-components ─────────────────────── */
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; error?: string; hint?: string;
}
function Field({ label, error, hint, className, ...props }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <input className={cn(
        "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground",
        "placeholder:text-muted-foreground/50 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/50",
        error ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/40"
              : "border-border"
      )} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <Icon className="h-4 w-4 text-foreground" />
        </span>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────── QR Code panel ─────────────────────── */
function WalletQRPanel({
  method, amount,
}: {
  method: "easypaisa" | "jazzcash";
  amount: number;
}) {
  const isEP     = method === "easypaisa";
  const label    = isEP ? "Easypaisa" : "JazzCash";
  const brand    = isEP ? { border: "border-green-200 dark:border-green-800", bg: "bg-green-50 dark:bg-green-950/30" }
                        : { border: "border-red-200 dark:border-red-800", bg: "bg-red-50 dark:bg-red-950/30" };

  return (
    <div className={cn("rounded-xl border p-5 sm:p-6 flex flex-col items-center justify-center gap-4", brand.border, brand.bg)}>
      <div className="w-48 h-48 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-border shadow-sm overflow-hidden flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/payments/my-qr-code.jpg"
          alt={`${label} QR Code`}
          className="h-full w-full object-contain p-3"
        />
      </div>
    </div>
  );
}

/* ─────────────────────── payment options ─────────────────────── */
interface PayOption {
  value: PayMethod;
  label: string;
  sub: string;
  icon?: React.ElementType;
  logoUrl?: string;
}

const PAY_OPTIONS: PayOption[] = [
  { value: "cod",       label: "Cash on Delivery", sub: "Pay at doorstep",    icon: Banknote  },
  { value: "card",      label: "Credit / Debit",   sub: "Visa · Mastercard",  logoUrl: "https://img.icons8.com/color/96/000000/visa.png" },
  { value: "easypaisa", label: "Easypaisa",        sub: "Mobile Wallet",      logoUrl: "https://seeklogo.com/images/E/easypaisa-logo-484A8812D1-seeklogo.com.png" },
  { value: "jazzcash",  label: "JazzCash",         sub: "Mobile Wallet",      logoUrl: "https://seeklogo.com/images/J/jazz-cash-logo-8298AD3DF2-seeklogo.com.png" },
];

/* ══════════════════════════════════════════════════
   Page
══════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [mounted,   setMounted]   = useState(false);
  const [placing,   setPlacing]   = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>("cod");

  const [form, setForm]   = useState({ fullName:"", email:"", phone:"", address:"", city:"", zip:"" });
  const [card, setCard]   = useState({ name:"", number:"", expiry:"", cvv:"" });
  const [errors, setErrors] = useState<Record<string,string>>({});

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && items.length === 0) router.replace("/");
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const grandTotal = subtotal + SHIPPING_FEE;
  const itemCount  = items.reduce((s, i) => s + i.quantity, 0);

  /* ── validation ── */
  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    (["fullName","email","phone","address","city"] as const).forEach(k => {
      const msg = V[k]((form as Record<string,string>)[k] ?? "");
      if (msg) e[k] = msg;
    });
    if (payMethod === "card") {
      const msg1 = V.cardName(card.name);      if (msg1) e.cardName = msg1;
      const msg2 = V.cardNumber(card.number);  if (msg2) e.cardNumber = msg2;
      const msg3 = V.expiry(card.expiry);      if (msg3) e.expiry = msg3;
      const msg4 = V.cvv(card.cvv);            if (msg4) e.cvv = msg4;
    }
    return e;
  }

  function clearErr(key: string) {
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  }

  /* ── submit ── */
  async function handlePlaceOrder() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPlacing(true);
    try {
      await createOrder({
        items:         items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
        totalAmount:   grandTotal,
        paymentMethod: payMethod,
      });
      clearCart();
      alert("Order Placed!");
      router.push("/profile/orders");
    } catch {
      setPlacing(false);
    }
  }

  function PlaceOrderBtn({ className }: { className?: string }) {
    return (
      <button onClick={handlePlaceOrder} disabled={placing}
        className={cn(
          "flex items-center justify-center gap-2 rounded-2xl bg-foreground py-4",
          "text-sm font-semibold text-background",
          "hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200 shadow-md active:scale-[0.98]",
          className
        )}>
        {placing
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
          : <><ShieldCheck className="h-4 w-4" /> Place Order · ${grandTotal.toFixed(2)}</>
        }
      </button>
    );
  }

  /* ──────────────────────── render ──────────────────────── */
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

        {/* ════════ LEFT ════════ */}
        <div className="space-y-6 w-full min-w-0">
          <Link href="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to cart
          </Link>

          {/* Shipping */}
          <SectionCard title="Shipping Address" icon={Truck}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" placeholder="e.g. Ahmed Khan"
                value={form.fullName} error={errors.fullName}
                hint="Min. 3 characters"
                {...(errors.fullName ? { "data-field-error": true } as object : {})}
                onChange={e => { setForm(p => ({...p, fullName: e.target.value})); clearErr("fullName"); }}
                className="sm:col-span-2" />
              <Field label="Email Address" type="email" placeholder="ahmed@example.com"
                value={form.email} error={errors.email}
                onChange={e => { setForm(p => ({...p, email: e.target.value})); clearErr("email"); }} />
              <Field label="Phone Number" type="tel" placeholder="0312-3456789"
                value={form.phone} error={errors.phone} hint="03XX-XXXXXXX"
                inputMode="tel"
                onChange={e => { setForm(p => ({...p, phone: fmtPhone(e.target.value)})); clearErr("phone"); }} />
              <Field label="Street Address" placeholder="House 12, Street 5, Block B"
                value={form.address} error={errors.address}
                onChange={e => { setForm(p => ({...p, address: e.target.value})); clearErr("address"); }}
                className="sm:col-span-2" />
              <Field label="City" placeholder="Lahore"
                value={form.city} error={errors.city}
                onChange={e => { setForm(p => ({...p, city: e.target.value})); clearErr("city"); }} />
              <Field label="Postal Code (optional)" placeholder="54000"
                value={form.zip}
                onChange={e => setForm(p => ({...p, zip: e.target.value}))} />
            </div>
          </SectionCard>

          {/* Payment */}
          <SectionCard title="Payment Method" icon={ShieldCheck}>
            <div className="space-y-4">

              {/* 2×2 payment method grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {PAY_OPTIONS.map(opt => {
                  const active = payMethod === opt.value;
                  return (
                    <label key={opt.value} className={cn(
                      "flex flex-col items-center justify-center gap-y-2 rounded-xl border-2 p-4 sm:p-5",
                      "cursor-pointer text-center transition-all duration-200 min-h-[130px] sm:min-h-[140px] select-none",
                      active
                        ? "border-green-500 bg-green-50/10 dark:bg-green-900/20 shadow-md"
                        : "border-border hover:border-foreground/30 hover:bg-muted/30"
                    )}>
                      <input
                        type="radio"
                        name="pay"
                        value={opt.value}
                        className="sr-only"
                        checked={active}
                        onChange={() => { setPayMethod(opt.value); setErrors({}); }}
                      />

                      {/* Icon / Logo */}
                      {opt.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={opt.logoUrl}
                          alt={opt.label}
                          className="h-10 w-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : opt.icon ? (
                        <opt.icon
                          className={cn(
                            "h-10 w-10",
                            active ? "text-green-600" : "text-muted-foreground"
                          )}
                        />
                      ) : null}

                      <div className="flex flex-col gap-1 min-w-0">
                        <p className={cn(
                          "text-xs sm:text-sm font-bold leading-tight",
                          active ? "text-foreground" : "text-foreground/85"
                        )}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                          {opt.sub}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* ── Card fields ── */}
              {payMethod === "card" && (
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Card Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name on Card" placeholder="Ahmed Khan"
                      value={card.name} error={errors.cardName}
                      onChange={e => { setCard(p => ({...p, name: e.target.value})); clearErr("cardName"); }}
                      className="sm:col-span-2" />
                    <Field label="Card Number" placeholder="1234 5678 9012 3456"
                      value={card.number} error={errors.cardNumber}
                      inputMode="numeric" maxLength={19}
                      onChange={e => { setCard(p => ({...p, number: fmtCard(e.target.value)})); clearErr("cardNumber"); }}
                      className="sm:col-span-2" />
                    <Field label="Expiry (MM/YY)" placeholder="08/27"
                      value={card.expiry} error={errors.expiry}
                      inputMode="numeric" maxLength={5}
                      onChange={e => { setCard(p => ({...p, expiry: fmtExpiry(e.target.value)})); clearErr("expiry"); }} />
                    <Field label="CVV" placeholder="123" type="password"
                      value={card.cvv} error={errors.cvv}
                      inputMode="numeric" maxLength={4}
                      onChange={e => { setCard(p => ({...p, cvv: e.target.value.replace(/\D/g,"").slice(0,4)})); clearErr("cvv"); }} />
                  </div>
                </div>
              )}

              {/* ── Easypaisa / JazzCash QR ── */}
              {(payMethod === "easypaisa" || payMethod === "jazzcash") && (
                <WalletQRPanel
                  method={payMethod}
                  amount={grandTotal}
                />
              )}

              {/* ── Policy Disclaimer – For digital payments only ── */}
              {(payMethod === "easypaisa" || payMethod === "jazzcash" || payMethod === "card") && (
                <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-foreground">Note:</span> If your digital payment is not verified by our team upon processing, your order will automatically be converted to Cash on Delivery (COD).
                  </p>
                </div>
              )}

              {/* ── COD note ── */}
              {payMethod === "cod" && (
                <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                  <Banknote className="h-4 w-4 shrink-0 mt-px text-foreground/50" />
                  Pay with cash when your order arrives. Available across all major cities of Pakistan.
                  Please keep exact change ready.
                </div>
              )}
            </div>
          </SectionCard>

          {/* Mobile CTA */}
          <PlaceOrderBtn className="w-full lg:hidden" />
        </div>

        {/* ════════ RIGHT: Order Summary ════════ */}
        <div className="w-full min-w-0 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Order Summary</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Item list */}
            <ul className="space-y-3 max-h-56 overflow-y-auto -mr-1 pr-1">
              {items.map(item => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-lg overflow-hidden border border-border bg-muted/40">
                    {item.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      : <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground/30" />
                        </div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="space-y-2.5 text-sm border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping fee</span>
                <span className="font-medium text-foreground tabular-nums">${SHIPPING_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-3">
                <span>Grand Total</span>
                <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <PlaceOrderBtn className="hidden lg:flex w-full" />
            <p className="text-center text-[10px] text-muted-foreground">
              🔒 SSL Secured · Free Returns · 24/7 Support
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
