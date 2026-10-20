"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Vote, Users, HelpCircle, LogOut } from "lucide-react";
import { staffLogoutAction } from "@/app/actions/staff-auth";

const items = [
  { href: "/electoral/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/electoral/elections", label: "Elections", icon: Vote },
  { href: "/electoral/voters", label: "Voters", icon: Users },
  { href: "/electoral/support", label: "Support", icon: HelpCircle }
] as const;

export function ElectoralNavigation({ organization }: { organization: string }) {
  const path = usePathname();
  const nav = items.map(({ href, label, icon: Icon }) =>
    <Link key={href} href={href} aria-current={path === href ? "page" : undefined}
      className={"flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors " + (path === href ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100")}>
      <Icon className="size-4" aria-hidden="true" />{label}
    </Link>);

  return <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-lg">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <Link href="/electoral/dashboard" className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white"><Building2 className="size-5" /></span>
        <span className="truncate text-base font-bold text-slate-900">{organization}</span>
      </Link>
      <nav aria-label="Electoral dashboard navigation" className="hidden items-center gap-1 md:flex">{nav}</nav>
      <form action={staffLogoutAction}><button type="submit" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"><LogOut className="size-4" /> <span className="hidden sm:inline">Logout</span></button></form>
    </div>
    <nav aria-label="Mobile electoral navigation" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-3 md:hidden">{nav}</nav>
  </header>;
}
