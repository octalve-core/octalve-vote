"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/config";
import { z } from "zod";
import { getDb } from "@/lib/db/client";
import { createStaffSession, revokeStaffSession } from "@/lib/auth/session";
import { consumeAuthAttempt } from "@/lib/auth/throttle";
import { isSignupEnabled, isStaffLoginEnabled, isAdminMfaEnabled } from "@/lib/auth/config";
import { decryptMfaSecret, verifyTotpCounter } from "@/lib/auth/totp";

export type StaffAuthState = { error: string };


const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(256),
  role: z.enum(["electoral", "admin"]),
  otp: z.string().optional()
});

const registerSchema = z.object({
  organization: z.string().trim().min(2).max(140),
  contactPerson: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().max(40).optional(),
  password: z.string().min(12).max(128),
  confirm: z.string(),
  plan: z.enum(["PERSONAL", "ORGANIZATIONAL", "UNLIMITED"])
}).refine(data => data.password === data.confirm, { path: ["confirm"] });

export async function staffLoginAction(_state: StaffAuthState, form: FormData): Promise<StaffAuthState> {
  if (!isStaffLoginEnabled()) return { error: "Staff sign-in is not enabled for this environment." };
  const input = loginSchema.safeParse({
    email: form.get("email"), password: form.get("password"), role: form.get("role"), otp: form.get("otp") ?? undefined
  });
  if (!input.success) return { error: "Enter a valid email address and password." };
  if (input.data.role === "admin" && !isAdminMfaEnabled()) {
    return { error: "Platform administrator sign-in requires configured MFA." };
  }

  const email = input.data.email.toLowerCase().trim();
  const neededRole = input.data.role === "admin" ? "PLATFORM_ADMIN" : "ELECTORAL_ADMIN";
  let destination: string | undefined;

  try {
    const db = getDb();
    if (!await consumeAuthAttempt("staff-login", email, 8)) {
      return { error: "Too many attempts. Please try again in 15 minutes." };
    }
    const staff = await db.staffAccount.findUnique({ where: { email } });
    const permitted = staff &&
      staff.role === neededRole &&
      !staff.isDisabled &&
      (!staff.lockedUntil || staff.lockedUntil < new Date());
    const validPassword = staff && permitted && await compare(input.data.password, staff.passwordHash);
    if (!permitted || !validPassword) {
      if (staff && permitted) {
        const next = staff.failedAttempts + 1;
        await db.staffAccount.update({
          where: { id: staff.id },
          data: {
            failedAttempts: next,
            lockedUntil: next >= 5 ? new Date(Date.now() + 15 * 60_000) : null
          }
        });
      }
      return { error: "Invalid credentials or account unavailable." };
    }
    if (staff.role === "ELECTORAL_ADMIN" && !staff.electoralBodyId) {
      return { error: "Account configuration is incomplete. Contact support." };
    }
    const org = staff.electoralBodyId ? await db.electoralBody.findUnique({
      where: { id: staff.electoralBodyId }, select: { status: true }
    }) : null;
    if (org?.status === "SUSPENDED") return { error: "Invalid credentials or account unavailable." };

    if (neededRole === "PLATFORM_ADMIN") {
      if (!staff.mfaSecretEncrypted || !input.data.otp) {
        return { error: "Invalid credentials or account unavailable." };
      }
      const counter = verifyTotpCounter(
        decryptMfaSecret(staff.mfaSecretEncrypted), input.data.otp, staff.mfaLastCounter
      );
      if (counter === null) return { error: "Invalid credentials or account unavailable." };
      // Atomic TOTP replay protection across all app instances. A counter can be used only once.
      const update = await db.staffAccount.updateMany({
        where: { id: staff.id, OR: [{ mfaLastCounter: null }, { mfaLastCounter: { lt: counter } }] },
        data: { mfaLastCounter: counter, failedAttempts: 0, lockedUntil: null }
      });
      if (update.count !== 1) return { error: "Invalid credentials or account unavailable." };
    } else {
      await db.staffAccount.update({
        where: { id: staff.id },
        data: { failedAttempts: 0, lockedUntil: null }
      });
    }
    await createStaffSession(staff.id, neededRole === "PLATFORM_ADMIN");
    await db.authAuditEvent.create({ data: { accountId: staff.id, action: "STAFF_LOGIN" } });
    destination = staff.role === "PLATFORM_ADMIN" ? "/admin" : "/electoral/dashboard";
  } catch {
    return { error: "Sign-in is temporarily unavailable. Please try again later." };
  }
  redirect(destination ?? "/electoral/login");
}

export async function electoralRegisterAction(_state: StaffAuthState, form: FormData): Promise<StaffAuthState> {
  if (!isSignupEnabled()) return { error: "Organization registration is not enabled for this environment." };
  const input = registerSchema.safeParse({
    organization: form.get("organization"),
    contactPerson: form.get("contactPerson"),
    email: form.get("email"),
    phone: form.get("phone") || undefined,
    password: form.get("password"),
    confirm: form.get("confirm"),
    plan: form.get("plan")
  });
  if (!input.success) return { error: "Check the required fields; passwords must match and contain at least 12 characters." };

  const email = input.data.email.toLowerCase().trim();
  try {
    if (!await consumeAuthAttempt("org-signup", email, 3)) {
      return { error: "Please try registration again later." };
    }
    const db = getDb();
    const existing = await db.staffAccount.findUnique({ where: { email }, select: { id: true } });
    if (existing) return { error: "Unable to register with these details. Contact support if you already have an account." };
    const hashed = await hash(input.data.password, 12);
    // All new organizations remain pending and unpaid; signup can never self-approve.
    const account = await db.$transaction(async tx => {
      const body = await tx.electoralBody.create({
        data: {
          name: input.data.organization,
          contactPerson: input.data.contactPerson,
          email,
          phone: input.data.phone,
          subscriptionType: input.data.plan,
          status: "PENDING",
          paymentStatus: "UNPAID"
        }
      });
      const staff = await tx.staffAccount.create({
        data: { email, passwordHash: hashed, role: "ELECTORAL_ADMIN", electoralBodyId: body.id }
      });
      await tx.authAuditEvent.create({ data: { accountId: staff.id, action: "ORGANIZATION_REGISTERED" } });
      return staff;
    });
    await createStaffSession(account.id);
  } catch {
    return { error: "Registration could not be completed. Check your details or try again later." };
  }
  redirect("/electoral/dashboard");
}

export async function staffLogoutAction(): Promise<void> {
  try {
    await revokeStaffSession();
  } catch {
    // Drop the browser credential even if persistence is unavailable. The
    // session record requires follow-up revocation when the database recovers.
    (await cookies()).delete(SESSION_COOKIE);
  }
  redirect("/auth");
}
