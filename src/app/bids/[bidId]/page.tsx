import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BidDetailContent } from "@/components/bids/bid-detail-content";
import type { BidDetailQuery } from "@/data/bids/contracts";
import { getBidDetail } from "@/data/bids/server";
import { createPublicPageMetadata } from "@/lib/metadata";

type BidDetailPageProps = {
  params: Promise<{ bidId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: BidDetailPageProps): Promise<Metadata> {
  const query = await readQuery(params, searchParams);
  const detail = await getBidDetail(query);
  if (!detail) {
    return createPublicPageMetadata({
      title: "입찰공고를 찾을 수 없습니다",
      description: "요청한 입찰공고 상세 정보를 찾을 수 없습니다.",
      path: `/bids/${query.id}`,
    });
  }

  return createPublicPageMetadata({
    title: detail.bid.title,
    description: `${detail.bid.agencies.demandName ?? detail.bid.agencies.noticeName ?? "Mate"}의 입찰공고 상세 정보입니다.`,
    path: `/bids/${query.id}`,
  });
}

export default async function BidDetailPage({ params, searchParams }: BidDetailPageProps) {
  const query = await readQuery(params, searchParams);
  const detail = await getBidDetail(query);
  if (!detail) notFound();
  return <BidDetailContent data={detail} itemPage={query.itemPage} participantsPage={query.participantsPage} />;
}

async function readQuery(params: BidDetailPageProps["params"], searchParams: BidDetailPageProps["searchParams"]): Promise<BidDetailQuery> {
  const [{ bidId }, values] = await Promise.all([params, searchParams]);
  const rawClass = first(values.bidClsfcNo)?.trim();
  const rawResult = first(values.resultId)?.trim();
  return {
    id: bidId,
    classificationNo: rawClass && rawClass.length <= 50 ? rawClass : null,
    itemPage: pageNumber(first(values.itemPage)),
    resultId: rawResult && /^[1-9]\d*$/.test(rawResult) ? rawResult : null,
    participantsPage: pageNumber(first(values.participantsPage)),
  };
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function pageNumber(raw: string | undefined): number {
  if (!raw || !/^[1-9]\d*$/.test(raw)) return 1;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value <= 10_000 ? value : 1;
}
