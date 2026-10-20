import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 px-6 py-16 text-center text-white md:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 size-72 rounded-full bg-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 -left-20 size-80 rounded-full bg-white/10" />
      <div className="relative"><h2 className="text-3xl font-extrabold md:text-4xl">Ready to plan an election?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-indigo-100">Explore the intended electoral-body experience. Account registration and election publishing remain disabled until they pass review.</p>
        <Link href="/electoral/login" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-indigo-700 shadow-lg hover:bg-indigo-50">Explore electoral portal <ArrowRight className="size-5" /></Link>
      </div>
    </div>
  </section>;
}
