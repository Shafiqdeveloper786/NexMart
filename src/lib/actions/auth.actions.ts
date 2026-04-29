"use server";

import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */

function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateToken(): string {
  return crypto.randomUUID();
}

function otpEmailHtml(otp: string, name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff">
      <h2 style="margin:0 0 8px;font-size:22px;color:#111">Hi ${name},</h2>
      <p style="margin:0 0 24px;color:#555;font-size:15px">
        Use the code below to complete your NexMart sign-in.
        It expires in <strong>5 minutes</strong>.
      </p>
      <div style="text-align:center;margin:0 0 24px">
        <span style="display:inline-block;letter-spacing:10px;font-size:36px;font-weight:700;color:#111;background:#f4f4f5;padding:16px 28px;border-radius:12px">
          ${otp}
        </span>
      </div>
      <p style="margin:0;color:#999;font-size:13px">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

function resetOtpEmailHtml(otp: string, name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff">
      <h2 style="margin:0 0 8px;font-size:22px;color:#111">Hi ${name},</h2>
      <p style="margin:0 0 24px;color:#555;font-size:15px">
        You requested a password reset for your NexMart account.
        Use the code below — it expires in <strong>5 minutes</strong>.
      </p>
      <div style="text-align:center;margin:0 0 24px">
        <span style="display:inline-block;letter-spacing:10px;font-size:36px;font-weight:700;color:#111;background:#f4f4f5;padding:16px 28px;border-radius:12px">
          ${otp}
        </span>
      </div>
      <p style="margin:0;color:#999;font-size:13px">
        If you didn't request a password reset, please ignore this email.
        Your password will not change.
      </p>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════
   REGISTER
══════════════════════════════════════════════════════════ */

const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof RegisterInput, string>>;
  sessionToken?: string;
}

export async function registerUser(data: unknown): Promise<ActionResult> {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof RegisterInput;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { success: false, message: "Please fix the errors below", fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return {
      success: false,
      message: "An account with this email already exists",
      fieldErrors: { email: "This email is already registered" },
    };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email: normalizedEmail, password: hashed, role: "USER" },
  });

  // Generate a session token so the register page can auto sign-in
  const sessionToken = generateToken();
  await prisma.verificationToken.create({
    data: {
      email: normalizedEmail,
      token: `SESSION:${sessionToken}`,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return { success: true, message: "Account created!", sessionToken };
}

/* ══════════════════════════════════════════════════════════
   LOGIN — INITIATE (verify credentials + send OTP)
══════════════════════════════════════════════════════════ */

export async function initiateLogin(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user || !user.password) {
    return { success: false, message: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, message: "Invalid email or password" };
  }

  // Remove any stale login OTP tokens for this email before creating a new one
  await prisma.verificationToken.deleteMany({
    where: {
      email: normalizedEmail,
      token: { startsWith: `LOGIN_OTP:${normalizedEmail}:` },
    },
  });

  const otp = generateOtp();
  await prisma.verificationToken.create({
    data: {
      email: normalizedEmail,
      token: `LOGIN_OTP:${normalizedEmail}:${otp}`,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // console.log here confirms the real destination regardless of RESEND_TEST_EMAIL
  console.log("OTP sent to:", normalizedEmail);

  await sendEmail(
    normalizedEmail,
    "Your NexMart Login Code",
    otpEmailHtml(otp, user.name ?? "there")
  );

  return { success: true, message: "Verification code sent" };
}

/* ══════════════════════════════════════════════════════════
   LOGIN — VERIFY OTP
══════════════════════════════════════════════════════════ */

export async function verifyLoginOtp(
  email: string,
  otp: string
): Promise<{ success: boolean; message: string; sessionToken?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const record = await prisma.verificationToken.findFirst({
    where: {
      email: normalizedEmail,
      token: `LOGIN_OTP:${normalizedEmail}:${otp}`,
    },
  });

  if (!record) {
    return { success: false, message: "Invalid verification code" };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return { success: false, message: "Code has expired. Please go back and request a new one." };
  }

  await prisma.verificationToken.delete({ where: { id: record.id } });

  // Issue a short-lived session token the client exchanges for a real NextAuth session
  const sessionToken = generateToken();
  await prisma.verificationToken.create({
    data: {
      email: normalizedEmail,
      token: `SESSION:${sessionToken}`,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return { success: true, message: "Code verified", sessionToken };
}

/* ══════════════════════════════════════════════════════════
   LOGIN — RESEND OTP
══════════════════════════════════════════════════════════ */

export async function resendLoginOtp(
  email: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return { success: false, message: "No account found with this email" };
  }

  await prisma.verificationToken.deleteMany({
    where: {
      email: normalizedEmail,
      token: { startsWith: `LOGIN_OTP:${normalizedEmail}:` },
    },
  });

  const otp = generateOtp();
  await prisma.verificationToken.create({
    data: {
      email: normalizedEmail,
      token: `LOGIN_OTP:${normalizedEmail}:${otp}`,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  console.log("OTP sent to:", normalizedEmail);

  await sendEmail(
    normalizedEmail,
    "Your NexMart Login Code",
    otpEmailHtml(otp, user.name ?? "there")
  );

  return { success: true, message: "New verification code sent" };
}

/* ══════════════════════════════════════════════════════════
   PASSWORD RESET — SEND OTP
══════════════════════════════════════════════════════════ */

export async function sendResetOtp(
  email: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Always return success to avoid leaking whether an email is registered
  if (!user) {
    return { success: true, message: "If this email is registered, a reset code has been sent." };
  }

  if (!user.password) {
    return {
      success: false,
      message: "This account uses Google or GitHub sign-in and doesn't have a password to reset.",
    };
  }

  await prisma.verificationToken.deleteMany({
    where: {
      email: normalizedEmail,
      token: { startsWith: `RESET_OTP:${normalizedEmail}:` },
    },
  });

  const otp = generateOtp();
  await prisma.verificationToken.create({
    data: {
      email: normalizedEmail,
      token: `RESET_OTP:${normalizedEmail}:${otp}`,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  console.log("OTP sent to:", normalizedEmail);

  await sendEmail(
    normalizedEmail,
    "Reset Your NexMart Password",
    resetOtpEmailHtml(otp, user.name ?? "there")
  );

  return { success: true, message: "Reset code sent" };
}

/* ══════════════════════════════════════════════════════════
   PASSWORD RESET — VERIFY OTP
══════════════════════════════════════════════════════════ */

export async function verifyResetOtp(
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const record = await prisma.verificationToken.findFirst({
    where: {
      email: normalizedEmail,
      token: `RESET_OTP:${normalizedEmail}:${otp}`,
    },
  });

  if (!record) {
    return { success: false, message: "Invalid code. Please check and try again." };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return { success: false, message: "Code has expired. Please request a new one." };
  }

  // Leave the token in place — resetPassword will consume it
  return { success: true, message: "Code verified" };
}

/* ══════════════════════════════════════════════════════════
   PASSWORD RESET — RESET PASSWORD
══════════════════════════════════════════════════════════ */

export async function resetPassword(
  email: string,
  pin: string,
  newPassword: string
): Promise<{ success: boolean; message: string; sessionToken?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Re-verify the reset OTP to prevent replay without the PIN step
  const record = await prisma.verificationToken.findFirst({
    where: {
      email: normalizedEmail,
      token: `RESET_OTP:${normalizedEmail}:${pin}`,
    },
  });

  if (!record || record.expires < new Date()) {
    return { success: false, message: "Reset code is invalid or expired. Please start over." };
  }

  await prisma.verificationToken.delete({ where: { id: record.id } });

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { password: hashed },
  });

  // Issue a session token so the page can auto sign-in the user after reset
  const sessionToken = generateToken();
  await prisma.verificationToken.create({
    data: {
      email: normalizedEmail,
      token: `SESSION:${sessionToken}`,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return { success: true, message: "Password reset successfully", sessionToken };
}
