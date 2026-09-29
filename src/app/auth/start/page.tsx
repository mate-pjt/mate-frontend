import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { StartChoices } from "./start-choices";

type StartPageProps = { searchParams?: Promise<{ next?: string | string[] }> };
export const metadata: Metadata = { title: "메이트 시작하기", robots: noIndexRobots };

export default async function StartPage({ searchParams }: StartPageProps) {
  const params = searchParams ? await searchParams : {};
  const next = Array.isArray(params.next) ? params.next[0] : params.next;
  return <AuthScreen><StartChoices next={next} /></AuthScreen>;
}
