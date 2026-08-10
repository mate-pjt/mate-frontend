import type { Metadata } from "next";
import Link from "next/link";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";
import { noIndexRobots } from "@/lib/metadata";
import { MockAuthForm } from "./mock-auth-form";

type AuthPageProps = {
  searchParams?: Promise<{
    mode?: string | string[];
    next?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "회원가입 및 로그인",
  description: "Mate 회원가입 및 로그인 페이지입니다.",
  robots: noIndexRobots,
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = searchParams ? await searchParams : {};
  const rawMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const mode = rawMode === "signup" ? "signup" : "login";
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = sanitizeLocalNextPath(rawNext);
  const loginHref = `/auth?mode=login&next=${encodeURIComponent(nextPath)}`;
  const signupHref = `/auth?mode=signup&next=${encodeURIComponent(nextPath)}`;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-8 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <p className="text-sm font-semibold text-primary">Auth</p>
        <h1 className="text-3xl font-semibold">회원가입 및 로그인</h1>
        <p className="text-sm leading-6 text-muted">
          Figma 설계처럼 한 화면 안에서 로그인과 회원가입 모드를 전환하는
          구조입니다.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-md bg-surface-muted p-1">
          <Link
            className={`rounded-md px-3 py-2 text-center text-sm font-semibold ${
              mode === "login" ? "bg-surface" : "text-muted"
            }`}
            href={loginHref}
          >
            로그인
          </Link>
          <Link
            className={`rounded-md px-3 py-2 text-center text-sm font-semibold ${
              mode === "signup" ? "bg-surface" : "text-muted"
            }`}
            href={signupHref}
          >
            회원가입
          </Link>
        </div>

        <MockAuthForm mode={mode} nextPath={nextPath} />
      </section>
    </div>
  );
}
