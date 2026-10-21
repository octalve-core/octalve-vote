"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Brand } from "./brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" }
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
      <Brand />
      <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
        {links.map(({ href, label }) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined} className={"text-sm font-semibold transition hover:text-indigo-600 " + (pathname === href ? "text-indigo-600" : "text-slate-600")}>{label}</Link>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        <Link href="/auth" className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Sign in</Link>
        <Link href="/auth?role=electoral&mode=register" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700">Get started <ArrowRight className="size-4" /></Link>
      </div>
      <button type="button" aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(v => !v)} className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-200 md:hidden">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
    </div>
    {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-100 bg-white px-5 pb-6 pt-3 md:hidden">
      {[...links, { href: "/auth", label: "Sign in" }, { href: "/auth?role=electoral&mode=register", label: "Get started" }].map(({ href, label }) =>
        <Link onClick={() => setOpen(false)} key={href} href={href} className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">{label}</Link>
      )}
    </nav>}
  </header>;
}
