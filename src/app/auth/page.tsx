import type { Metadata } from "next";
import Link from "next/link";
import { noIndexRobots } from "@/lib/metadata";

type AuthPageProps = {
  searchParams?: Promise<{
    mode?: string | string[];
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
            href="/auth?mode=login"
          >
            로그인
          </Link>
          <Link
            className={`rounded-md px-3 py-2 text-center text-sm font-semibold ${
              mode === "signup" ? "bg-surface" : "text-muted"
            }`}
            href="/auth?mode=signup"
          >
            회원가입
          </Link>
        </div>

        <form className="space-y-4">
          <label className="block text-sm font-medium">
            이메일
            <input
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              name="email"
              placeholder="name@example.com"
              type="email"
            />
          </label>
          <label className="block text-sm font-medium">
            비밀번호
            <input
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
              name="password"
              placeholder="비밀번호"
              type="password"
            />
          </label>
          {mode === "signup" ? (
            <label className="block text-sm font-medium">
              회사명
              <input
                className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
                name="company"
                placeholder="회사명"
                type="text"
              />
            </label>
          ) : null}
          <button
            className="h-11 w-full rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            type="button"
          >
            {mode === "signup" ? "회원가입" : "로그인"}
          </button>
        </form>
      </section>
    </div>
  );
}
