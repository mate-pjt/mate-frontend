"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ButtonLink } from "./ui/button";
import { CloseIcon } from "./icons";
import { NotificationBell } from "./alarms/notification-bell";
import { errorMessage } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/bids", label: "입찰공고" },
  { href: "/qna", label: "자주 묻는 질문" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useAuthSession();
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    if (logoutBusy) return;
    setLogoutBusy(true);
    setLogoutError(null);
    try {
      await logout();
      router.refresh();
    } catch (reason) {
      setLogoutError(errorMessage(reason));
    } finally {
      setLogoutBusy(false);
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
            <span className="type-heading-9 text-primary">메이트</span>
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

        <div className="flex items-center gap-2">
          {logoutError ? <span className="max-w-48 text-danger type-body-7" role="alert">{logoutError}</span> : null}
          <NotificationBell />
          <div className="w-[1px] h-[12px] bg-border" />
          {state.status === "authenticated" ? (
            <>
              <Link
                aria-current={pathname === "/my" || pathname.startsWith("/my/") ? "page" : undefined}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-grayscale-700 hover:bg-grayscale-100"
                href="/my"
              >
                마이페이지
              </Link>
              <button
                className="rounded-lg px-3 py-2 text-sm font-semibold text-grayscale-700 hover:bg-grayscale-100"
                disabled={logoutBusy}
                onClick={() => void handleLogout()}
                type="button"
              >
                {logoutBusy ? "로그아웃 중..." : "로그아웃"}
              </button>
            </>
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
