import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.264 5.636 5.9-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.532-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function NexMartLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 2L26 9V19L14 26L2 19V9L14 2Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" fill="currentColor" fillOpacity="0.12" />
      <path d="M14 2L26 9L14 16L2 9L14 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M14 16V26" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M2 9L14 16L26 9" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

const SHOP_LINKS = [
  { label: "Home",            href: "/" },
  { label: "Electronics",     href: "/category/electronics" },
  { label: "Fashion",         href: "/category/fashion" },
  { label: "Accessories",     href: "/category/accessories" },
  { label: "Recommendations", href: "/recommendations" },
];

const SUPPORT_LINKS = [
  { label: "FAQ",                href: "/faq" },
  { label: "Privacy Policy",     href: "/privacy-policy" },
  { label: "Terms of Service",   href: "/terms" },
  { label: "Shipping Info",      href: "/faq#shipping" },
  { label: "Returns & Exchanges",href: "/faq#returns" },
];

const SOCIAL = [
  { Icon: IconInstagram, label: "Instagram", href: "#", hoverColor: "hover:text-pink-400 hover:border-pink-400/50 dark:hover:border-pink-500/40" },
  { Icon: IconX,         label: "X",         href: "#", hoverColor: "hover:text-slate-900 dark:hover:text-white hover:border-slate-400/60 dark:hover:border-white/30" },
  { Icon: IconFacebook,  label: "Facebook",  href: "#", hoverColor: "hover:text-blue-500 hover:border-blue-400/50 dark:hover:border-blue-500/40" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/[0.06] overflow-hidden">

      {/* Subtle background glow in dark mode only */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link href="/"
              className="inline-flex items-center gap-2.5 text-slate-900 dark:text-white hover:opacity-75 transition-opacity">
              <NexMartLogo />
              <span className="text-base font-black tracking-[0.18em] uppercase">NexMart</span>
            </Link>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[260px]">
              Premium shopping for the modern lifestyle. Curated products across tech,
              fashion, home, and wellness — delivered to your door.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {SOCIAL.map(({ Icon, label, href, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    "border border-slate-200 dark:border-white/[0.10]",
                    "bg-white dark:bg-white/[0.04]",
                    "text-slate-500 dark:text-slate-400",
                    "transition-all duration-200 hover:scale-110",
                    hoverColor,
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-white mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-white mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-white mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@nexmart.com"
                  className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  hello@nexmart.com
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                Mon–Fri, 9am–6pm PKT
              </li>
              <li className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                Lahore, Pakistan
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  All systems operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Glass divider ── */}
        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.08] to-transparent" />

        {/* ── Bottom bar ── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center sm:text-left">
            © {year} NexMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Built with Next.js · MongoDB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
