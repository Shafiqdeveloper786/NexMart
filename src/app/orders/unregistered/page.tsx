import { prisma } from "@/lib/prismadb";
import { notFound } from "next/navigation";
import { Check, ClipboardList, Package, Truck, Smile, ArrowLeft, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

const STEPS = ["PENDING", "PROCESSING", "PAID", "SHIPPED", "DELIVERED"] as const;

const STEP_DETAILS = [
  { label: "Confirmed", icon: ClipboardList, desc: "Order details logged into NexMart core" },
  { label: "Processing", icon: Layers, desc: "Module components assembly initialized" },
  { label: "Paid", icon: ShieldCheck, desc: "Transaction tokens secure confirmation" },
  { label: "Shipped", icon: Truck, desc: "Courier drone dispatched with items package" },
  { label: "Delivered", icon: Smile, desc: "Package authorized and hand-delivered" },
];

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;
  
  // Find order in DB (accepting either database object ID or display ID string)
  let order = await prisma.order.findFirst({
    where: {
      OR: [
        { id: id.length === 24 ? id : undefined },
        // Try searching string matched id if needed
      ].filter(Boolean) as any,
    },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, images: true },
          },
        },
      },
    },
  });

  // If order was guest checkout or not in database, fallback to mockup
  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-6">
        <h1 className="text-2xl font-black text-rose-500 uppercase tracking-wider">ORDER NOT REGISTERED</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The order ID <strong>{id}</strong> could not be matched inside the database index. This could be due to a guest checkout route or sync issue.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-white px-6 py-2.5 text-xs font-mono font-bold uppercase transition-all">
          <ArrowLeft size={14} />
          <span>RETURN TO INTERFACE</span>
        </Link>
      </div>
    );
  }

  const currentStatus = order.status;
  const isCancelled = currentStatus === "CANCELLED";
  const activeStepIndex = STEPS.indexOf(currentStatus as any);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#030712] min-h-[85vh] text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-wider mb-2">
            <ArrowLeft size={12} />
            <span>Return to Matrix</span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight uppercase text-white">
            MODULE DISPATCH LOG
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
            TRANSACTION ID: <span className="text-cyan-400 font-bold">#{order.id.slice(-8).toUpperCase()}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">DATE INITIATED</span>
          <span className="font-mono text-xs font-bold text-white">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Stepper tracking container */}
      {isCancelled ? (
        <div className="glass-card p-6 border-rose-500/20 bg-rose-950/10 text-rose-400 text-center rounded-2xl flex flex-col items-center justify-center gap-2">
          <h3 className="font-bold text-sm tracking-widest font-mono uppercase">MODULE DISPATCH DE-AUTHORIZED</h3>
          <p className="text-xs text-rose-400/80 font-mono">This order has been cancelled and system items returned to stock matrix.</p>
        </div>
      ) : (
        <div className="glass-card p-6 sm:p-8 border border-white/5 bg-[#0d1117]/85 rounded-3xl relative overflow-hidden">
          {/* Dashboard Stepper Visual */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
            {/* Desktop Connector Progress Line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-900 hidden md:block z-0" />
            <div 
              className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 hidden md:block z-0 transition-all duration-700" 
              style={{ width: `${Math.max(0, (activeStepIndex / (STEPS.length - 1)) * 96)}%` }}
            />

            {STEP_DETAILS.map((step, i) => {
              const StepIcon = step.icon;
              const isCompleted = i < activeStepIndex;
              const isCurrent = i === activeStepIndex;
              const isPast = i <= activeStepIndex;

              return (
                <div key={step.label} className="flex md:flex-col items-center gap-4 md:gap-2.5 z-10 w-full md:w-auto md:text-center">
                  {/* Step Bubble */}
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    isCurrent 
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.4)] scale-110"
                      : isCompleted
                      ? "bg-purple-500/20 border-purple-500 text-purple-400"
                      : "bg-slate-950 border-slate-900 text-slate-700"
                  }`}>
                    {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : <StepIcon className="h-4.5 w-4.5" />}
                  </div>

                  {/* Step Labels */}
                  <div className="md:space-y-0.5 text-left md:text-center">
                    <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isPast ? "text-white" : "text-slate-600"}`}>
                      {step.label}
                    </h4>
                    <p className={`text-[10px] hidden md:block max-w-[140px] leading-snug mx-auto ${isPast ? "text-slate-400" : "text-slate-700"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid: Order summary Left, Address Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary items */}
        <div className="lg:col-span-2 glass-card p-6 border border-white/5 bg-[#0d1117]/85 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm tracking-wider font-mono uppercase text-white pb-3 border-b border-white/5">
            Module Payload
          </h3>

          <div className="divide-y divide-white/5">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 bg-slate-900 border border-white/5 rounded-lg overflow-hidden shrink-0">
                    {item.product?.images[0] && (
                      <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-white block truncate max-w-[220px] sm:max-w-md">
                      {item.product?.name ?? "Hardware Upgrade"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 block">
                      QUANTITY: {item.quantity} UNITS
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch stats and shipping */}
        <div className="space-y-6">
          {/* Shipping Address Card */}
          <div className="glass-card p-6 border border-white/5 bg-[#0d1117]/85 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm tracking-wider font-mono uppercase text-white pb-3 border-b border-white/5">
              Netrunner Signal (Destination)
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs font-mono text-slate-400 space-y-2 leading-relaxed">
                <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city} {order.shippingAddress.zipCode}</p>
                <p className="text-slate-500">PHONE: {order.shippingAddress.phone}</p>
              </div>
            ) : (
              <span className="text-xs text-slate-600 font-mono uppercase block">NO DISPATCH ADDRESS SIGNAL REGISTERED</span>
            )}
          </div>

          {/* Credits tally card */}
          <div className="glass-card p-6 border border-white/5 bg-[#0d1117]/85 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-slate-500">
              <span>MODULES SUB-TALLY</span>
              <span className="text-white">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-500">
              <span>DISPATCH TAX PROTOCOL</span>
              <span className="text-white">$0.00</span>
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="font-bold">TOTAL MATRIX TRANSFERRED</span>
              <span className="text-sm font-black text-cyan-400 font-mono">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
