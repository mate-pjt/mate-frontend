import type { Metadata } from "next";
import { TeamPositionsClient } from "@/components/my/team-positions-client";
import { teamPageNumber } from "@/features/company/team";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "직급 관리", description: "현재 회사의 직급을 확인하고 관리합니다.", robots: noIndexRobots };

export default async function CompanyPositionsPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const query = await searchParams;
  return <TeamPositionsClient returnPage={teamPageNumber(query.page)} />;
}
