import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Vote } from "lucide-react";

export function HeroSection() {
  return <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50/60">
    <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-44 size-[430px] rounded-full bg-purple-200/55 blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-44 size-[480px] rounded-full bg-indigo-200/60 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-5 py-24 text-center md:px-8 md:py-32">
      <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm"><span className="size-2 rounded-full bg-indigo-600" />Building a better digital election experience</span>
      <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-extrabold tracking-tight text-slate-950 md:text-7xl">Modern Voting <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Made Simple.</span></h1>
      <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">Octalve Vote brings voters, electoral bodies and platform oversight into one accessible election experience.</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/voter/login" className="inline-flex min-h-13 items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-700 hover:to-purple-700"><Vote className="size-5" /> Voter entrance <ArrowRight className="size-4" /></Link>
        <Link href="/electoral/login" className="inline-flex min-h-13 items-center gap-3 rounded-2xl border-2 border-indigo-200 bg-white px-7 py-4 font-semibold text-slate-800 hover:border-indigo-500"><Building2 className="size-5" /> Electoral body portal</Link>
        <Link href="/admin/login" className="inline-flex min-h-13 items-center gap-3 rounded-2xl px-7 py-4 font-semibold text-slate-700 hover:bg-white/70"><ShieldCheck className="size-5" /> Platform admin</Link>
      </div>
      <p className="mx-auto mt-7 max-w-xl text-sm text-slate-500">Product review preview: OTP authentication, ballot casting and result publication are not active yet.</p>
    </div>
  </section>;
}
