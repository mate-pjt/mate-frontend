import type { Metadata } from "next";
import Link from "next/link";
import { createPublicPageMetadata } from "@/lib/metadata";
import { mockBids } from "@/mocks/bids";
import type { BidStatus } from "@/types/bid";

export const revalidate = 3600;

export const metadata: Metadata = createPublicPageMetadata({
  title: "입찰공고 리스트",
  description:
    "Mate에서 최신 입찰공고 목록을 확인하고 공고 상세 정보를 탐색하세요.",
  path: "/bids",
});

const statusLabel: Record<BidStatus, string> = {
  open: "접수중",
  "closing-soon": "마감임박",
  closed: "마감",
};

const currencyFormatter = new Intl.NumberFormat("ko-KR");

export default function BidListPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm font-semibold text-primary">Bid List</p>
        <h1 className="text-3xl font-semibold">입찰공고 리스트</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          백엔드 연동 전까지 mock 데이터로 목록 UI와 라우팅 구조를 검증합니다.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">공고명</th>
                <th className="px-5 py-3 font-semibold">기관</th>
                <th className="px-5 py-3 font-semibold">지역</th>
                <th className="px-5 py-3 font-semibold">예산</th>
                <th className="px-5 py-3 font-semibold">마감</th>
                <th className="px-5 py-3 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockBids.map((bid) => (
                <tr className="hover:bg-surface-muted" key={bid.id}>
                  <td className="px-5 py-4">
                    <Link
                      className="font-semibold text-foreground hover:text-primary"
                      href={`/bids/${bid.id}`}
                    >
                      {bid.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {bid.category} · {bid.tags.join(", ")}
                    </p>
                  </td>
                  <td className="px-5 py-4">{bid.organization}</td>
                  <td className="px-5 py-4">{bid.region}</td>
                  <td className="px-5 py-4">
                    {currencyFormatter.format(bid.budget)}원
                  </td>
                  <td className="px-5 py-4">{bid.closesAt}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-semibold">
                      {statusLabel[bid.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
