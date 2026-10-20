type TurnoutProps = { eligible: number; submitted: number };

/** Aggregate-only participation component. Never receives individual choices. */
export function TurnoutSection({ eligible, submitted }: TurnoutProps) {
  const percent = eligible > 0 ? Math.min(100, Math.round(submitted / eligible * 100)) : 0;
  return <section aria-label="Turnout progress" className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h2 className="text-base font-bold">Participation overview</h2>
        <p className="mt-1 text-sm text-slate-500">Submitted ballots compared with eligible voters</p></div>
      <span className="text-2xl font-extrabold text-green-700">{percent}%</span>
    </div>
    <div role="progressbar" aria-label="Ballot participation" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={percent} className="mt-5 h-3 overflow-hidden rounded-full bg-green-100">
      <div className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-500 transition-all"
        style={{ width: percent + "%" }} />
    </div>
    <p className="mt-3 text-xs text-slate-500">Aggregate participation only. Individual vote selections remain unavailable.</p>
  </section>;
}
