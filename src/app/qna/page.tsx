import type { Metadata } from "next";
import { QnaAccordion } from "@/components/qna/qna-accordion";
import { UpArrowIcon } from "@/components/icons";
import { getQnaItems } from "@/data/qna/server";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicPageMetadata({
  title: "자주 묻는 질문",
  description:
    "Mate 서비스와 맞춤 입찰공고, 실시간 알림 이용 방법을 확인하세요.",
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
            공고 매칭부터 실시간 알림까지, 원하는 답변을 바로 찾아보세요!
          </p>
        </header>

        <div className="mt-8">
          <QnaAccordion items={qnaItems} />
        </div>
      </div>

      <a
        aria-label="페이지 상단으로 이동"
        className="fixed bottom-12 right-6 z-20 inline-flex size-16 items-center justify-center rounded-full bg-grayscale-800 text-basic-white hover:bg-grayscale-700 sm:right-12"
        href="#qna-top"
      >
        <UpArrowIcon className="size-6" />
      </a>
    </div>
  );
}
