"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthSession } from "@/features/auth/session";
import { AuthCard, AuthError } from "./auth-screen";

export function AuthGate({ children, nextPath }: { children: React.ReactNode; nextPath?: string }) {
  const pathname = usePathname();
  const { state, refresh } = useAuthSession();

  if (state.status === "authenticated") return children;

  return (
    <AuthCard className="space-y-4">
      {state.status === "loading" ? <p>로그인 상태를 확인하고 있어요.</p> : null}
      {state.status === "error" ? (
        <>
          <AuthError message="로그인 상태를 확인하지 못했습니다." />
          <button className="text-primary underline" onClick={() => void refresh().catch(() => undefined)} type="button">다시 시도하기</button>
        </>
      ) : null}
      {state.status === "anonymous" ? (
        <>
          <AuthError message="로그인이 필요합니다." />
          <Link className="text-primary underline" href={`/auth?next=${encodeURIComponent(nextPath ?? pathname)}`}>로그인하기</Link>
        </>
      ) : null}
    </AuthCard>
  );
}
