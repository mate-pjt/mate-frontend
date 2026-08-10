import Link from "next/link";

import { ResetIcon } from "@/components/icons";
import { Pagination } from "@/components/ui/pagination";
import type { Bid } from "@/types/bid";

import type { BidView } from "./bid-list-model";

type BidListTableProps = {
  readonly bids: readonly Bid[];
  readonly onPageChange: (page: number) => void;
  readonly onReset: () => void;
  readonly page: number;
  readonly totalPages: number;
  readonly totalResults: number;
  readonly view: BidView;
};

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function BidListTable({
  bids,
  onPageChange,
  onReset,
  page,
  totalPages,
  totalResults,
  view,
}: BidListTableProps) {
  const showsResult = view === "result";

  return (
    <>
      <div className="overflow-x-auto">
        <table className={`w-full table-fixed border-separate border-spacing-0 ${showsResult ? "min-w-[2030px]" : "min-w-[1860px]"}`}>
          <caption className="sr-only">입찰공고 검색 결과</caption>
          <colgroup>
            <col className="w-[168px]" />
            <col className="w-[520px]" />
            <col className="w-[110px]" />
            <col className="w-[150px]" />
            <col className="w-[184px]" />
            <col className="w-[120px]" />
            <col className="w-[134px]" />
            <col className="w-[134px]" />
            {showsResult ? (
              <>
                <col className="w-[170px]" />
                <col className="w-[110px]" />
                <col className="w-[170px]" />
              </>
            ) : (
              <>
                <col className="w-[170px]" />
                <col className="w-[170px]" />
              </>
            )}
          </colgroup>
          <thead className="text-grayscale-500 type-body-7">
            <tr className="h-[46px]">
              <HeaderCell>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  검색된 공고 ∙ {totalResults.toLocaleString("ko-KR")} 건
                  <button
                    aria-label="검색 조건 초기화"
                    className="inline-flex size-5 items-center justify-center text-grayscale-500 hover:text-grayscale-700"
                    onClick={onReset}
                    type="button"
                  >
                    <ResetIcon aria-hidden className="size-4" focusable="false" />
                  </button>
                </span>
              </HeaderCell>
              <HeaderCell><span className="sr-only">공고명</span></HeaderCell>
              <HeaderCell align="right">지역</HeaderCell>
              <HeaderCell align="right">발주기관</HeaderCell>
              <HeaderCell align="right">업종</HeaderCell>
              <HeaderCell align="center">계약방법</HeaderCell>
              <HeaderCell align="right">공고일</HeaderCell>
              <HeaderCell align="right">{showsResult ? "개찰일" : "입찰마감"}</HeaderCell>
              {showsResult ? (
                <>
                  <HeaderCell align="right">낙찰업체</HeaderCell>
                  <HeaderCell align="right">낙찰률</HeaderCell>
                  <HeaderCell align="right">낙찰금액(원)</HeaderCell>
                </>
              ) : (
                <>
                  <HeaderCell align="right">기초금액(원)</HeaderCell>
                  <HeaderCell align="right">추정가격(원)</HeaderCell>
                </>
              )}
            </tr>
          </thead>
          <tbody className="text-grayscale-700 type-body-6">
            {bids.map((bid, index) => (
              <tr
                className={`h-20 [&>td:first-child]:rounded-l-[8px] [&>td:last-child]:rounded-r-[8px] ${index % 2 === 0 ? "[&>td]:bg-grayscale-50" : "[&>td]:bg-white"}`}
                key={bid.id}
              >
                <Cell align="center">
                  <Link className="whitespace-nowrap text-grayscale-500 underline underline-offset-2 hover:text-primary-400" href={`/bids/${bid.id}`}>
                    {bid.noticeNumber}
                  </Link>
                </Cell>
                <Cell>
                  <Link className="line-clamp-2 text-grayscale-800 hover:text-primary-400" href={`/bids/${bid.id}`}>
                    {bid.title}
                  </Link>
                </Cell>
                <Cell align="right"><span className="break-keep">{bid.region}</span></Cell>
                <Cell align="right">{bid.organization}</Cell>
                <Cell align="right"><span className="block truncate">{bid.industry}</span></Cell>
                <Cell align="center">
                  <span className="inline-flex rounded-[6px] bg-primary-100 px-2 py-1 text-primary-400">
                    {bid.contractMethod}
                  </span>
                </Cell>
                <Cell align="right">{bid.publishedAt}</Cell>
                <Cell align="right"><span className="whitespace-nowrap">{showsResult ? bid.openedAt : bid.closesAt}</span></Cell>
                {showsResult ? (
                  <>
                    <Cell align="right">{bid.winningCompany}</Cell>
                    <Cell align="right">{bid.bidRate.toFixed(3)}%</Cell>
                    <Cell align="right" emphasized>{formatWon(bid.estimatedPrice * bid.bidRate / 100)}</Cell>
                  </>
                ) : (
                  <>
                    <Cell align="right">{formatWon(bid.baseAmount)}</Cell>
                    <Cell align="right" emphasized>{formatWon(bid.estimatedPrice)}</Cell>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-[30px] flex justify-center">
        <Pagination onPageChange={onPageChange} page={page} totalPages={totalPages} />
      </div>
    </>
  );
}

function HeaderCell({
  align = "left",
  children,
}: {
  readonly align?: "left" | "center" | "right";
  readonly children: React.ReactNode;
}) {
  return (
    <th
      className={`px-2 font-medium ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`}
      scope="col"
    >
      {children}
    </th>
  );
}

function Cell({
  align = "left",
  children,
  emphasized = false,
}: {
  readonly align?: "left" | "center" | "right";
  readonly children: React.ReactNode;
  readonly emphasized?: boolean;
}) {
  return (
    <td
      className={`px-2 align-middle ${align === "right" ? "text-right tabular-nums" : align === "center" ? "text-center" : "text-left"} ${emphasized ? "text-primary-500" : ""}`}
    >
      {children}
    </td>
  );
}

function formatWon(value: number) {
  return numberFormatter.format(Math.round(value));
}
