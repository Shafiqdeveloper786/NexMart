"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ShoppingCart, User, Sun, Moon,
  Menu, X, LogOut, ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { label: "Home",            href: "/" },
  { label: "Electronics",     href: "/category/electronics" },
  { label: "Fashion",         href: "/category/fashion" },
  { label: "Recommendations", href: "/recommendations" },
];

/* ─────────────────────────────────────────
   Logo
───────────────────────────────────────── */
function NexMartLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 2L26 9V19L14 26L2 19V9L14 2Z"
        stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"
        fill="currentColor" fillOpacity="0.07" />
      <path d="M14 2L26 9L14 16L2 9L14 2Z"
        fill="currentColor" fillOpacity="0.14"
        stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M14 16V26" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M2 9L14 16L26 9" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Theme toggle
───────────────────────────────────────── */
function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={mounted ? toggleTheme : undefined}
      aria-label="Toggle theme"
      className="relative rounded-full p-2 hover:bg-muted transition-colors duration-200 overflow-hidden text-muted-foreground hover:text-foreground"
      style={{ width: 34, height: 34 }}
    >
      <Sun className={cn(
        "absolute inset-0 m-auto h-[15px] w-[15px] transition-all duration-500 ease-in-out",
        mounted && resolvedTheme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
      )} />
      <Moon className={cn(
        "absolute inset-0 m-auto h-[15px] w-[15px] transition-all duration-500 ease-in-out",
        mounted && resolvedTheme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
      )} />
    </button>
  );
}

/* ─────────────────────────────────────────
   User avatar — initials fallback
───────────────────────────────────────── */
function UserAvatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) {
    return (
      <Image src={image} alt={name ?? "User"} width={28} height={28}
        className="rounded-full object-cover ring-2 ring-border" />
    );
  }
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background select-none">
      {initials}
    </span>
  );
}

