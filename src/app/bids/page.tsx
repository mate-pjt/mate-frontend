import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { BidListClient } from "@/components/bids/bid-list-client";
import { readBidListState } from "@/components/bids/bid-list-model";
import { getBidFilterOptions, getBidList } from "@/data/bids/server";
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
  if (urlSearchParams.has("agency")) {
    urlSearchParams.delete("agency");
    const query = urlSearchParams.toString();
    redirect(`/bids${query ? `?${query}` : ""}`);
  }

  const state = readBidListState(urlSearchParams);
  if (state.view === "recommended") {
    return (
      <BidListClient
        filterOptions={{ regions: [], industries: [], contractMethods: [], regionOptions: [], industryOptions: [] }}
        result={{ items: [], totalCount: 0, page: 1, size: state.size }}
        state={state}
      />
    );
  }

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
    if (Array.isArray(value)) value.forEach((item) => searchParams.append(key, item));
    else if (value !== undefined) searchParams.set(key, value);
  });

  return searchParams;
}
