import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBidDetail } from "@/data/bids/server";
import { createPublicPageMetadata } from "@/lib/metadata";
import type { BidStatus } from "@/types/bid";

type BidDetailPageProps = {
  params: Promise<{
    bidId: string;
  }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: BidDetailPageProps): Promise<Metadata> {
  const { bidId } = await params;
  const bid = await getBidDetail(bidId);

  if (!bid) {
    return createPublicPageMetadata({
      title: "입찰공고를 찾을 수 없습니다",
      description: "요청한 입찰공고 상세 정보를 찾을 수 없습니다.",
      path: `/bids/${bidId}`,
    });
  }

  return createPublicPageMetadata({
    title: bid.title,
    description: `${bid.organization}의 ${bid.category} 입찰공고입니다. ${bid.summary}`,
    path: `/bids/${bid.id}`,
  });
}

const statusLabel: Record<BidStatus, string> = {
  open: "접수중",
  "closing-soon": "마감임박",
  closed: "마감",
};

const currencyFormatter = new Intl.NumberFormat("ko-KR");

export default async function BidDetailPage({ params }: BidDetailPageProps) {
  const { bidId } = await params;
  const bid = await getBidDetail(bidId);

  if (!bid) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link className="text-sm font-semibold text-primary" href="/bids">
        입찰공고 목록으로
      </Link>

      <header className="mt-6 border-b border-border pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-md bg-surface-muted px-2 py-1 font-semibold">
            {statusLabel[bid.status]}
          </span>
          <span className="text-muted">{bid.category}</span>
          <span className="text-muted">{bid.region}</span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight">{bid.title}</h1>
        <p className="mt-4 text-base leading-7 text-muted">{bid.summary}</p>
      </header>

      <dl className="mt-8 grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">발주기관</dt>
          <dd className="mt-1 font-semibold">{bid.organization}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">사업예산</dt>
          <dd className="mt-1 font-semibold">
            {currencyFormatter.format(bid.budget)}원
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">공고일</dt>
          <dd className="mt-1 font-semibold">{bid.publishedAt}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">마감일</dt>
          <dd className="mt-1 font-semibold">{bid.closesAt}</dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">태그</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {bid.tags.map((tag) => (
            <span
              className="rounded-md border border-border bg-surface px-3 py-1 text-sm"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
