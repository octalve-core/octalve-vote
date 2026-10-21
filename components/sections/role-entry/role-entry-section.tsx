import Link from "next/link";
import { ArrowLeft, Building2, Shield, Vote } from "lucide-react";

export type PortalRole = "voter" | "electoral" | "admin";
const portals = {
  voter: { label: "Voter entrance", title: "Your vote, your voice.", icon: Vote, summary: "Voters will enter an election using their authorized invitation and one-time verification method.", steps: ["Open election invitation", "Verify eligibility", "Review candidates", "Confirm ballot once"] },
  electoral: { label: "Electoral body portal", title: "Manage elections with clarity.", icon: Building2, summary: "Electoral teams will create and supervise organization elections, from voter registers through publication.", steps: ["Register organization", "Configure election", "Approve voter register", "Monitor and certify results"] },
  admin: { label: "Platform administration", title: "Oversight with boundaries.", icon: Shield, summary: "Platform administrators will govern approvals and operations, without accessing how individual voters cast secret ballots.", steps: ["Secure staff authentication", "Review organization approvals", "Respond to operational incidents", "Review access and audit events"] }
} as const;

export function RoleEntrySection({ role }: { role: PortalRole }) {
  const portal = portals[role];
  const Icon = portal.icon;

  return <main className="min-h-[65vh] bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline"><ArrowLeft className="size-4" />Back to home</Link>
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-indigo-100/60 md:p-12">
        <span className="mb-7 inline-flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon className="size-7" /></span>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">{portal.label}</p><h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{portal.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{portal.summary}</p>
        <h2 className="mt-10 text-base font-bold">Expected user journey</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">{portal.steps.map((step, index) => <li key={step} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm"><span className="font-bold text-indigo-600">{String(index + 1).padStart(2, "0")}</span><span>{step}</span></li>)}</ol>
        <div role="status" className="mt-9 rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="font-bold text-amber-900">Review-only access</p><p className="mt-2 text-sm leading-6 text-amber-900">Sign-in, OTP delivery, organization management and ballot submission are intentionally unavailable in this preview. No credentials or votes are being collected.</p></div>
      </div>
    </div>
  </main>;
}
