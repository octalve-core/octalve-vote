import type { Metadata } from "next";
import { requireStaffRole } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { getOrganizationPaymentClaims } from "@/lib/payments/claims";
import { PaymentClaimForm } from "@/components/sections/payments/payment-claim-form";

export const metadata: Metadata = { title: "Payment review" };
export default async function ElectoralPaymentPage() {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const body = await getDb().electoralBody.findUnique({
    where: { id: account.electoralBodyId! },
    select: { name: true, emailVerifiedAt: true, paymentStatus: true }
  });
  const claims = await getOrganizationPaymentClaims(account.electoralBodyId!);
  const enabled = process.env.ENABLE_PAYMENT_REVIEW === "true";
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <h1 className="text-3xl font-extrabold">Payment review</h1>
    <p className="mt-3 text-slate-600">Organization payment status: <strong>{body?.paymentStatus ?? "UNPAID"}</strong></p>
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
      Bank references are self-reported claims. They are never converted to confirmed payments without an independently verified transaction record and a separate settlement system.
    </div>
    {enabled ? <PaymentClaimForm eligible={Boolean(body?.emailVerifiedAt)}/> :
      <p role="status" className="mt-7 rounded-xl bg-white p-6 text-amber-800">Payment claim intake is disabled.</p>}
    <section className="mt-10 rounded-2xl border border-slate-100 bg-white p-6">
      <h2 className="text-xl font-bold">Recent claims</h2>
      {claims.length ? <ul className="mt-5 divide-y divide-slate-100">{claims.map(item =>
        <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div><p className="font-semibold">{item.reference}</p>
          <p className="mt-1 text-sm text-slate-600">₦{(Number(item.amountKobo) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
          {item.reviewReason && <p className="mt-2 text-sm text-amber-800">{item.reviewReason}</p>}</div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{item.status.replaceAll("_", " ")}</span>
        </li>)}</ul> : <p className="mt-5 text-slate-500">No claims have been submitted.</p>}
    </section>
  </main>;
}
