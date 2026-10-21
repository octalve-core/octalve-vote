import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <main className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
    <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8"><span className="text-sm font-bold uppercase tracking-widest text-indigo-600">Connect with us</span><h1 className="mt-5 text-4xl font-extrabold md:text-5xl">Let’s talk about your election</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">Whether you are evaluating a voting platform or reviewing an upcoming election, we are preparing a secure support and enquiry process.</p></section>
    <section className="mx-auto max-w-3xl px-5 pb-24 md:px-8"><div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm md:p-12"><span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><MessageCircle className="size-8" /></span>
      <h2 className="mt-6 text-2xl font-extrabold">Contact channel being configured</h2><p className="mx-auto mt-4 max-w-xl leading-8 text-slate-600">The original contact form sent email through Base44. That service is not part of the new Next.js deployment, so we have not published a form that could silently lose your message. Contact details will appear here after verification.</p><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Return home <ArrowRight className="size-4" /></Link>
    </div></section>
  </main>;
}
