import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  const publicLinks = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }, { href: "/pricing", label: "Pricing" }, { href: "/contact", label: "Contact" }];
  const roleLinks = [{ href: "/voter/login", label: "Voter" }, { href: "/electoral/login", label: "Electoral body" }, { href: "/admin/login", label: "Platform administrator" }];

  return <footer className="border-t border-slate-100 bg-slate-50">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
      <div><Brand /><p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">Building an accessible digital election experience for organizations. Preview functionality is under review.</p></div>
      <div><h2 className="mb-4 text-sm font-bold">Explore</h2><div className="grid grid-cols-2 gap-3 text-sm text-slate-600">{publicLinks.map(link => <Link className="hover:text-indigo-600" key={link.href} href={link.href}>{link.label}</Link>)}</div></div>
      <div><h2 className="mb-4 text-sm font-bold">Portals</h2><div className="flex flex-col gap-3 text-sm text-slate-600">{roleLinks.map(link => <Link className="hover:text-indigo-600" key={link.href} href={link.href}>{link.label}</Link>)}</div></div>
    </div>
    <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-slate-200 px-5 py-6 text-xs text-slate-500 md:px-8"><span>© {new Date().getFullYear()} Octalve Vote</span><span>Review preview · Real elections unavailable</span></div>
  </footer>;
}
