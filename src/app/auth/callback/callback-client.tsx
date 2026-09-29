"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, AuthError } from "@/components/auth/auth-screen";
import { completeGoogleSession, errorMessage } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";

export function CallbackClient({ errorCode, flowId, returnTo }: { errorCode: string | null; flowId: string | null; returnTo?: string }) {
  const router = useRouter();
  const { setAuthentication } = useAuthSession();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(
    errorCode ? "Google 로그인을 완료하지 못했습니다. 다시 시도해 주세요." :
    !flowId ? "로그인 정보를 확인할 수 없습니다. Google 로그인부터 다시 시도해 주세요." : null,
  );

  useEffect(() => {
    if (errorCode || !flowId || started.current) return;
    started.current = true;
    void completeGoogleSession(flowId)
      .then((authentication) => {
        setAuthentication(authentication);
        router.replace(sanitizeLocalNextPath(returnTo ?? "/"));
      })
      .catch((reason: unknown) => setError(errorMessage(reason)));
  }, [errorCode, flowId, returnTo, router, setAuthentication]);

  return (
    <AuthCard className="space-y-5 text-center">
      <h1 className="text-grayscale-800 type-heading-7">{error ? "로그인을 완료하지 못했어요" : "로그인하고 있어요"}</h1>
      {error ? <AuthError message={error} /> : <p className="text-grayscale-600 type-body-7">잠시만 기다려 주세요.</p>}
      {error ? <Link className="inline-block text-primary underline" href="/auth">로그인 다시 시도하기</Link> : null}
    </AuthCard>
  );
}
