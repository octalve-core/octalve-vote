import type { Metadata } from "next";
import Link from "next/link";
import { VerifyEmailForm } from "@/components/sections/auth/verify-email-form";

export const metadata: Metadata = { title: "Verify email", robots: { index: false, follow: false } };
export default async function VerifyEmailPage({ searchParams }: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams;
  return <main className="min-h-[60vh] bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-extrabold">Confirm your organization email</h1>
      {typeof token === "string" && token.length >= 32
        ? <VerifyEmailForm token={token}/>
        : <p role="alert" className="mt-5 text-sm text-red-700">The verification link is missing or invalid.</p>}
      <Link href="/electoral/login" className="mt-8 inline-block text-sm font-semibold text-green-700 hover:underline">
        Back to electoral sign in
      </Link>
    </section>
  </main>;
}
