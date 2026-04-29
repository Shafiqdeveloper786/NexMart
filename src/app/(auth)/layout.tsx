import Link from "next/link";

function NexMartLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none"
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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 px-4 py-10">

      {/* Card */}
      <div className="w-full max-w-[440px] rounded-2xl border border-border bg-background shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">

        {/* Brand header inside card */}
        <div className="flex flex-col items-center gap-2 px-8 pt-8 pb-6 border-b border-border">
          <Link href="/" aria-label="NexMart home"
            className="text-foreground hover:opacity-70 transition-opacity duration-200">
            <NexMartLogo />
          </Link>
          <span className="text-[10px] font-black tracking-[0.28em] uppercase text-foreground/80">
            NexMart
          </span>
        </div>

        {/* Form content */}
        <div className="px-8 py-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        By continuing you agree to NexMart&apos;s{" "}
        <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">Terms</span>
        {" "}and{" "}
        <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>.
      </p>
    </div>
  );
}
