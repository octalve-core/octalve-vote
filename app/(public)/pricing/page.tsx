import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Pricing" };
const plans = [
  { title: "Personal", description: "For small groups and communities", features: ["Election and candidate setup", "Voter register and invitations", "Ballot and turnout overview"], popular: false },
  { title: "Organizational", description: "For institutions and larger organizations", features: ["Multiple organizational elections", "Electoral-body workspace", "Branded election experience"], popular: true },
  { title: "Unlimited", description: "For larger and recurring election programmes", features: ["Expanded capacity planning", "Advanced oversight requirements", "Organization support options"], popular: false }
] as const;

export default function PricingPage() {
  return <main className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
    <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8"><span className="text-sm font-bold uppercase tracking-widest text-indigo-600">Plans & capacity</span><h1 className="mt-4 text-4xl font-extrabold md:text-5xl">Simple, transparent <span className="text-indigo-600">pricing</span></h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">These are plan categories from the original GoVotin concept. Prices, limits and payment methods are being revalidated before release.</p></section>
    <section className="mx-auto grid max-w-7xl gap-7 px-5 pb-16 md:grid-cols-3 md:px-8">
      {plans.map(plan => <article key={plan.title} className={"relative rounded-3xl border bg-white p-8 shadow-sm " + (plan.popular ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-100")}>
        {plan.popular && <span className="absolute -top-3 left-8 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white">POPULAR IN ORIGINAL DESIGN</span>}
        <h2 className="text-2xl font-bold">{plan.title}</h2><p className="mt-2 min-h-14 text-slate-600">{plan.description}</p><p className="mt-6 text-xl font-bold text-slate-800">Pricing under review</p>
        <ul className="mt-8 space-y-4">{plan.features.map(feature => <li key={feature} className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-indigo-600" />{feature}</li>)}</ul>
        <Link href="/contact" className="mt-9 block rounded-xl border border-indigo-200 px-5 py-3 text-center font-semibold text-indigo-700 hover:bg-indigo-50">Contact about plans</Link>
      </article>)}
    </section>
    <p className="mx-auto max-w-4xl px-5 pb-24 text-center text-sm leading-7 text-slate-600">Payments and subscriptions cannot be purchased in this preview. No guarantee of live features or financial terms is implied by these concept cards.</p>
  </main>;
}
