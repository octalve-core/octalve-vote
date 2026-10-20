import type { ReactNode } from "react";
import { requireStaffRole } from "@/lib/auth/session";
import { ElectoralNavigation } from "@/components/sections/electoral/electoral-navigation";

export const dynamic = "force-dynamic";

export default async function ElectoralLayout({ children }: { children: ReactNode }) {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30">
    <ElectoralNavigation organization={account.electoralBody?.name ?? "Electoral body"} />
    {children}
  </div>;
}
