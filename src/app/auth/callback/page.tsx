import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { CallbackClient } from "./callback-client";

type CallbackPageProps = {
  searchParams?: Promise<{ returnTo?: string | string[]; error?: string | string[]; flowId?: string | string[] }>;
};

export const metadata: Metadata = { title: "로그인 처리", robots: noIndexRobots };

export default async function CallbackPage({ searchParams }: CallbackPageProps) {
  const params = searchParams ? await searchParams : {};
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const flowId = typeof params.flowId === "string" ? params.flowId || null : null;

  return (
    <AuthScreen width="narrow">
      <CallbackClient errorCode={error ?? null} flowId={flowId} returnTo={returnTo} />
    </AuthScreen>
  );
}
