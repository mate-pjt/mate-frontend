'use client';

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { BidAmountFilter, BidDateFilter, BidFilterOptions, BidListQuery, BidListResult } from "@/data/bids/contracts";
import { currentBidDateFilter, writeBidDateParams } from "@/features/bid-notice-filters/date-filter";
import { bidAmountUrlKeys, currentBidAmountFilter, writeBidAmountParams } from "@/features/bid-notice-filters/amount-filter";
import { errorMessage } from "@/data/shared/errors";
import { useAuthSession } from "@/features/auth/session";
import { createPersonalFilterApplyController } from "@/features/bid-notice-filters/apply-controller";
import { getPersonalFilter } from "@/data/personal-filters/client";
import {
  samePersonalFilter,
  writePersonalFilterParams,
  type PersonalFilterSnapshot,
  type PersonalFilterValues,
} from "@/features/bid-notice-filters/model";

import { BidFilterToolbar } from "./bid-filter-toolbar";
import { BidListEmpty } from "./bid-list-empty";
import { BidListSearch } from "./bid-list-search";
import { type BidFilters, type BidView } from "./bid-list-model";
import { BidListTable } from "./bid-list-table";
import { BidViewSelector } from "./bid-view-selector";
import { changePersonalFilter, currentPersonalFilter, personalFilterDisplay } from "./personal-filter-adapter";

const pageSizeOptions = [
  { label: "10개씩 표시", value: "10" },
  { label: "20개씩 표시", value: "20" },
  { label: "30개씩 표시", value: "30" },
] as const;

type BidListClientProps = {
  readonly filterOptions: BidFilterOptions;
  readonly result: BidListResult;
  readonly state: BidListQuery;
};

type ApplyRun = { accountId: number; pathname: string; search: string };

