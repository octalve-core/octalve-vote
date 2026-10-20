import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { requireStaffRole } from "@/lib/auth/session";
import { areApprovalsEnabled } from "@/lib/auth/config";
import { getPendingOrganizationReviews } from "@/lib/admin/reviews";
import { OrganizationReviewCard } from "@/components/sections/admin/organization-review-card";
import { staffLogoutAction } from "@/app/actions/staff-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Platform administration" };

export default async function AdminPage() {
  const account = await requireStaffRole("PLATFORM_ADMIN");
  const enabled = areApprovalsEnabled();
  const applications = enabled ? await getPendingOrganizationReviews() : [];
  return <main className="min-h-screen bg-slate-50 p-5 md:p-12">
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3"><ShieldCheck className="size-9 text-indigo-600" />
          <div><h1 className="text-3xl font-extrabold">Organization reviews</h1>
          <p className="mt-1 text-sm text-slate-600">Platform administrator · {account.email}</p></div>
        </div>
        <form action={staffLogoutAction}><button className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-indigo-700">Logout</button></form>
      </div>
      <p className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm leading-7 text-indigo-900">
        Every approval requires an MFA-verified administrator session, a verified organization email and an auditable reason.
        Payments are never approved or marked paid here.
      </p>
      {!enabled ? <p role="status" className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 font-semibold text-amber-900">
        Organization approvals are disabled in this environment.
      </p> : <section aria-label="Pending applications" className="mt-8 space-y-5">
        <h2 className="text-xl font-extrabold">Pending electoral bodies ({applications.length})</h2>
        {applications.length === 0 && <p className="rounded-xl bg-white p-8 text-slate-500">No pending applications.</p>}
        {applications.map(organization => <OrganizationReviewCard key={organization.id} organization={{
          id: organization.id, name: organization.name, contactPerson: organization.contactPerson,
          email: organization.email, emailVerified: Boolean(organization.emailVerifiedAt),
          paymentStatus: organization.paymentStatus, subscriptionType: organization.subscriptionType,
        }}/>)}
      </section>}
    </div>
  </main>;
}
