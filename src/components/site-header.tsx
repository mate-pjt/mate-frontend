"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./ui/button";
import { CloseIcon } from "./icons";
import { NotificationBell } from "./alarms/notification-bell";
import { useAuthSession } from "@/features/auth/session";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/bids", label: "입찰공고" },
  { href: "/qna", label: "자주 묻는 질문" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { state, refresh } = useAuthSession();
  const [retryBusy, setRetryBusy] = useState(false);
  const nickname = state.status === "authenticated" ? state.authentication.account.nickname?.trim() : null;

  async function retrySession() {
    if (retryBusy) return;
    setRetryBusy(true);
    try {
      await refresh();
    } catch {
      // The session state keeps the retry action available after a failed refresh.
    } finally {
      setRetryBusy(false);
    }
  }

  if (pathname.startsWith("/auth")) {
    return (
      <header className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between px-4 sm:px-8 xl:px-[60px]">
        <Link className="flex items-center gap-2" href="/" aria-label="메이트 홈으로 이동">
          <Image src="/icon/mate-brand.svg" alt="" width={32} height={24} />
          <span className="type-heading-9 text-grayscale-800">메이트</span>
        </Link>
        <Link className="rounded-lg p-2 text-grayscale-800 hover:bg-primary-100" href="/" aria-label="가입 및 로그인 닫기">
          <CloseIcon aria-hidden className="h-8 w-8" />
        </Link>
      </header>
    );
  }

  return (
    <header className="bg-basic-white">
      <div className="mx-auto flex min-h-14 w-full flex-wrap items-center justify-between gap-4 px-4 py-2 sm:px-8 xl:h-14 xl:flex-nowrap xl:px-[60px] xl:py-0">
        <div className="flex min-w-0 flex-wrap items-center gap-x-10 gap-y-2">
          <Link className="flex items-center gap-[10px] px-2 py-[7px]" href="/">
            <Image className="h-6 w-8" src="/icon/mate-brand.svg" alt="Mate" width={32} height={24} />
            <span className="type-heading-9 text-grayscale-800">메이트</span>
          </Link>
          <nav aria-label="주요 메뉴" className="flex flex-wrap items-center">
            {navigationItems.map((item) => {
              const isCurrent =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  aria-current={isCurrent ? "page" : undefined}
                  className={`px-3.5 py-1.5 type-heading-9 transition-colors hover:text-grayscale-800 ${
                    isCurrent ? "text-grayscale-900" : "text-grayscale-500"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="ml-auto flex min-w-0 max-w-full flex-wrap items-center gap-2">
          <NotificationBell />
          <div aria-hidden className="h-3 w-px rounded-full bg-grayscale-200" />
          {state.status === "authenticated" ? (
            <>
              <Link
                aria-current={pathname === "/my" || pathname.startsWith("/my/") ? "page" : undefined}
                aria-label={nickname ? `${nickname}님, 설정 및 관리` : "설정 및 관리"}
                className="inline-flex min-w-0 items-center gap-2 rounded-lg text-grayscale-700 hover:bg-grayscale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                href="/my"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-grayscale-50 p-[3px]">
                  <Image src="/icon/24dp/ceo.svg" alt="" width={30} height={30} />
                </span>
                {nickname ? <span className="max-w-40 truncate type-heading-9 sm:max-w-64">{nickname}님</span> : null}
              </Link>
            </>
          ) : state.status === "loading" ? (
            <span className="type-body-7 text-grayscale-600" role="status">로그인 확인 중</span>
          ) : state.status === "error" ? (
            <div aria-busy={retryBusy} className="flex flex-wrap items-center gap-2 type-body-7">
              <span className="text-danger" role="alert">로그인 확인 실패</span>
              <button
                className="rounded text-primary underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                disabled={retryBusy}
                onClick={() => void retrySession()}
                type="button"
              >
                {retryBusy ? "다시 확인 중..." : "다시 시도하기"}
              </button>
            </div>
          ) : (
            <ButtonLink href="/auth?mode=login" variant="primary" size="sm">
              로그인 / 회원가입
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}
