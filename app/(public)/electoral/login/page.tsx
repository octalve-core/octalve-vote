import type { Metadata } from "next";
import { ElectoralAuthSection } from "@/components/sections/auth/electoral-auth-section";
import { isSignupEnabled, isStaffLoginEnabled } from "@/lib/auth/config";

export const metadata: Metadata = { title: "Electoral body portal" };

export default function ElectoralLoginPage() {
  return <ElectoralAuthSection loginEnabled={isStaffLoginEnabled()} signupEnabled={isSignupEnabled()} />;
}