/* ─────────────────────────────────────────
   User dropdown menu
───────────────────────────────────────── */
function UserMenu({ name, image }: { name?: string | null; image?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 rounded-full p-1.5 hover:bg-muted transition-colors"
        aria-label="User menu" aria-expanded={open} aria-haspopup="true"
      >
        <UserAvatar name={name} image={image} />
        <ChevronDown className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
          open && "rotate-180"
        )} />
      </button>

      <div className={cn(
        "absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-background shadow-xl overflow-hidden z-50",
        "transition-all duration-200 origin-top-right",
        open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
      )}>
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground truncate">{name ?? "My Account"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your account</p>
        </div>
        <div className="p-1.5 space-y-0.5">
          <Link href="/profile" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <User className="h-4 w-4 text-muted-foreground" /> Profile
          </Link>
          <Link href="/profile/orders" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" /> My Orders
          </Link>
          <div className="my-1 border-t border-border" />
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Auth buttons — logged-out state
───────────────────────────────────────── */
function AuthButtons() {
  return (
    <div className="flex items-center gap-1.5">
      <Link href="/login"
        className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/75 hover:text-foreground hover:bg-muted transition-all duration-200">
        Login
      </Link>
      <Link href="/register"
        className="rounded-full bg-foreground px-3.5 py-1.5 text-sm font-semibold text-background hover:opacity-80 transition-all duration-200">
        Register
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────
   Cart button with animated badge
───────────────────────────────────────── */
function CartButton() {
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);
  const [bouncing, setBouncing] = useState(false);
  const prevCountRef = useRef(cartCount);

  useEffect(() => {
    if (lastAddedAt && cartCount > prevCountRef.current) {
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 600);
      return () => clearTimeout(t);
    }
    prevCountRef.current = cartCount;
  }, [lastAddedAt, cartCount]);

  return (
    <Link href="/cart"
      className="relative rounded-full p-2.5 text-foreground/70 hover:text-foreground hover:bg-muted transition-all duration-200"
      aria-label={`Cart${cartCount > 0 ? ` – ${cartCount} items` : ""}`}
    >
      <ShoppingCart className="h-[18px] w-[18px]" />
      {cartCount > 0 && (
        <span className={cn(
          "absolute right-0.5 top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full",
          "bg-foreground text-[9px] font-bold text-background leading-none px-[3px]",
          bouncing && "animate-badge-bounce"
        )}>
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </Link>
  );
}

/* ─────────────────────────────────────────
   Search bar
   – type="text" so browsers never show
     their own native cancel/clear button.
   – Custom X clears the field.
   – Enter navigates to /?search=…
───────────────────────────────────────── */
function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const q = value.trim();
      if (q) router.push(`/?search=${encodeURIComponent(q)}`);
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-1 justify-center px-2 sm:px-4">
      <div className="relative w-full max-w-sm">

        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted-foreground/70 pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* type="text" — eliminates the browser's native search cancel button entirely */}
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products…"
          aria-label="Search products"
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "w-full rounded-full py-2 pl-9 text-sm outline-none",
            "placeholder:text-muted-foreground/60 transition-all duration-200",
            /* right padding: more when value present (for X) or ⌘K hint exists */
            value ? "pr-8" : "pr-14 sm:pr-16",
            focused
              ? "bg-background ring-2 ring-foreground/10 dark:ring-white/10 shadow-sm"
              : "bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200/70 dark:hover:bg-white/[0.09]"
          )}
        />

        {/* Clear button — only when there is text */}
        {value && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); clearSearch(); }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-muted-foreground/25 text-muted-foreground hover:bg-muted-foreground/40 transition-colors"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}

        {/* ⌘K hint — only when empty and unfocused */}
        {!value && (
          <kbd className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border",
            "bg-muted px-1.5 font-mono text-[10px] text-muted-foreground pointer-events-none",
            "transition-opacity duration-150",
            focused ? "opacity-0" : "opacity-100"
          )}>
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Navbar
───────────────────────────────────────── */
export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-border dark:border-white/[0.07]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Top bar ── */}
        <div className="flex h-[68px] items-center gap-2 sm:gap-3">

          {/* Logo */}
          <Link href="/"
            className="flex flex-col items-center gap-0.5 w-16 shrink-0 text-foreground hover:opacity-70 transition-opacity duration-200"
            aria-label="NexMart home">
            <NexMartLogo />
            <span className="text-[8.5px] font-black tracking-[0.26em] uppercase leading-none">
              NexMart
            </span>
          </Link>

          {/* Search */}
          <SearchBar />

          {/* Right actions */}
          <div className="flex items-center shrink-0">
            <CartButton />

            {/* Auth — desktop only */}
            <div className="hidden sm:flex items-center ml-0.5">
              {status === "loading" ? (
                <div className="h-7 w-14 rounded-full bg-muted animate-pulse" />
              ) : session?.user ? (
                <UserMenu name={session.user.name} image={session.user.image} />
              ) : (
                <AuthButtons />
              )}
            </div>

            {/* Theme — desktop only */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="sm:hidden rounded-full p-2 text-foreground/70 hover:text-foreground hover:bg-muted transition-all duration-200"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-5 w-5">
                <Menu className={cn(
                  "absolute inset-0 h-5 w-5 transition-all duration-200",
                  mobileOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                )} />
                <X className={cn(
                  "absolute inset-0 h-5 w-5 transition-all duration-200",
                  mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                )} />
              </span>
            </button>
          </div>
        </div>

        {/* ── Desktop category nav ── */}
        <nav className="hidden sm:flex items-center justify-center overflow-x-auto scrollbar-hide -mb-px"
          aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link key={link.href} href={link.href}
                className={cn(
                  "whitespace-nowrap px-4 py-3 text-sm shrink-0 border-b-2 transition-all duration-200",
                  isActive
                    ? "border-foreground text-foreground font-bold dark:border-white dark:text-white"
                    : "border-transparent text-muted-foreground font-medium hover:text-foreground hover:border-foreground/25 dark:text-gray-400 dark:hover:text-white dark:hover:border-white/30"
                )}
                aria-current={isActive ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Mobile slide-down menu ── */}
      <div
        id="mobile-menu"
        className={cn(
          "sm:hidden border-t border-border bg-background dark:bg-[#0a0a0a] dark:border-white/[0.07]",
          "overflow-hidden transition-all duration-300 ease-in-out",
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="px-4 pt-3 pb-5 space-y-3">

          {/* Nav links */}
          <nav aria-label="Mobile navigation">
            <ul className="space-y-0.5">
              {navLinks.map((link) => {
                const isActive = link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center rounded-xl px-3 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-muted text-foreground font-bold dark:bg-white/10 dark:text-white"
                          : "text-muted-foreground font-medium hover:text-foreground hover:bg-muted/60 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border" />

          {/* Auth section */}
          {status !== "loading" && (
            session?.user ? (
              <div className="space-y-2">
                {/* User info */}
                <div className="flex items-center gap-2.5 px-1">
                  <UserAvatar name={session.user.name} image={session.user.image} />
                  <span className="text-sm font-semibold text-foreground dark:text-white truncate max-w-[180px]">
                    {session.user.name ?? session.user.email}
                  </span>
                </div>
                {/* Account links */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium text-foreground dark:text-slate-200 hover:bg-muted transition-colors"
                  >
                    <User className="h-3.5 w-3.5" /> Profile
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium text-foreground dark:text-slate-200 hover:bg-muted transition-colors"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> My Orders
                  </Link>
                </div>
                {/* Sign out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/40 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login"
                  className="flex-1 rounded-xl border border-border py-2.5 text-center text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Login
                </Link>
                <Link href="/register"
                  className="flex-1 rounded-xl bg-foreground py-2.5 text-center text-sm font-semibold text-background hover:opacity-80 transition-colors">
                  Register
                </Link>
              </div>
            )
          )}

          {/* Theme */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Appearance</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
