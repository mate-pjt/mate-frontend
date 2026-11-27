import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AccountScope } from "@/components/auth/account-scope";
import { noIndexRobots } from "@/lib/metadata";
import { BusinessNumberRegistration } from "./registration-client";
import { readCompanyFlow, type CompanyFlowSearchParams } from "@/lib/company-flow";

export const metadata: Metadata = { title: "사업자등록번호로 회사 등록", robots: noIndexRobots };

export default async function BusinessNumberRegistrationPage({ searchParams }: { searchParams: Promise<CompanyFlowSearchParams> }) {
  const flow = readCompanyFlow(await searchParams);
  const registration = <AccountScope><BusinessNumberRegistration flow={flow} key={String(flow.fromSettings)} /></AccountScope>;

  if (flow.fromSettings) {
    return (
      <div className="mx-auto w-full max-w-[642px] px-4 py-10 sm:px-6 sm:pt-16 lg:pt-[clamp(4rem,calc(100dvh-48rem),142px)]">
        {registration}
      </div>
    );
  }
  return <AuthScreen>{registration}</AuthScreen>;
}
