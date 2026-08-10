'use client';

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/select";
import { isMockAuthenticated } from "@/lib/mock-auth";
import { mockBids } from "@/mocks/bids";

import { BidFilterToolbar } from "./bid-filter-toolbar";
import { BidListEmpty } from "./bid-list-empty";
import { BidListSearch } from "./bid-list-search";
import { filterBids, readBidListState, type BidFilters, type BidView } from "./bid-list-model";
import { BidListTable } from "./bid-list-table";
import { BidViewSelector } from "./bid-view-selector";

const pageSizeOptions = [
  { label: "10개씩 표시", value: "10" },
  { label: "20개씩 표시", value: "20" },
  { label: "30개씩 표시", value: "30" },
] as const;

export function BidListClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = readBidListState(new URLSearchParams(searchParams.toString()));
  const filteredBids = filterBids(mockBids, state);
  const totalPages = Math.max(1, Math.ceil(filteredBids.length / state.size));
  const currentPage = Math.min(state.page, totalPages);
  const visibleBids = filteredBids.slice((currentPage - 1) * state.size, currentPage * state.size);

  useEffect(() => {
    if (state.view !== "recommended" || isMockAuthenticated()) return;
    const nextPath = `${pathname}?${searchParams.toString()}`;
    router.replace(`/auth?mode=login&next=${encodeURIComponent(nextPath)}`);
  }, [pathname, router, searchParams, state.view]);

  function updateParams(updates: Readonly<Record<string, string | undefined>>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    router.push(`${pathname}${next.size > 0 ? `?${next.toString()}` : ""}`);
  }

  function changeView(view: BidView) {
    updateParams({ view: view === "all" ? undefined : view, page: undefined });
  }

  function changeFilter(key: keyof BidFilters, value?: string) {
    updateParams({ [key]: key === "category" && value === "construction" ? undefined : value, page: undefined });
  }

  function resetSearchAndFilters() {
    updateParams({
      query: undefined,
      category: undefined,
      region: undefined,
      industry: undefined,
      contract: undefined,
      agency: undefined,
      period: undefined,
      amount: undefined,
      page: undefined,
    });
  }

  const filters: BidFilters = {
    category: state.category,
    region: state.region,
    industry: state.industry,
    contract: state.contract,
    agency: state.agency,
    period: state.period,
    amount: state.amount,
  };

  return (
    <div className="w-full bg-white px-4 pb-[30px] pt-[30px] sm:px-8 xl:px-[30px]">
      <section className="w-full">
        <div className="p-2">
          <BidViewSelector onValueChange={changeView} value={state.view} />
          <p className="mt-2 text-grayscale-600 type-heading-10">
            전국의 모든 입찰공고를 한눈에, 사장님께 꼭 필요한 정보만 골라 정리했어요!
          </p>
        </div>

        <div className="mt-[18px]">
          <BidFilterToolbar bids={mockBids} filters={filters} onFilterChange={changeFilter} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
          <BidListSearch initialValue={state.query} key={state.query} onSearch={(query) => updateParams({ query: query || undefined, page: undefined })} />
          <Select
            align="right"
            ariaLabel="페이지당 공고 수"
            boxClassName="w-[107px] justify-between"
            disabled={filteredBids.length <= 10}
            menuClassName="w-[132px]"
            onValueChange={(value) => updateParams({ size: value === "10" ? undefined : value, page: undefined })}
            options={pageSizeOptions}
            size="xs"
            value={String(state.size)}
          />
        </div>

        <div className="mt-6">
          {visibleBids.length > 0 ? (
            <BidListTable
              bids={visibleBids}
              onReset={resetSearchAndFilters}
              page={currentPage}
              totalPages={totalPages}
              totalResults={filteredBids.length}
              view={state.view}
              onPageChange={(page) => updateParams({ page: page === 1 ? undefined : String(page) })}
            />
          ) : <BidListEmpty />}
        </div>
      </section>
    </div>
  );
}
