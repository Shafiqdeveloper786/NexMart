"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils/cn";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain a number" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

/* ── Shared field wrapper ── */
function Field({
  id, label, error, children,
}: {
  id: string; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 animate-field-error">
          <AlertCircle className="h-3 w-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

/* ── Input ── */
function Input({
  hasError, className, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border bg-muted/40 px-4 py-2.5 text-sm outline-none",
        "placeholder:text-muted-foreground transition-all duration-200",
        hasError
          ? "border-red-400 bg-red-50/30 dark:bg-red-950/10 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
          : "border-border hover:border-foreground/20 focus:border-foreground/25 focus:bg-background focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]",
        className
      )}
      {...props}
    />
  );
}

/* ── Password strength checklist ── */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter",  met: /[A-Z]/.test(password) },
    { label: "One number",            met: /[0-9]/.test(password) },
  ];
  return (
    <ul className="mt-1.5 space-y-1">
      {rules.map((r) => (
        <li key={r.label}
          className={cn("flex items-center gap-1.5 text-xs transition-colors",
            r.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
          )}>
          <Check className={cn("h-3 w-3 shrink-0 transition-opacity", r.met ? "opacity-100" : "opacity-30")} />
          {r.label}
        </li>
      ))}
    </ul>
  );
}

/* ── Google icon ── */
function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [globalError, setGlobalError]   = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register, handleSubmit, watch, setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterData) => {
    setGlobalError(null);
    const result = await registerUser(data);

    if (!result.success) {
      // Map field-level errors back into the form
      if (result.fieldErrors) {
        (Object.entries(result.fieldErrors) as [keyof RegisterData, string][])
          .forEach(([field, message]) => setError(field, { message }));
      }
      const msg = result.message ?? "Something went wrong. Please try again.";
      setGlobalError(msg);
      toast.error("Registration failed", { description: msg });
      return;
    }

    setDone(true);
    toast.success("Registration Successful! Welcome to NexMart", {
      description: `Great to have you, ${data.name.split(" ")[0]}!`,
    });

    // Auto sign-in using the one-time session token issued by the server action
    const signInResult = await signIn("credentials", {
      email: data.email,
      sessionToken: result.sessionToken,
      redirect: false,
    });

    if (signInResult?.ok) {
      router.push("/");
      router.refresh();
    } else {
      // Session token consumed or expired — fall back to login page
      router.push("/login");
    }
  };

  return (
    <>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Create your account</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Start shopping on NexMart today</p>
      </div>

      {/* Global error banner */}
      {globalError && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 px-4 py-3 animate-field-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
        </div>
      )}

      {/* Success banner (shown briefly before redirect) */}
      {done && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          Account created! Signing you in…
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

        {/* Name */}
        <Field id="name" label="Full name" error={errors.name?.message}>
          <Input id="name" type="text" autoComplete="name"
            placeholder="Alex Johnson" hasError={!!errors.name}
            {...register("name")} />
        </Field>

        {/* Email */}
        <Field id="email" label="Email address" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email"
            placeholder="you@example.com" hasError={!!errors.email}
            {...register("email")} />
        </Field>

        {/* Password */}
        <Field id="password" label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"}
              autoComplete="new-password" placeholder="••••••••"
              hasError={!!errors.password} className="pr-10"
              {...register("password")} />
            <button type="button" onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </Field>

        {/* Confirm password */}
        <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
          <div className="relative">
            <Input id="confirmPassword" type={showConfirm ? "text" : "password"}
              autoComplete="new-password" placeholder="••••••••"
              hasError={!!errors.confirmPassword} className="pr-10"
              {...register("confirmPassword")} />
            <button type="button" onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}>
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting || done}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-85 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-1">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting
            ? done ? "Signing you in…" : "Creating account…"
            : "Create account"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
        </div>
      </div>

      {/* Google */}
      <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted/60 active:scale-[0.98]">
        <GoogleIcon />
        Sign up with Google
      </button>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login"
          className="font-semibold text-foreground hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  );
}
