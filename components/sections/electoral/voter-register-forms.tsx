"use client";

import { useActionState } from "react";
import { addSingleVoterAction, importVoterCsvAction } from "@/app/actions/voter-register";

const field = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-green-600";

export function VoterRegisterForms({ electionId }: { electionId: string }) {
  const [one, submitOne, onePending] = useActionState(addSingleVoterAction, { error: "", success: "" });
  const [csv, submitCsv, csvPending] = useActionState(importVoterCsvAction, { error: "", success: "" });
  return <section aria-label="Edit draft voter register" className="mt-8 grid gap-6 lg:grid-cols-2">
    <form action={submitOne} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Add a voter</h2>
      <input type="hidden" name="electionId" value={electionId}/>
      <label htmlFor="voter-name" className="mt-5 block text-sm font-semibold">Full name</label>
      <input id="voter-name" name="name" minLength={2} maxLength={120} required className={field}/>
      <label htmlFor="voter-email" className="mt-4 block text-sm font-semibold">Email address</label>
      <input id="voter-email" name="email" type="email" required className={field}/>
      <label htmlFor="voter-phone" className="mt-4 block text-sm font-semibold">Phone (optional)</label>
      <input id="voter-phone" name="phone" type="tel" maxLength={40} className={field}/>
      {one.error && <p role="alert" className="mt-3 text-sm text-red-700">{one.error}</p>}
      {one.success && <p role="status" className="mt-3 text-sm text-green-700">{one.success}</p>}
      <button disabled={onePending} className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-bold text-white disabled:opacity-50">
        {onePending ? "Saving..." : "Add voter to draft"}
      </button>
    </form>
    <form action={submitCsv} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Import voter CSV</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">Use exactly these headers: <code>name,email,phone</code>. Quoted commas are supported. Maximum 100 rows and 100 KB per upload.</p>
      <input type="hidden" name="electionId" value={electionId}/>
      <label htmlFor="voter-csv" className="mt-5 block text-sm font-semibold">Select CSV file</label>
      <input id="voter-csv" name="file" type="file" accept=".csv,text/csv" required
        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"/>
      {csv.error && <p role="alert" className="mt-4 text-sm text-red-700">{csv.error}</p>}
      {csv.success && <p role="status" className="mt-4 text-sm text-green-700">{csv.success}</p>}
      <button disabled={csvPending} className="mt-6 rounded-xl border border-green-600 px-6 py-3 font-bold text-green-700 hover:bg-green-50 disabled:opacity-50">
        {csvPending ? "Importing..." : "Import draft voters"}
      </button>
    </form>
  </section>;
}