export function BidListClient({ filterOptions, result, state }: BidListClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: authState, getAccessToken, refresh, getAccountKey } = useAuthSession();
  const accountId = authState.status === "authenticated" ? authState.authentication.account.id : null;
  const [loadedAccountId, setLoadedAccountId] = useState<number | null>(null);
  const [loadedSnapshot, setSnapshot] = useState<PersonalFilterSnapshot | null>(null);
  const [personalMessage, setPersonalMessage] = useState("");
  const [applyRun, setApplyRun] = useState<ApplyRun | null>(null);
  const personalReadIntent = useRef(0);
  const applyController = useRef<ReturnType<typeof createPersonalFilterApplyController> | null>(null);
  const snapshot = loadedAccountId === accountId ? loadedSnapshot : null;
  const visiblePersonalMessage = loadedAccountId === accountId ? personalMessage : "";
  const totalPages = Math.max(1, Math.ceil(result.totalCount / result.size));
  const search = searchParams.toString();
  const applying = applyRun !== null && applyRun.accountId === accountId && applyRun.pathname === pathname && applyRun.search === search;

  useEffect(() => () => applyController.current?.dispose(), []);

  useEffect(() => {
    if (applyController.current && !applyController.current.isCurrent()) applyController.current.dispose();
  }, [accountId, pathname, search]);

  useEffect(() => {
    if (accountId !== null) return;
    const timeout = window.setTimeout(() => {
      setLoadedAccountId(null);
      setSnapshot(null);
      setPersonalMessage("");
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [accountId]);

  useEffect(() => {
    if (state.view !== "recommended" || authState.status !== "anonymous") return;
    const nextPath = `${pathname}?${searchParams.toString()}`;
    router.replace(`/auth?mode=login&next=${encodeURIComponent(nextPath)}`);
  }, [authState.status, pathname, router, searchParams, state.view]);

  useEffect(() => {
    if (accountId === null || state.view !== "all") return;
    const controller = new AbortController();
    const intent = ++personalReadIntent.current;
    void getPersonalFilter({ getAccessToken, refresh, getAccountKey }, controller.signal)
      .then((value) => {
        if (controller.signal.aborted || intent !== personalReadIntent.current) return;
        setSnapshot(value);
        setLoadedAccountId(accountId);
        setPersonalMessage("");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || intent !== personalReadIntent.current) return;
        setSnapshot(null);
        setLoadedAccountId(accountId);
        setPersonalMessage(errorMessage(error));
      });
    return () => controller.abort();
  }, [accountId, getAccessToken, refresh, getAccountKey, state.view]);

  function navigate(next: URLSearchParams) {
    applyController.current?.dispose();
    router.push(`${pathname}${next.size > 0 ? `?${next.toString()}` : ""}`);
  }

  function updateParams(updates: Readonly<Record<string, string | undefined>>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    navigate(next);
  }

  function changeView(view: BidView) {
    const next = new URLSearchParams(searchParams.toString());
    writePersonalFilterParams(next);
    if (view === "all") next.delete("view");
    else next.set("view", view);
    next.delete("page");
    if (view === "closing") next.delete("period");
    if (view === "result") next.delete("amount");
    navigate(next);
  }

  function changeFilter(key: keyof BidFilters, value?: string) {
    if (state.personalFilter && key !== "agency") {
      const next = new URLSearchParams(searchParams.toString());
      writeCurrentPersonalFilter(next, changePersonalFilter(state.personalFilter, key, value, filterOptions));
      next.delete("page");
      navigate(next);
      return;
    }
    updateParams({ [key]: key === "category" && value === "construction" ? undefined : value, page: undefined });
  }

  function writeCurrentPersonalFilter(next: URLSearchParams, filter: PersonalFilterValues) {
    writePersonalFilterParams(next, filter);
    if (state.amountError) {
      bidAmountUrlKeys.forEach(key => {
        next.delete(key);
        searchParams.getAll(key).forEach(value => next.append(key, value));
      });
    }
  }

  function resetSearchAndFilters() {
    const next = new URLSearchParams(searchParams.toString());
    writePersonalFilterParams(next);
    ["query", "category", "region", "industry", "contract", "agency", "period", "amount", "page"].forEach((key) => next.delete(key));
    navigate(next);
  }

  function changeDateFilter(dates: BidDateFilter) {
    const next = new URLSearchParams(searchParams.toString());
    if (state.personalFilter) writeCurrentPersonalFilter(next, { ...state.personalFilter, ...dates });
    else writeBidDateParams(next, dates);
    next.delete("period");
    next.delete("page");
    navigate(next);
  }

  function changeAmountFilter(amounts: BidAmountFilter) {
    const next = new URLSearchParams(searchParams.toString());
    if (state.personalFilter) writePersonalFilterParams(next, { ...state.personalFilter, ...amounts });
    else writeBidAmountParams(next, amounts);
    next.delete("amount");
    next.delete("page");
    navigate(next);
  }

  function applyPersonalFilter() {
    if (authState.status === "error") {
      void refresh().catch(() => undefined);
      return;
    }
    if (authState.status === "anonymous") {
      const nextPath = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`;
      router.push(`/auth?mode=login&next=${encodeURIComponent(nextPath)}`);
      return;
    }
    if (accountId === null || applyController.current?.pending) return;
    applyController.current?.dispose();
    const requestedAccountKey = getAccountKey();
    const run = { accountId, pathname, search };
    setPersonalMessage("");
    const controller = createPersonalFilterApplyController({
      isCurrent: () => requestedAccountKey === getAccountKey()
        && window.location.pathname === pathname && new URLSearchParams(window.location.search).toString() === search,
      load: (signal) => getPersonalFilter({ getAccessToken, refresh, getAccountKey }, signal),
      onSnapshot: (latest) => {
        personalReadIntent.current += 1;
        setLoadedAccountId(accountId);
        setSnapshot(latest);
      },
      onApply: (filter) => {
        const next = new URLSearchParams(search);
        ["category", "region", "industry", "contract", "period", "amount", "agency", "page", "view"].forEach((key) => next.delete(key));
        writePersonalFilterParams(next, filter);
        navigate(next);
      },
      onEmpty: () => setPersonalMessage(""),
      onError: (error) => {
        personalReadIntent.current += 1;
        setLoadedAccountId(accountId);
        setPersonalMessage(errorMessage(error));
      },
      onPending: (pending) => setApplyRun((current) => pending ? run : current === run ? null : current),
    });
    applyController.current = controller;
    void controller.apply();
  }

  const personal = state.personalFilter;
  const personalDisplay = personal ? personalFilterDisplay(personal, filterOptions) : null;
  const currentFilter = state.view === "all" && !state.dateError && !state.amountError ? currentPersonalFilter(state, filterOptions) : null;
  const dateFilter = state.dateFilter ?? currentBidDateFilter(state);
  const amountFilter = state.amountFilter ?? currentBidAmountFilter(state);
  const personalApplied = Boolean(currentFilter && snapshot && samePersonalFilter(currentFilter, snapshot.filter));
  const filters: BidFilters = {
    category: personal?.bidTypes.length === 1
      ? ({ CONSTRUCTION: "construction", SERVICE: "service", GOODS: "purchase" } as const)[personal.bidTypes[0]]
      : state.category,
    region: personal?.regionCodes.length === 1
      ? filterOptions.regionOptions.find((option) => option.code === personal.regionCodes[0])?.label
      : state.region,
    industry: personal?.industryCodes.length === 1
      ? filterOptions.industryOptions.find((option) => option.code === personal.industryCodes[0])?.label
      : state.industry,
    contract: personal?.contractMethods.length === 1
      ? { GENERAL: "일반경쟁", LIMITED: "제한경쟁", NOMINATION: "지명경쟁", PRIVATE: "수의계약" }[personal.contractMethods[0]]
      : state.contract,
    agency: state.agency,
    period: personal ? undefined : state.period,
    amount: personal ? undefined : state.amount,
  };

  if (state.view === "recommended" && authState.status !== "authenticated") {
    return (
      <div className="mx-auto my-12 max-w-xl rounded-xl border border-border bg-white p-6 text-center">
        <p className="text-grayscale-800 type-heading-8">
          {authState.status === "loading" ? "로그인 상태를 확인하고 있어요." :
            authState.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 페이지로 이동하고 있어요."}
        </p>
        {authState.status === "error" ? (
          <button className="mt-4 text-primary underline" onClick={() => void refresh().catch(() => undefined)} type="button">
            다시 시도하기
          </button>
        ) : null}
      </div>
    );
  }

  if (state.view === "recommended") {
    return (
      <div className="w-full bg-white px-4 pb-[30px] pt-[30px] sm:px-8 xl:px-[30px]">
        <div className="p-2">
          <BidViewSelector onValueChange={changeView} value={state.view} />
        </div>
        <div className="flex min-h-[430px] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-grayscale-800 type-heading-7">맞춤 입찰공고를 준비하고 있어요</h1>
          <p className="mt-2 text-grayscale-600 type-body-5">공개 입찰공고는 위 목록에서 확인해 주세요.</p>
        </div>
      </div>
    );
  }

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
          <BidFilterToolbar
            amountDraft={state.amountDraft}
            amountFilter={amountFilter}
            amountQueryError={state.amountError}
            dateFilter={dateFilter}
            dateQueryError={state.dateError}
            filterLabels={personalDisplay?.labels}
            filterOptions={filterOptions}
            filters={filters}
            renderLeadingAction={state.view === "all" && (!personalApplied || applying) ? (closeFilters) => (
              <>
                <Button
                  className="h-9 shrink-0 gap-1 bg-grayscale-800 enabled:hover:bg-grayscale-700 enabled:active:bg-grayscale-900"
                  disabled={authState.status === "loading" || applying}
                  onClick={() => {
                    closeFilters();
                    applyPersonalFilter();
                  }}
                  title="최신 맞춤 조건을 불러와 적용합니다."
                  variant="text_white"
                >
                  <span aria-hidden="true" className="size-4 shrink-0 bg-[url('/icon/fit.svg')] bg-center bg-no-repeat" />
                  {applying ? "조회 중..." : "내 맞춤"}
                </Button>
                <span aria-hidden="true" className="h-3 w-px shrink-0 rounded-full bg-grayscale-200" />
              </>
            ) : undefined}
            onFilterChange={changeFilter}
            onDateFilterChange={changeDateFilter}
            onAmountFilterChange={changeAmountFilter}
            personalMode={Boolean(personal)}
            view={state.view}
          />
          {state.view === "all" && authState.status === "error" && (
            <p className="mt-2 text-grayscale-600 type-body-7">로그인 상태를 확인하지 못했어요. ‘내 맞춤’을 눌러 다시 확인해 주세요.</p>
          )}
          {personal && personalDisplay && (
            <div className="mt-3 rounded-lg bg-primary-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-grayscale-700 type-body-7">현재 목록에 적용된 맞춤 조건</p>
                <button className="shrink-0 text-primary-400 underline type-body-7" onClick={resetSearchAndFilters} type="button">현재 조건 초기화</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {personalDisplay.chips.length > 0 ? personalDisplay.chips.map((chip, index) => (
                  <span className="rounded-full bg-white px-3 py-1 text-primary-400 type-body-7" key={`${chip}-${index}`}>{chip}</span>
                )) : <span className="text-grayscale-600 type-body-7">조건 없음</span>}
              </div>
              <p className="mt-2 text-grayscale-600 type-body-7">복수 조건이나 직접 지정한 범위를 바꾸려면 위 필터에서 새 조건을 선택하세요. 선택한 항목의 기존 조건이 교체됩니다.</p>
            </div>
          )}
          {visiblePersonalMessage && <p className="mt-2 text-grayscale-700 type-body-7" role="status">{visiblePersonalMessage}</p>}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
          <BidListSearch initialValue={state.query} key={state.query} onSearch={(query) => updateParams({ query: query || undefined, page: undefined })} />
          <Select
            align="right"
            ariaLabel="페이지당 공고 수"
            boxClassName="w-[107px] justify-between"
            disabled={result.totalCount <= 10}
            menuClassName="w-[132px]"
            onValueChange={(value) => updateParams({ size: value === "10" ? undefined : value, page: undefined })}
            options={pageSizeOptions}
            size="xs"
            value={String(state.size)}
          />
        </div>

        <div className="mt-6">
          {state.dateError || state.amountError ? (
            <div className="rounded-lg border border-grayscale-200 p-6">
              {state.dateError && <p className="text-danger type-body-5" role="alert">{state.dateError}</p>}
              {state.amountError && <p className="text-danger type-body-5" role="alert">{state.amountError}</p>}
              <p className="mt-2 text-grayscale-600 type-body-7">위 필터에서 잘못된 조건을 수정하거나 초기화해 주세요.</p>
            </div>
          ) : result.items.length > 0 ? (
            <BidListTable
              bids={result.items}
              onReset={resetSearchAndFilters}
              page={result.page}
              totalPages={totalPages}
              totalResults={result.totalCount}
              view={state.view}
              onPageChange={(page) => updateParams({ page: page === 1 ? undefined : String(page) })}
            />
          ) : (
            <BidListEmpty
              hasResults={result.totalCount > 0}
              onFirstPage={() => updateParams({ page: undefined })}
            />
          )}
        </div>
      </section>
    </div>
  );
}
