import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { StaffRole } from "@prisma/client";
import { getDb } from "@/lib/db/client";
import { isAdminMfaEnabled, isStaffLoginEnabled, SESSION_COOKIE, SESSION_DAYS } from "@/lib/auth/config";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createStaffSession(accountId: string, mfaVerified = false) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const db = getDb();
  await db.staffSession.create({ data: { accountId, tokenHash: hashToken(token), expiresAt, mfaVerifiedAt: mfaVerified ? new Date() : null } });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export async function readStaffSession() {
  if (!isStaffLoginEnabled()) return null;
  const rawToken = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!rawToken || rawToken.length > 128) return null;
  const session = await getDb().staffSession.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    select: {
      expiresAt: true,
      revokedAt: true,
      mfaVerifiedAt: true,
      account: {
        select: {
          id: true, email: true, role: true, isDisabled: true,
          electoralBodyId: true,
          electoralBody: {
            select: { id: true, name: true, status: true, paymentStatus: true, subscriptionType: true }
          }
        }
      }
    }
  });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.account.isDisabled) return null;
  // A previously issued or manually inserted platform session cannot bypass
  // the missing platform-admin MFA flow. This role is intentionally unavailable.
  if (session.account.role === "PLATFORM_ADMIN" && (!isAdminMfaEnabled() || !session.mfaVerifiedAt)) return null;
  if (session.account.electoralBody?.status === "SUSPENDED") return null;
  return session.account;
}

export async function requireStaffRole(role: StaffRole) {
  const account = await readStaffSession();
  if (!account || account.role !== role || (role === "ELECTORAL_ADMIN" && !account.electoralBodyId)) {
    redirect(role === "PLATFORM_ADMIN" ? "/admin/login" : "/electoral/login");
  }
  return account;
}

export async function revokeStaffSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) {
    await getDb().staffSession.updateMany({
      where: { tokenHash: hashToken(token) },
      data: { revokedAt: new Date() }
    });
  }
  (await cookies()).delete(SESSION_COOKIE);
}
