import type { Metadata } from "next";
import { AuthCard, AuthScreen } from "@/components/auth/auth-screen";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";
import { noIndexRobots } from "@/lib/metadata";
import { LoginChoices } from "./login-choices";

type AuthPageProps = {
  searchParams?: Promise<{ next?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "로그인",
  description: "메이트 소셜 로그인 페이지입니다.",
  robots: noIndexRobots,
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = searchParams ? await searchParams : {};
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = sanitizeLocalNextPath(rawNext);

  return (
    <AuthScreen width="narrow">
      <h1 className="mb-6 text-center text-grayscale-800 type-heading-1">로그인</h1>
      <AuthCard>
        <LoginChoices nextPath={nextPath} />
      </AuthCard>
    </AuthScreen>
  );
}
