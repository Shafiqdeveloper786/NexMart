"use client";

import {
  useState, useRef, useEffect,
  type KeyboardEvent, type ClipboardEvent,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { verifyLoginOtp, resendLoginOtp } from "@/lib/actions/auth.actions";

/* ── 4-box OTP input ─────────────────────────────────────────────────────── */
function PinBoxes({
  value,
  onChange,
  hasError,
  disabled,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  hasError: boolean;
  disabled: boolean;
}) {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => { refs[0].current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next  = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < 3) refs[index + 1].current?.focus();
  };

  const handleKey = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const n = [...value]; n[index] = ""; onChange(n);
      } else if (index > 0) {
        refs[index - 1].current?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && index > 0) refs[index - 1].current?.focus();
    if (e.key === "ArrowRight" && index < 3) refs[index + 1].current?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4).split("");
    const next   = ["", "", "", ""];
    digits.forEach((d, i) => { next[i] = d; });
    onChange(next);
    refs[Math.min(digits.length, 3)].current?.focus();
  };

  return (
    <div
      className="flex items-center justify-center gap-3"
      role="group"
      aria-label="Verification code"
    >
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          disabled={disabled}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1} of 4`}
          className={cn(
            "h-14 w-14 rounded-2xl border text-center text-xl font-bold outline-none",
            "transition-all duration-150 caret-transparent select-none",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            hasError
              ? "border-red-400 bg-red-50/30 dark:bg-red-950/10 text-red-500"
              : value[i]
              ? "border-foreground/60 bg-foreground/5 text-foreground shadow-sm"
              : "border-border bg-muted/40 text-foreground",
            "focus:border-foreground focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
          )}
        />
      ))}
    </div>
  );
}

/* ── Resend button with 60-second cooldown ───────────────────────────────── */
function ResendButton({
  email,
  onResent,
}: {
  email: string;
  onResent: () => void;
}) {
  const [cooldown, setCooldown] = useState(0);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    const result = await resendLoginOtp(email);
    setLoading(false);

    if (!result.success) {
      toast.error("Could not resend code", { description: result.message });
      return;
    }

    toast.success("New code sent", { description: "Check your inbox." });
    setCooldown(60);
    onResent();
  };

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={cooldown > 0 || loading}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function VerifyLoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = decodeURIComponent(searchParams.get("email") ?? "");
  const callbackUrl  = decodeURIComponent(searchParams.get("callbackUrl") ?? "/");

  const [digits,   setDigits]   = useState(["", "", "", ""]);
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  if (!email) {
    router.replace("/login");
    return null;
  }

  const code     = digits.join("");
  const complete = code.length === 4;

  const handleVerify = async () => {
    if (!complete || loading) return;
    setLoading(true);
    setError(null);

    // Step 1 — validate OTP, receive a one-time session token
    const verifyResult = await verifyLoginOtp(email, code);

    if (!verifyResult.success || !verifyResult.sessionToken) {
      setError(verifyResult.message);
      toast.error("Verification failed", { description: verifyResult.message });
      setDigits(["", "", "", ""]);
      setLoading(false);
      return;
    }

    // Step 2 — exchange the session token for a real NextAuth session
    const signInResult = await signIn("credentials", {
      email,
      sessionToken: verifyResult.sessionToken,
      redirect: false,
    });

    setLoading(false);

    if (!signInResult?.ok) {
      setError("Session could not be created. Please sign in again.");
      toast.error("Sign in failed. Please go back and try again.");
      return;
    }

    toast.success("Login verified!", {
      description: "Welcome back — you're now signed in.",
    });
    router.push(callbackUrl);
    router.refresh();
  };

  const maskedEmail = email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) =>
    a + b.replace(/./g, "•") + c
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-muted mb-4">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Check your inbox
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We sent a 4-digit verification code to{" "}
          <span className="font-medium text-foreground">{maskedEmail}</span>.
          Enter it below to complete your sign in.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 px-4 py-3 animate-field-error">
          <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* OTP boxes */}
      <PinBoxes
        value={digits}
        onChange={setDigits}
        hasError={!!error}
        disabled={loading}
      />

      {/* Expiry hint */}
      <p className="text-center text-xs text-muted-foreground">
        Code expires in <span className="font-medium text-foreground">5 minutes</span>
      </p>

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={!complete || loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-xl",
          "bg-foreground text-background px-4 py-2.5 text-sm font-semibold",
          "transition-all duration-200 active:scale-[0.98]",
          "hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Verifying…" : "Verify & sign in"}
      </button>

      {/* Bottom links */}
      <div className="flex items-center justify-between text-sm">
        <Link href="/login"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>

        <ResendButton
          email={email}
          onResent={() => setDigits(["", "", "", ""])}
        />
      </div>
    </div>
  );
}
