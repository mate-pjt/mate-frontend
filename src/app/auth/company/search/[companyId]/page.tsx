import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { MembershipApplication } from "./request-client";
import { AccountScope } from "@/components/auth/account-scope";
import { readCompanyFlow, type CompanyFlowSearchParams } from "@/lib/company-flow";

type PageProps = { params: Promise<{ companyId: string }>; searchParams: Promise<CompanyFlowSearchParams> };
export const metadata: Metadata = { title: "회사 통합 요청", robots: noIndexRobots };

export default async function MembershipApplicationPage({ params, searchParams }: PageProps) {
  const { companyId } = await params;
  if (!/^\d+$/.test(companyId) || !Number.isSafeInteger(Number(companyId)) || Number(companyId) <= 0) notFound();
  const flow = readCompanyFlow(await searchParams);
  return <AuthScreen><AccountScope><MembershipApplication companyId={Number(companyId)} flow={flow} key={`${companyId}:${JSON.stringify(flow)}`} /></AccountScope></AuthScreen>;
}
