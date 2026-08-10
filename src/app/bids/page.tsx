import type { Metadata } from "next";
import { Suspense } from "react";

import { BidListClient } from "@/components/bids/bid-list-client";
import { createPublicPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata: Metadata = createPublicPageMetadata({
  title: "입찰공고 리스트",
  description:
    "Mate에서 최신 입찰공고 목록을 확인하고 공고 상세 정보를 탐색하세요.",
  path: "/bids",
});

export default function BidListPage() {
  return (
    <Suspense fallback={<div className="min-h-[720px] bg-white" />}>
      <BidListClient />
    </Suspense>
  );
}
