import type { Metadata } from "next";
import { Suspense } from "react";

import { BidListClient } from "@/components/bids/bid-list-client";
import { readBidListState } from "@/components/bids/bid-list-model";
import { getBidFilterOptions, getBidList } from "@/data/bids/server";
import { createPublicPageMetadata } from "@/lib/metadata";

type BidListPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;

export const metadata: Metadata = createPublicPageMetadata({
  title: "입찰공고 리스트",
  description:
    "Mate에서 최신 입찰공고 목록을 확인하고 공고 상세 정보를 탐색하세요.",
  path: "/bids",
});

export default function BidListPage({ searchParams }: BidListPageProps) {
  return (
    <Suspense fallback={<div className="min-h-[720px] bg-white" />}>
      <BidListContent searchParams={searchParams} />
    </Suspense>
  );
}

async function BidListContent({ searchParams }: BidListPageProps) {
  const state = readBidListState(toUrlSearchParams(await searchParams));
  const [result, filterOptions] = await Promise.all([
    getBidList(state),
    getBidFilterOptions(),
  ]);

  return (
    <BidListClient
      filterOptions={filterOptions}
      result={result}
      state={state}
    />
  );
}

function toUrlSearchParams(
  values: Record<string, string | string[] | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    const firstValue = Array.isArray(value) ? value[0] : value;

    if (firstValue !== undefined) {
      searchParams.set(key, firstValue);
    }
  });

  return searchParams;
}
