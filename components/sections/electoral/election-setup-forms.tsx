"use client";

import { useActionState } from "react";
import { createCandidateAction, createPositionAction } from "@/app/actions/election-configuration";

const control = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600";
type PositionOption = { id: string; title: string };

export function PositionForm({ electionId }: { electionId: string }) {
  const [result, submit, pending] = useActionState(createPositionAction, { error: "", success: "" });
  return <form action={submit} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold">Add a position</h2>
    <input type="hidden" name="electionId" value={electionId}/>
    <label htmlFor="position-title" className="mt-4 block text-sm font-semibold">Position title</label>
    <input id="position-title" name="title" minLength={2} maxLength={100} required
      placeholder="President" className={control + " mt-2"}/>
    <label htmlFor="position-description" className="mt-4 block text-sm font-semibold">Description (optional)</label>
    <textarea id="position-description" name="description" maxLength={1000} rows={2} className={control + " mt-2"}/>
    {result.error && <p role="alert" className="mt-3 text-sm text-red-700">{result.error}</p>}
    {result.success && <p role="status" className="mt-3 text-sm text-green-700">{result.success}</p>}
    <button disabled={pending} className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-bold text-white disabled:opacity-50">
      {pending ? "Saving..." : "Add position"}
    </button>
    <p className="mt-3 text-xs text-slate-500">Single-choice position. No voting is enabled.</p>
  </form>;
}
export function CandidateForm({ electionId, positions }: { electionId: string; positions: PositionOption[] }) {
  const [result, submit, pending] = useActionState(createCandidateAction, { error: "", success: "" });
  if (!positions.length) return null;
  return <form action={submit} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold">Add a candidate</h2>
    <input type="hidden" name="electionId" value={electionId}/>
    <label htmlFor="candidate-position" className="mt-4 block text-sm font-semibold">Position</label>
    <select id="candidate-position" name="positionId" required className={control + " mt-2"}>
      {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
    </select>
    <label htmlFor="candidate-name" className="mt-4 block text-sm font-semibold">Candidate name</label>
    <input id="candidate-name" name="name" minLength={2} maxLength={120} required
      placeholder="Candidate full name" className={control + " mt-2"}/>
    <label htmlFor="candidate-manifesto" className="mt-4 block text-sm font-semibold">Manifesto (optional)</label>
    <textarea id="candidate-manifesto" name="manifesto" maxLength={2000} rows={3} className={control + " mt-2"}/>
    {result.error && <p role="alert" className="mt-3 text-sm text-red-700">{result.error}</p>}
    {result.success && <p role="status" className="mt-3 text-sm text-green-700">{result.success}</p>}
    <button disabled={pending} className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-bold text-white disabled:opacity-50">
      {pending ? "Saving..." : "Add candidate"}
    </button>
  </form>;
}
