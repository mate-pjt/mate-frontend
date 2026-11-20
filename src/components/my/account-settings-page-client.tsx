"use client";

import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";

import { RightArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { readContactEmail } from "@/features/auth/contact-email";
import { useAuthSession } from "@/features/auth/session";

function useSessionExpired(expiresAt: number) {
  const subscribe = useCallback((onChange: () => void) => {
    if (!expiresAt) return () => {};

    const remaining = expiresAt - Date.now();
    const timer = remaining > 0 ? window.setTimeout(onChange, remaining) : undefined;
    document.addEventListener("visibilitychange", onChange);
    window.addEventListener("pageshow", onChange);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onChange);
      window.removeEventListener("pageshow", onChange);
    };
  }, [expiresAt]);
  const hasExpired = useCallback(() => expiresAt > 0 && Date.now() >= expiresAt, [expiresAt]);

  return useSyncExternalStore(subscribe, hasExpired, () => false);
}

function AccountDetails() {
  const { state, refresh, subscribe, getAccountKey } = useAuthSession();
  const accountKey = useSyncExternalStore(subscribe, getAccountKey, () => null);
  const expired = useSessionExpired(state.expiresAt);
  const [retrying, setRetrying] = useState(false);

  function retrySession() {
    setRetrying(true);
    void refresh().catch(() => undefined).finally(() => setRetrying(false));
  }

  const retryButton = (
    <Button disabled={retrying} onClick={retrySession} variant="outline">
      {retrying ? "확인 중..." : "다시 확인하기"}
    </Button>
  );

  if (state.status === "anonymous") {
    return (
      <div className="flex flex-col items-start gap-3 py-4">
        <p className="type-body-3 text-grayscale-700">로그인하면 이메일 주소를 확인할 수 있어요.</p>
        <ButtonLink href="/auth?mode=login&next=%2Fmy%2Fsettings%2Faccount">로그인하고 돌아오기</ButtonLink>
      </div>
    );
  }

  if (state.status === "error" || expired) {
    return (
      <div className="flex flex-col items-start gap-3 py-4">
        {state.status === "error" ? (
          <p className="type-body-3 text-grayscale-700" role="alert">로그인 상태를 확인하지 못했어요.</p>
        ) : (
          <p className="type-body-3 text-grayscale-700" role="status">로그인 상태를 다시 확인해 주세요.</p>
        )}
        {retryButton}
      </div>
    );
  }

  if (state.status !== "authenticated" || accountKey !== String(state.authentication.account.id)) {
    return <p className="py-4 type-body-3 text-grayscale-700" role="status">로그인 상태를 확인하고 있어요.</p>;
  }

  const email = readContactEmail(state.authentication.account.email);
  return (
    <dl className="flex min-w-0 flex-col gap-2 py-4">
      <dt className="type-body-1 text-grayscale-800">이메일 주소</dt>
      <dd className="flex min-w-0 flex-col items-start gap-3 type-body-6 text-grayscale-700">
        {email.status === "available" && <span className="max-w-full [overflow-wrap:anywhere]">{email.address}</span>}
        {email.status === "missing" && <span>등록된 이메일 주소가 없어요.</span>}
        {email.status === "invalid" && (
          <>
            <span role="alert">이메일 주소를 확인하지 못했어요.</span>
            {retryButton}
          </>
        )}
      </dd>
    </dl>
  );
}

export function AccountSettingsPageClient() {
  return (
    <section aria-labelledby="account-settings-title" className="flex-1 bg-grayscale-50 px-4 pb-24 pt-[30px] sm:px-6">
      <div className="mx-auto w-full max-w-[1180px]">
        <nav aria-label="현재 위치" className="mb-4 flex flex-wrap items-center gap-1 type-body-3 text-grayscale-700">
          <Link className="rounded hover:text-grayscale-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="/my">마이페이지</Link>
          <RightArrowIcon aria-hidden className="size-4 shrink-0" />
          <span aria-current="page" className="type-body-1">계정 관리</span>
        </nav>

        <div className="flex min-w-0 flex-col gap-6 rounded-[20px] bg-basic-white p-6 shadow-[var(--shadow-popover)]">
          <h1 className="type-heading-9 text-grayscale-800" id="account-settings-title">계정 관리</h1>
          <AccountDetails />
        </div>
      </div>
    </section>
  );
}
