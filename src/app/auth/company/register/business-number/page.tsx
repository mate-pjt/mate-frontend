import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AccountScope } from "@/components/auth/account-scope";
import { noIndexRobots } from "@/lib/metadata";
import { BusinessNumberRegistration } from "./registration-client";
import { readCompanyFlow, type CompanyFlowSearchParams } from "@/lib/company-flow";

export const metadata: Metadata = { title: "사업자등록번호로 회사 등록", robots: noIndexRobots };

export default async function BusinessNumberRegistrationPage({ searchParams }: { searchParams: Promise<CompanyFlowSearchParams> }) {
  const flow = readCompanyFlow(await searchParams);
  return <AuthScreen><AccountScope><BusinessNumberRegistration flow={flow} key={String(flow.fromSettings)} /></AccountScope></AuthScreen>;
}
