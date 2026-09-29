import type { Metadata } from "next";
import Image from "next/image";
import { QnaAccordion } from "@/components/qna/qna-accordion";
import { RightArrowIcon, UpArrowIcon } from "@/components/icons";
import { getQnaItems } from "@/data/qna/server";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicPageMetadata({
  title: "자주 묻는 질문",
  description:
    "Mate 서비스와 맞춤 입찰공고, 공고 알림 이용 방법을 확인하세요.",
  path: "/qna",
});

export default async function QnaPage() {
  const qnaItems = await getQnaItems();

  return (
    <div
      className="min-h-[1024px] scroll-mt-14 pb-20 pt-[30px]"
      id="qna-top"
    >
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1180px] sm:w-[calc(100%-48px)]">
        <header className="p-2">
          <h1 className="type-heading-1 text-grayscale-900">
            자주 묻는 질문
          </h1>
          <p className="type-heading-10 mt-2.5 text-grayscale-600">
            공고 찾기부터 알림 설정까지, 원하는 답변을 바로 찾아보세요!
          </p>
        </header>

        <div className="mt-8">
          <QnaAccordion items={qnaItems} />
        </div>

        <aside className="mt-[50px] flex flex-col gap-4 rounded-2xl bg-primary-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              alt=""
              className="size-12 shrink-0"
              height={48}
              src="/icon/24dp/mate.svg"
              width={48}
            />
            <div className="min-w-0">
              <h2 className="type-heading-9 text-grayscale-800">
                여러분의 의견으로 새로워지는 메이트!
              </h2>
              <p className="type-body-3 text-grayscale-600">
                이용 중 불편했던 점이나 바라는 점을 알려주시면 빠르게 반영할게요!
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-grayscale-600">준비 중</span>
            <button
              className="inline-flex h-12 items-center gap-1 rounded-xl px-[18px] type-body-2 text-primary-700 opacity-60"
              disabled
              type="button"
            >
              의견 보내기 <RightArrowIcon aria-hidden className="size-5" />
            </button>
          </div>
        </aside>
      </div>

      <a
        aria-label="페이지 상단으로 이동"
        className="ml-auto mr-4 mt-6 flex size-12 items-center justify-center rounded-full bg-grayscale-800 text-basic-white hover:bg-grayscale-700 sm:fixed sm:bottom-12 sm:right-12 sm:z-20 sm:m-0 sm:size-16"
        href="#qna-top"
      >
        <UpArrowIcon className="size-6" />
      </a>
    </div>
  );
}
