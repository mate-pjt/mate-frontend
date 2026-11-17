import type { Metadata } from "next";
import { MyTeamClient } from "@/components/my/my-team-client";
import { noIndexRobots } from "@/lib/metadata";
import { teamMembershipId, teamPageNumber } from "@/features/company/team";

export const metadata: Metadata = { title: "팀원 정보", description: "팀원의 정보와 회사 권한을 확인합니다.", robots: noIndexRobots };

export default async function TeamMemberPage({ params, searchParams }: { params: Promise<{ membershipId: string }>; searchParams: Promise<{ page?: string | string[] }> }) {
  const [route, query] = await Promise.all([params, searchParams]);
  return <MyTeamClient initialPage={teamPageNumber(query.page)} membershipId={teamMembershipId(route.membershipId)} />;
}
