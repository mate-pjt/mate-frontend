import type { Metadata } from "next";
import { TeamChangeRequestsClient } from "@/components/my/team-change-requests-client";
import { teamMembershipId } from "@/features/company/team";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "팀원 변경 요청 상세", robots: noIndexRobots };
export default async function TeamChangeRequestPage({ params }: { params: Promise<{ changeRequestId: string }> }) {
  const route = await params;
  return <TeamChangeRequestsClient page={1} scope="mine" requestId={teamMembershipId(route.changeRequestId)} />;
}
