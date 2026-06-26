import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "./ui/button";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/bids", label: "입찰공고" },
  { href: "/qna", label: "자주 묻는 질문" },
  { href: "/alarms", label: "알람" },
  { href: "/my", label: "마이" },
];


export function SiteHeader() {
  return (
    <header className="">
      <div className="mx-auto flex w-full min-h-[56px] flex-wrap items-center justify-between gap-4 px-15 py-[9px]">
        {/* 헤더 왼쪽 */}
        <div className="flex items-center gap-10">
          <Link className="flex items-center gap-1" href="/">
            <Image src="/icon/24dp/mate.svg" alt="Mate" width={30} height={30} />
            <span className="type-heading-9 text-primary">메이트</span>
          </Link>
          <nav aria-label="주요 메뉴" className="flex flex-wrap items-center gap-[10px]">
            {navigationItems.map((item) => (
              <Link
                className="px-[14px] py-[6px] type-heading-9 text-grayscale-500"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 헤더 오른쪽 */}
        <div className="flex items-center gap-2 color-grayscale-200">
          <Link href="/alarms" aria-label="알람 페이지로 이동" className="">
            <Image src="/icon/24dp/alarm.svg" alt="알람" width={32} height={32} />
          </Link>
          <div className="w-[1px] h-[12px] bg-border" />
          <ButtonLink href="/auth?mode=login" variant="primary" size="sm">
            로그인
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
