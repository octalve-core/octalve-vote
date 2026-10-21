import type { Metadata } from "next";
import { isSignupEnabled, isStaffLoginEnabled, isAdminMfaEnabled } from "@/lib/auth/config";
import { UnifiedAccessSection, type AccessRole } from "@/components/sections/auth/unified-access-section";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Secure access",
  description: "Select voter, electoral body or platform administrator access to Octalve Vote."
};

export default async function AuthPage({ searchParams }: {
  searchParams: Promise<{ role?: string; mode?: string; email_verified?: string }>
}) {
  const query = await searchParams;
  const role: AccessRole = query.role === "voter" || query.role === "admin" ? query.role : "electoral";
  return <UnifiedAccessSection role={role} initialMode={query.mode === "register" && role === "electoral" ? "register" : "login"}
    staffEnabled={isStaffLoginEnabled()} signupEnabled={isSignupEnabled()}
    adminEnabled={isAdminMfaEnabled()} emailVerified={query.email_verified === "1"} />;
}
