import type { Metadata } from "next";
import { requireStaffRole } from "@/lib/auth/session";
import { getElectoralOverview } from "@/lib/electoral/overview";
import { DashboardOverview } from "@/components/sections/electoral/dashboard-overview";

export const metadata: Metadata = { title: "Electoral dashboard" };

export default async function ElectoralDashboard({ searchParams }: { searchParams: Promise<{ election?: string }> }) {
  const account = await requireStaffRole("ELECTORAL_ADMIN");
  const body = account.electoralBody;
  if (!body) return null;
  const query = await searchParams;
  const overview = await getElectoralOverview(body.id, query.election);
  return <DashboardOverview
    organization={body.name}
    accountStatus={body.status}
    paymentStatus={body.paymentStatus}
    elections={overview.elections.map(e => ({ id: e.id, title: e.title, status: e.status }))}
    selectedId={overview.selected?.id ?? null}
    totalElections={overview.totalElections}
    activeElections={overview.activeElections}
    voterCount={overview.voterCount}
    submittedBallots={overview.submittedBallots}
    inProgressBallots={overview.inProgressBallots}
  />;
}
