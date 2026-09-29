import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { noIndexRobots } from "@/lib/metadata";
import { SignupForm } from "./signup-form";

type SignupPageProps = {
  searchParams?: Promise<{ returnTo?: string | string[]; flowId?: string | string[] }>;
};

export const metadata: Metadata = { title: "회원가입", robots: noIndexRobots };

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : {};
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const flowId = typeof params.flowId === "string" ? params.flowId || null : null;
  return (
    <AuthScreen>
      <SignupForm flowId={flowId} returnTo={returnTo} />
    </AuthScreen>
  );
}
