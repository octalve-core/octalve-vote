import Link from "next/link";

type ElectionListItem = {
  id: string;
  title: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED";
};

/** Only receives elections from the signed-in organization's scoped query. */
export function RecentElectionsSection({ elections }: { elections: ElectionListItem[] }) {
  if (!elections.length) return null;
  return <section aria-label="Recent elections" className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-bold">Recent elections</h2>
      <Link href="/electoral/elections" className="text-sm font-semibold text-green-700 hover:underline">View all</Link>
    </div>
    <ul className="mt-5 divide-y divide-slate-100">
      {elections.slice(0, 5).map(election => <li key={election.id}
        className="flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href={`/electoral/elections/${encodeURIComponent(election.id)}`} className="font-medium text-slate-800 hover:text-green-700 hover:underline">{election.title}</Link>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">
          {election.status.toLowerCase()}
        </span>
      </li>)}
    </ul>
  </section>;
}
