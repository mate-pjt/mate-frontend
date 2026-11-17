import type { Metadata } from "next";
import { MyTeamClient } from "@/components/my/my-team-client";
import { noIndexRobots } from "@/lib/metadata";
import { teamPageNumber } from "@/features/company/team";

export const metadata: Metadata = { title: "함께하는 팀원", description: "현재 회사의 팀원과 역할을 확인합니다.", robots: noIndexRobots };

export default async function MyTeamPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const query = await searchParams;
  return <MyTeamClient initialPage={teamPageNumber(query.page)} />;
}
