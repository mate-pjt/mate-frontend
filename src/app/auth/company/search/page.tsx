import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { CompanySearch } from "./search-client";

export const metadata: Metadata = { title: "기존 회사 찾기", robots: noIndexRobots };

export default async function CompanySearchPage({ searchParams }: { searchParams?: Promise<{ query?: string | string[] }> }) {
  const params = searchParams ? await searchParams : {};
  const initialQuery = Array.isArray(params.query) ? params.query[0] : params.query;
  return <AuthScreen><CompanySearch initialQuery={initialQuery?.slice(0, 100) ?? ""} /></AuthScreen>;
}
