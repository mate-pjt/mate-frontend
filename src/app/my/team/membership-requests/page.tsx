import type { Metadata } from "next";
import { TeamMembershipRequestsClient } from "@/components/my/team-membership-requests-client";
import { teamPageNumber } from "@/features/company/team";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "팀원 합류 신청", description: "현재 회사에 들어온 합류 신청을 검토합니다.", robots: noIndexRobots };
export default async function TeamMembershipRequestsPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const query = await searchParams;
  return <TeamMembershipRequestsClient initialPage={teamPageNumber(query.page)} />;
}
