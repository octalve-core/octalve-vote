import type { Metadata } from "next";
import Link from "next/link";
import { staffLogoutAction } from "@/app/actions/staff-auth";
import { requireStaffRole } from "@/lib/auth/session";
import { getPendingPaymentClaims } from "@/lib/payments/claims";
import { AdminPaymentReviewCard } from "@/components/sections/payments/admin-payment-review-card";

export const metadata: Metadata = { title: "Payment claims review" };
export default async function AdminPaymentsPage() {
  await requireStaffRole("PLATFORM_ADMIN");
  const enabled = process.env.ENABLE_PAYMENT_REVIEW === "true";
  const pending = enabled ? await getPendingPaymentClaims() : [];
  return <main className="mx-auto max-w-5xl px-5 py-12">
    <Link href="/admin" className="text-sm font-semibold text-indigo-700 hover:underline">← Organization reviews</Link>
    <div className="mt-6 flex items-center justify-between gap-4"><h1 className="text-3xl font-extrabold">Payment claims</h1>
      <form action={staffLogoutAction}><button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-700">Logout</button></form></div>
    <p className="mt-4 rounded-xl bg-amber-50 p-5 text-sm leading-7 text-amber-900">
      Review recorded bank-transfer claims only. No independent settlement gateway or bank validation is connected, so no claim can be marked PAID here.
    </p>
    {enabled ? <section className="mt-8 space-y-5" aria-label="Pending payment claims">
      {pending.map(item => <AdminPaymentReviewCard key={item.id} claim={{
        id: item.id, reference: item.reference, organization: item.electoralBody.name,
        amount: (Number(item.amountKobo) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 }),
        note: item.note
      }}/>)}
      {!pending.length && <p className="rounded-xl bg-white p-7 text-slate-500">No claims awaiting review.</p>}
    </section> : <p className="mt-8 rounded-xl bg-white p-7 text-amber-700">Payment review is disabled.</p>}
  </main>;
}
