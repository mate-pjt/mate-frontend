import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { MembershipApplication } from "./request-client";

type PageProps = { params: Promise<{ companyId: string }> };
export const metadata: Metadata = { title: "회사 통합 요청", robots: noIndexRobots };

export default async function MembershipApplicationPage({ params }: PageProps) {
  const { companyId } = await params;
  if (!/^\d+$/.test(companyId) || !Number.isSafeInteger(Number(companyId))) notFound();
  return <AuthScreen><MembershipApplication companyId={Number(companyId)} /></AuthScreen>;
}
