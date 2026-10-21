import { BarChart3, CheckCircle2, LockKeyhole, ShieldCheck, Users, Vote } from "lucide-react";

const features = [
  { icon: LockKeyhole, title: "OTP authentication", description: "A planned one-time-code entry flow for eligible voters, with server-side verification and retry controls." },
  { icon: Vote, title: "Intuitive ballot", description: "A position-by-position experience for reviewing candidates and confirming choices." },
  { icon: BarChart3, title: "Election results", description: "Participation monitoring, tally reconciliation and controlled publication after certification." },
  { icon: Users, title: "Voter management", description: "Election-specific registers, invitations and carefully validated bulk uploads." },
  { icon: CheckCircle2, title: "Clear confirmation", description: "A final confirmation that records participation without disclosing a secret ballot." },
  { icon: ShieldCheck, title: "Accountable oversight", description: "Distinct role permissions and an operational audit trail without access to private selections." },
] as const;

export function FeaturesSection() {
  return <section id="features" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
    <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-sm font-bold uppercase tracking-widest text-indigo-600">Why Octalve Vote</span><h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">Everything you need for a well-run election</h2><p className="mt-4 text-lg text-slate-600">The original GoVotin concepts, being rebuilt with proper access controls and a reliable voting authority.</p></div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon className="size-7" aria-hidden="true" /></span><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p></article>)}</div>
  </section>;
}
