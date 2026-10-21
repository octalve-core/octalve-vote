import type { LucideIcon } from "lucide-react";

export function StatCard({ title, value, icon: Icon, tint }: { title: string; value: number; icon: LucideIcon; tint: "green" | "purple" | "indigo" | "amber" }) {
  const classes = {
    green: "bg-green-100 text-green-700", purple: "bg-purple-100 text-purple-700",
    indigo: "bg-indigo-100 text-indigo-700", amber: "bg-amber-100 text-amber-700"
  };
  return <article className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div><p className="text-sm font-semibold text-slate-500">{title}</p><p className="mt-2 text-3xl font-extrabold text-slate-900">{value.toLocaleString()}</p></div>
    <span className={"flex size-12 items-center justify-center rounded-xl " + classes[tint]}><Icon aria-hidden="true" className="size-6" /></span>
  </article>;
}
