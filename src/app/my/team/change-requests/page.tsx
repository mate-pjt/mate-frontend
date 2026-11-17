import type { Metadata } from "next";
import { TeamChangeRequestsClient } from "@/components/my/team-change-requests-client";
import type { TeamChangeStatus } from "@/data/company/contracts";
import { teamPageNumber } from "@/features/company/team";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "팀원 변경 요청", robots: noIndexRobots };
export default async function TeamChangeRequestsPage({ searchParams }: { searchParams: Promise<{ page?: string | string[]; scope?: string | string[]; status?: string | string[] }> }) {
  const q = await searchParams;
  const scope = q.scope === undefined || q.scope === "mine" ? "mine" : q.scope === "company" ? "company" : null;
  const status = q.status === undefined ? undefined : typeof q.status === "string" && ["PENDING", "APPLIED", "REJECTED", "CANCELED", "INVALIDATED"].includes(q.status) ? q.status as TeamChangeStatus : null;
  return <TeamChangeRequestsClient page={teamPageNumber(q.page)} scope={scope} status={status} />;
}
