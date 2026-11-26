import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { BidListClient } from "@/components/bids/bid-list-client";
import { bidListLocationParams, isBidListPageSize, readBidListState } from "@/components/bids/bid-list-model";
import { RecommendedBidList } from "@/components/bids/recommended-bid-list";
import { getBidFilterOptions, getBidList } from "@/data/bids/server";
import { BID_SEARCH_MAX_LENGTH } from "@/features/bids/recent-searches";
import { readRecommendedBidFilter } from "@/features/bids/recommended-bid-filter";
import { createPublicPageMetadata } from "@/lib/metadata";

type BidListPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
  const urlSearchParams = toUrlSearchParams(await searchParams);
  const state = readBidListState(urlSearchParams);
  if (state.view === "recommended") {
    const recommendedParams = bidListLocationParams(state).toString();
    if (urlSearchParams.toString() !== recommendedParams) redirect(`/bids?${recommendedParams}`);
    return <RecommendedBidList readListAction={readRecommendedBidList} />;
  }

  if (urlSearchParams.has("agency")) {
    urlSearchParams.delete("agency");
    const query = urlSearchParams.toString();
    redirect(`/bids${query ? `?${query}` : ""}`);
  }

  const [result, filterOptions] = await Promise.all([
    state.dateError || state.amountError ? { items: [], totalCount: 0, page: 1, size: state.size } : getBidList(state),
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

async function readRecommendedBidList(query: unknown, page: unknown, size: unknown, conditions: unknown) {
  "use server";

  if (
    typeof query !== "string" || query.length > BID_SEARCH_MAX_LENGTH ||
    typeof page !== "number" || !Number.isSafeInteger(page) || page < 1 ||
    !isBidListPageSize(size)
  ) return null;

  try {
    const personalFilter = readRecommendedBidFilter(conditions);
    if (!personalFilter) return null;

    // A queued browser call must release the next read even when the public API stalls.
    return await getBidList({ view: "all", query: query.trim(), page, size, personalFilter }, AbortSignal.timeout(10_000));
  } catch {
    return null;
  }
}

function toUrlSearchParams(
  values: Record<string, string | string[] | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => searchParams.append(key, item));
    else if (value !== undefined) searchParams.set(key, value);
  });

  return searchParams;
}
