import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { CompanySearch } from "./search-client";
import { AccountScope } from "@/components/auth/account-scope";
import { readCompanyFlow, type CompanyFlowSearchParams } from "@/lib/company-flow";

export const metadata: Metadata = { title: "기존 회사 찾기", robots: noIndexRobots };

export default async function CompanySearchPage({ searchParams }: { searchParams: Promise<CompanyFlowSearchParams> }) {
  const flow = readCompanyFlow(await searchParams);
  return <AuthScreen><AccountScope><CompanySearch flow={flow} key={JSON.stringify(flow)} /></AccountScope></AuthScreen>;
}
