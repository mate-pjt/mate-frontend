import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AccountScope } from "@/components/auth/account-scope";
import { noIndexRobots } from "@/lib/metadata";
import { DocumentRegistration } from "./registration-client";
import { readCompanyFlow, type CompanyFlowSearchParams } from "@/lib/company-flow";

export const metadata: Metadata = { title: "증명서로 회사 등록", robots: noIndexRobots };

export default async function DocumentRegistrationPage({ searchParams }: { searchParams: Promise<CompanyFlowSearchParams> }) {
  const flow = readCompanyFlow(await searchParams);
  return <AuthScreen><AccountScope><DocumentRegistration flow={flow} key={String(flow.fromSettings)} /></AccountScope></AuthScreen>;
}
