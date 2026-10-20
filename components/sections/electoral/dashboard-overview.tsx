import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, Plus, RefreshCcw, Users, Vote } from "lucide-react";
import { StatCard } from "./stat-card";

type ElectionSummary = {
  id: string; title: string; status: "DRAFT" | "ACTIVE" | "CLOSED";
};

export type DashboardOverviewProps = {
  organization: string;
  accountStatus: "PENDING" | "APPROVED" | "SUSPENDED";
  paymentStatus: "UNPAID" | "PENDING_VERIFICATION" | "PAID";
  elections: ElectionSummary[];
  selectedId: string | null;
  totalElections: number;
  activeElections: number;
  voterCount: number;
  submittedBallots: number;
  inProgressBallots: number;
};

export function DashboardOverview(props: DashboardOverviewProps) {
  const selected = props.elections.find(e => e.id === props.selectedId);
  const isApproved = props.accountStatus === "APPROVED" && props.paymentStatus === "PAID";

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    {!isApproved && <div role="status" className="mb-6 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <Clock className="size-6 shrink-0 text-amber-700" />
      <div><h2 className="font-bold text-amber-900">Organization approval pending</h2>
      <p className="mt-1 text-sm leading-6 text-amber-800">Your account or payment is not yet independently approved. You can review the dashboard, but election creation, voter import and publishing remain unavailable.</p></div>
    </div>}
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><h1 className="text-3xl font-bold text-slate-900">Dashboard</h1><p className="mt-1 text-slate-500">Monitor your elections in one place</p></div>
      <div className="flex flex-wrap items-center gap-2">
        {props.elections.length > 0 && <form method="get" action="/electoral/dashboard" className="flex items-center gap-2">
          <label htmlFor="election" className="sr-only">Select election</label>
          <select id="election" name="election" defaultValue={props.selectedId ?? ""} className="min-w-40 max-w-64 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            {props.elections.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <button className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-green-700 ring-1 ring-green-200 hover:bg-green-50">Apply</button>
        </form>}
        <Link href={props.selectedId ? "/electoral/dashboard?election=" + encodeURIComponent(props.selectedId) : "/electoral/dashboard"} aria-label="Refresh dashboard" className="rounded-xl border border-slate-200 bg-white p-3 text-slate-700 hover:bg-slate-50"><RefreshCcw className="size-5" /></Link>
        <span aria-disabled="true" className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-5 py-3 text-sm font-semibold text-green-700 opacity-70"><Plus className="size-4" /> New election (coming soon)</span>
      </div>
    </div>
    {selected && <section aria-label="Participation snapshot" className="mb-7 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-bold">{selected.title}</h2><p className="mt-1 text-sm text-slate-500">Current participation snapshot — refreshed when you navigate or select an election</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">{selected.status.toLowerCase()}</span></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div><span className="text-sm text-slate-500">Eligible voters</span><p className="mt-1 text-2xl font-bold">{props.voterCount.toLocaleString()}</p></div>
        <div><span className="text-sm text-slate-500">Ballots submitted</span><p className="mt-1 text-2xl font-bold">{props.submittedBallots.toLocaleString()}</p></div>
        <div><span className="text-sm text-slate-500">Draft ballots</span><p className="mt-1 text-2xl font-bold">{props.inProgressBallots.toLocaleString()}</p></div>
      </div>
    </section>}
    <section aria-label="Election statistics" className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Elections" value={props.totalElections} icon={Vote} tint="green" />
      <StatCard title="Active Elections" value={props.activeElections} icon={CheckCircle2} tint="purple" />
      <StatCard title="Total Voters" value={props.voterCount} icon={Users} tint="indigo" />
      <StatCard title="Votes Cast" value={props.submittedBallots} icon={Vote} tint="amber" />
    </section>
    <section className="rounded-2xl border border-slate-100 bg-white p-9 text-center shadow-sm">
      {props.elections.length === 0
        ? <><Vote className="mx-auto size-14 text-slate-300" /><h2 className="mt-4 text-xl font-bold">No Elections Yet</h2><p className="mt-2 text-slate-500">Your organization has no elections on record. Election creation is reserved for a later, tested batch.</p></>
        : <><AlertCircle className="mx-auto size-12 text-green-600" /><h2 className="mt-4 text-xl font-bold">Results charts awaiting voting-authority migration</h2><p className="mx-auto mt-2 max-w-xl text-slate-500">The original dashboard displays candidate-level results here. We have preserved the section while keeping raw vote queries disabled until certification and ballot privacy checks are implemented.</p></>}
    </section>
  </main>;
}
