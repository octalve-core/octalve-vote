import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "About" };
const values = [
  { icon: ShieldCheck, title: "Security first", description: "Security is a release requirement, not a marketing assertion: permissions, ballot integrity and auditability must be tested." },
  { icon: Eye, title: "Transparency", description: "Clear election rules, verifiable aggregates and controlled publication of results." },
  { icon: HeartHandshake, title: "Accessibility", description: "Simple language and responsive layouts for eligible voters across devices." },
  { icon: Sparkles, title: "Innovation", description: "Careful improvements to the original GoVotin experience, backed by production evidence." }
] as const;

export default function AboutPage() {
  return <main className="bg-gradient-to-br from-slate-50 via-indigo-50/25 to-purple-50/40">
    <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8 md:py-28">
      <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">Who we are</span>
      <h1 className="mt-5 text-4xl font-extrabold md:text-6xl">About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Octalve Vote</span></h1>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">We are building on the original GoVotin concept to make digital elections clear, accessible and dependable for organizations across Africa and beyond.</p>
    </section>
    <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8"><div className="rounded-3xl bg-white p-9 shadow-sm md:p-14">
      <h2 className="text-3xl font-extrabold">Our mission</h2><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">Every eligible voter deserves a straightforward experience. Every electoral body deserves reliable tools and meaningful oversight. Our mission is to build both, without compromising ballot confidentiality or democratic trust.</p>
    </div></section>
    <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
      <div className="mb-10 text-center"><h2 className="text-3xl font-extrabold">Principles that guide us</h2><p className="mt-3 text-slate-600">Product commitments we will verify before live elections.</p></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{values.map(({ icon: Icon, title, description }) => <article className="rounded-3xl bg-white p-8 shadow-sm" key={title}><Icon className="size-8 text-indigo-600" /><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p></article>)}</div>
    </section>
    <section className="mx-auto max-w-7xl px-5 pb-24 text-center md:px-8"><h2 className="text-3xl font-extrabold">Organizing an election?</h2><p className="mx-auto mt-3 max-w-2xl text-slate-600">Learn how Octalve Vote is shaping the experience for electoral teams.</p><Link href="/electoral/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Explore the portal <ArrowRight className="size-4" /></Link></section>
  </main>;
}
