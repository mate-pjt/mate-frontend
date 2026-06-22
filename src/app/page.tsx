import type { Metadata } from "next";
import Link from "next/link";
import { mockBids } from "@/mocks/bids";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Mate - 입찰공고 탐색",
  description:
    "Mate에서 공공 및 민간 입찰공고를 탐색하고 관심 공고를 빠르게 확인하세요.",
  path: "/",
});

export default function HomePage() {
  const featuredBids = mockBids.slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10 sm:py-14">
      <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-primary">MVP Frontend</p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              입찰공고를 찾고 비교하는 Mate 웹 프론트엔드
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
              현재는 Figma 디자인 적용 전 단계의 서버 렌더링 placeholder입니다.
              공개 페이지는 SEO metadata를 먼저 갖춘 구조로 시작합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground"
              href="/bids"
            >
              입찰공고 보기
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-semibold"
              href="/qna"
            >
              자주 묻는 질문
            </Link>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold text-muted">초기 라우트</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted">공개</dt>
              <dd className="mt-1 font-semibold">home, bids, qna</dd>
            </div>
            <div>
              <dt className="text-muted">개인화</dt>
              <dd className="mt-1 font-semibold">my, alarms, auth</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">추천 입찰공고</h2>
            <p className="mt-1 text-sm text-muted">mock 데이터 기반 preview</p>
          </div>
          <Link className="text-sm font-semibold text-primary" href="/bids">
            전체 보기
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredBids.map((bid) => (
            <Link
              className="rounded-lg border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
              href={`/bids/${bid.id}`}
              key={bid.id}
            >
              <p className="text-xs font-semibold text-accent">
                {bid.organization}
              </p>
              <h3 className="mt-3 line-clamp-2 text-lg font-semibold">
                {bid.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {bid.summary}
              </p>
              <p className="mt-4 text-sm font-medium">
                마감일 {bid.closesAt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
