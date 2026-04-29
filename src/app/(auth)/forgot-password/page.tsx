"use client";

import {
  useState, useRef, useEffect,
  type KeyboardEvent, type ClipboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft, Mail, KeyRound, Lock,
  Eye, EyeOff, Check, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import {
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "@/lib/actions/auth.actions";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type Step = "email" | "pin" | "password" | "done";

/* ══════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════ */
function Field({
  id, label, error, children,
}: {
  id: string; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 animate-field-error">
          <AlertCircle className="h-3 w-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

function Input({
  hasError, className, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border bg-muted/40 px-4 py-2.5 text-sm outline-none",
        "placeholder:text-muted-foreground/60 transition-all duration-200",
        hasError
          ? "border-red-400 bg-red-50/30 dark:bg-red-950/10 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
          : "border-border hover:border-foreground/20 focus:border-foreground/25 focus:bg-background focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]",
        className
      )}
      {...props}
    />
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 px-4 py-3 animate-field-error">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}

function SubmitButton({
  loading, disabled, children,
}: { loading?: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "w-full flex items-center justify-center gap-2 rounded-xl",
        "bg-foreground text-background px-4 py-2.5 text-sm font-semibold",
        "transition-all duration-200 active:scale-[0.98]",
        "hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════
   STEP 1 — EMAIL INPUT
══════════════════════════════════════════ */
const emailSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});
type EmailData = z.infer<typeof emailSchema>;

function EmailStep({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailData>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async ({ email }: EmailData) => {
    setError(null);
    const result = await sendResetOtp(email);

    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success("Code sent!", { description: "Check your email inbox." });
    onSuccess(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-muted mb-4">
          <Mail className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a 4-digit code to reset your password.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <Field id="email" label="Email address" error={errors.email?.message}>
        <Input
          id="email" type="email" autoComplete="email"
          placeholder="you@example.com"
          hasError={!!errors.email}
          {...register("email")}
        />
      </Field>

      <SubmitButton loading={isSubmitting}>
        {isSubmitting ? "Sending PIN…" : "Send PIN"}
      </SubmitButton>

      <p className="text-center">
        <Link href="/login"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

/* ══════════════════════════════════════════
   STEP 2 — 4-BOX PIN INPUT
══════════════════════════════════════════ */
function PinBoxes({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  error?: boolean;
}) {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first empty box on mount
  useEffect(() => { refs[0].current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < 3) refs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const next = [...value];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        refs[index - 1].current?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) refs[index - 1].current?.focus();
    if (e.key === "ArrowRight" && index < 3) refs[index + 1].current?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4).split("");
    const next = ["", "", "", ""];
    digits.forEach((d, i) => { next[i] = d; });
    onChange(next);
    const focusIdx = Math.min(digits.length, 3);
    refs[focusIdx].current?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-3" role="group" aria-label="PIN input">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`PIN digit ${i + 1}`}
          className={cn(
            "h-14 w-14 rounded-2xl border text-center text-xl font-bold outline-none",
            "transition-all duration-150 caret-transparent select-none",
            error
              ? "border-red-400 bg-red-50/30 dark:bg-red-950/10 text-red-500"
              : value[i]
              ? "border-foreground bg-foreground/5 text-foreground shadow-sm"
              : "border-border bg-muted/40 text-foreground",
            "focus:border-foreground focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
          )}
        />
      ))}
    </div>
  );
}

function PinStep({
  email,
  onSuccess,
  onResend,
}: {
  email: string;
  onSuccess: (pin: string) => void;
  onResend: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const pin = digits.join("");
  const complete = pin.length === 4;

  const verify = async () => {
    if (!complete) return;
    setLoading(true);
    setError(null);

    const result = await verifyResetOtp(email, pin);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      toast.error("Verification failed", { description: result.message });
      setDigits(["", "", "", ""]);
      return;
    }

    toast.success("Code verified!");
    onSuccess(pin);
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    const result = await sendResetOtp(email);
    setResending(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("New code sent!", { description: "Check your email inbox." });
    setDigits(["", "", "", ""]);
    onResend();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-muted mb-4">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Enter your code</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 4-digit PIN to{" "}
          <span className="font-medium text-foreground">{email}</span>.
          It expires in 5 minutes.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <PinBoxes value={digits} onChange={setDigits} error={!!error} />

      <button
        type="button"
        onClick={verify}
        disabled={!complete || loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-xl",
          "bg-foreground text-background px-4 py-2.5 text-sm font-semibold",
          "transition-all duration-200 active:scale-[0.98]",
          "hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Verifying…" : "Verify PIN"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link href="/login"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", resending && "animate-spin")} />
          Resend PIN
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STEP 3 — NEW PASSWORD
══════════════════════════════════════════ */
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "At least 8 characters" })
      .regex(/[A-Z]/, { message: "One uppercase letter" })
      .regex(/[0-9]/, { message: "One number" }),
    confirm: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type PasswordData = z.infer<typeof passwordSchema>;

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const rules = [
    { label: "8+ characters",      met: password.length >= 8 },
    { label: "Uppercase letter",    met: /[A-Z]/.test(password) },
    { label: "Number",              met: /[0-9]/.test(password) },
  ];
  const score = rules.filter((r) => r.met).length;
  const barColor = score === 3 ? "bg-green-500" : score === 2 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="space-y-2 mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <div key={n} className={cn(
            "h-1 flex-1 rounded-full transition-all duration-300",
            score >= n ? barColor : "bg-muted"
          )} />
        ))}
      </div>
      <ul className="space-y-0.5">
        {rules.map((r) => (
          <li key={r.label}
            className={cn("flex items-center gap-1.5 text-xs transition-colors",
              r.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
            )}>
            <Check className={cn("h-3 w-3 shrink-0", r.met ? "opacity-100" : "opacity-25")} />
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewPasswordStep({
  email,
  pin,
  onSuccess,
}: {
  email: string;
  pin: string;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoLogging, setIsAutoLogging] = useState(false);

  const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const password = watch("password", "");
  const loading = isSubmitting || isAutoLogging;

  const onSubmit = async ({ password: newPw }: PasswordData) => {
    setError(null);
    const result = await resetPassword(email, pin, newPw);

    if (!result.success) {
      setError(result.message);
      toast.error("Reset failed", { description: result.message });
      return;
    }

    setIsAutoLogging(true);
    toast.success("Password Reset Successful! You are now logged in", {
      description: "Welcome back!",
    });

    if (result.sessionToken) {
      const signInResult = await signIn("credentials", {
        email,
        sessionToken: result.sessionToken,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/");
        router.refresh();
        return;
      }
    }

    // Auto-login failed — show fallback done screen which redirects to /login
    setIsAutoLogging(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-muted mb-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Create new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <Field id="password" label="New password" error={errors.password?.message}>
        <div className="relative">
          <Input
            id="password" type={showPw ? "text" : "password"}
            autoComplete="new-password" placeholder="••••••••"
            hasError={!!errors.password} className="pr-10"
            {...register("password")}
          />
          <button type="button" onClick={() => setShowPw((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrength password={password} />
      </Field>

      <Field id="confirm" label="Confirm password" error={errors.confirm?.message}>
        <div className="relative">
          <Input
            id="confirm" type={showConfirm ? "text" : "password"}
            autoComplete="new-password" placeholder="••••••••"
            hasError={!!errors.confirm} className="pr-10"
            {...register("confirm")}
          />
          <button type="button" onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}>
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <SubmitButton loading={loading}>
        {isAutoLogging ? "Signing you in…" : loading ? "Resetting…" : "Reset password"}
      </SubmitButton>
    </form>
  );
}

/* ══════════════════════════════════════════
   STEP 4 — SUCCESS
══════════════════════════════════════════ */
function DoneStep() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 4000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="text-center space-y-5 py-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 mx-auto">
        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Password reset!</h1>
        <p className="text-sm text-muted-foreground">
          Your password has been updated. Please sign in with your new credentials.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-85 transition-opacity"
      >
        Sign in now
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════
   ORCHESTRATOR — wires the 4 steps together
══════════════════════════════════════════ */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  return (
    <>
      {step === "email" && (
        <EmailStep
          onSuccess={(e) => { setEmail(e); setStep("pin"); }}
        />
      )}
      {step === "pin" && (
        <PinStep
          email={email}
          onSuccess={(p) => { setPin(p); setStep("password"); }}
          onResend={() => {}}
        />
      )}
      {step === "password" && (
        <NewPasswordStep
          email={email}
          pin={pin}
          onSuccess={() => setStep("done")}
        />
      )}
      {step === "done" && <DoneStep />}
    </>
  );
}
