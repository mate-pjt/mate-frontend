import Image from "next/image";
import Link from "next/link";
import { UpArrowIcon } from "@/components/icons";

const linkClassName = "rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-basic-white";
const dividerClassName = "hidden h-2 w-px shrink-0 rounded-full bg-grayscale-200 sm:block";

export function HomeFooter() {
  return (
    <footer className="min-h-[284px] bg-grayscale-900 px-4 py-[50px] text-center text-grayscale-300 sm:px-6">
      <div className="mx-auto flex max-w-[453px] flex-col items-center gap-[30px]">
        <div className="flex size-12 items-center justify-center">
          <Image alt="" height={28} src="/images/home/footer-mate-mark.svg" width={36} />
        </div>

        <div className="type-body-7 flex w-full flex-col items-center gap-4">
          <nav aria-label="푸터 링크" className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            <Link
              aria-describedby="home-footer-new-tab"
              className={linkClassName}
              href="/auth/legal/terms"
              prefetch={false}
              rel="noopener noreferrer"
              target="_blank"
            >
              서비스 이용약관
            </Link>
            <span aria-hidden className={dividerClassName} />
            <Link
              aria-describedby="home-footer-new-tab"
              className={linkClassName}
              href="/auth/legal/privacy"
              prefetch={false}
              rel="noopener noreferrer"
              target="_blank"
            >
              개인정보처리방침
            </Link>
            <span aria-hidden className={dividerClassName} />
            <Link className={linkClassName} href="/qna">
              자주 묻는 질문
            </Link>
          </nav>
          <span className="sr-only" id="home-footer-new-tab">새 탭에서 열기</span>

          <p className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            <span>고객문의</span>
            <span aria-hidden className={dividerClassName} />
            <span className="type-body-6 text-basic-white">team.matespace@gmail.com</span>
            <span className="type-caption-2">(평일 10:00 ~ 18:00 / 주말 · 공휴일 휴무)</span>
          </p>
        </div>

        <p className="type-body-5 text-basic-white">© 2026 Mate. All rights reserved.</p>
      </div>

      <a
        aria-label="페이지 상단으로 이동"
        className="ml-auto mt-6 flex size-12 items-center justify-center rounded-full bg-grayscale-800 text-basic-white hover:bg-grayscale-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-basic-white md:fixed md:bottom-12 md:right-12 md:z-20 md:mt-0 md:size-16"
        href="#home-top"
      >
        <UpArrowIcon aria-hidden className="size-6" />
      </a>
    </footer>
  );
}
