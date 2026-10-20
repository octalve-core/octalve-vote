import type { Metadata } from "next";
import { ElectoralAuthSection } from "@/components/sections/auth/electoral-auth-section";
import { isSignupEnabled, isStaffLoginEnabled } from "@/lib/auth/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Electoral body portal" };

export default async function ElectoralLoginPage({ searchParams }: { searchParams: Promise<{ email_verified?: string }> }) {
  const { email_verified } = await searchParams;
  return <ElectoralAuthSection loginEnabled={isStaffLoginEnabled()} signupEnabled={isSignupEnabled()}
    emailVerified={email_verified === "1"} />;
}
