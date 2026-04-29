"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { initiateLogin } from "@/lib/actions/auth.actions";

const loginSchema = z.object({
  email:    z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
type LoginData = z.infer<typeof loginSchema>;

function Field({ id, label, error, right, children }: {
  id: string; label: string; error?: string;
  right?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        {right}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 animate-field-error">
          <AlertCircle className="h-3 w-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

function Input({ hasError, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
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

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") || "/";
  const urlError     = searchParams.get("error");

  const [showPw, setShowPw]         = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(
    urlError === "CredentialsSignin" ? "Invalid email or password." : null
  );

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    setGlobalError(null);

    // Step 1 — verify credentials server-side and dispatch OTP email
    const result = await initiateLogin(data.email, data.password);

    if (!result.success) {
      setGlobalError(result.message);
      toast.error("Sign in failed", { description: result.message });
      return;
    }

    toast.success("Verification code sent", {
      description: "Check your inbox for the 4-digit code.",
    });

    // Step 2 — redirect to the OTP verification page
    router.push(
      `/verify-login?email=${encodeURIComponent(data.email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`
    );
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Sign in to your NexMart account</p>
      </div>

      {globalError && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 px-4 py-3 animate-field-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{globalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field id="email" label="Email address" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email"
            placeholder="you@example.com" hasError={!!errors.email}
            {...register("email")} />
        </Field>

        <Field id="password" label="Password" error={errors.password?.message}
          right={
            <Link href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </Link>
          }>
          <div className="relative">
            <Input id="password" type={showPw ? "text" : "password"}
              autoComplete="current-password" placeholder="••••••••"
              hasError={!!errors.password} className="pr-10"
              {...register("password")} />
            <button type="button" onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <button type="submit" disabled={isSubmitting}
          className={cn(
            "relative w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold mt-1",
            "bg-foreground text-background transition-all duration-200 active:scale-[0.98]",
            "hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          )}>
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" />Sending code…</>
            : "Continue"}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">or continue with</span>
        </div>
      </div>

      <button type="button" onClick={() => signIn("google", { callbackUrl })}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted/60 active:scale-[0.98]">
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-foreground hover:underline underline-offset-4 transition-colors">
          Create one
        </Link>
      </p>
    </>
  );
}
