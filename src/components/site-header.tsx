"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./ui/button";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/bids", label: "입찰공고" },
  { href: "/qna", label: "자주 묻는 질문" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

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
          <Link href="/alarms" aria-label="알람 페이지로 이동">
            <Image src="/icon/24dp/alarm.svg" alt="알람" width={32} height={32} />
          </Link>
          <div className="w-[1px] h-[12px] bg-border" />
          <ButtonLink href="/auth?mode=login" variant="primary" size="sm">
            로그인 / 회원가입
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
