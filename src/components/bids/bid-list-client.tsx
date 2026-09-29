'use client';

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/select";
import { BasicPopup } from "@/components/ui/popup";
import type { BidFilterOptions, BidListQuery, BidListResult } from "@/data/bids/contracts";
import { ApiError, errorMessage } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";
import { getPersonalFilter, resetPersonalFilter, savePersonalFilter } from "@/features/bid-notice-filters/api";
import {
  hasPersonalConditions,
  samePersonalFilter,
  writePersonalFilterParams,
  type PersonalFilterSnapshot,
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

export function BidListClient({ filterOptions, result, state }: BidListClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: authState, getAccessToken, refresh } = useAuthSession();
  const accountId = authState.status === "authenticated" ? authState.authentication.account.id : null;
  const [loadedAccountId, setLoadedAccountId] = useState<number | null>(null);
  const [loadedStatus, setPersonalStatus] = useState<"ready" | "error">("ready");
  const [loadedSnapshot, setSnapshot] = useState<PersonalFilterSnapshot | null>(null);
  const [personalMessage, setPersonalMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const activeAccountId = useRef(accountId);
  const resetDialogRef = useRef<HTMLDivElement>(null);
  const snapshot = loadedAccountId === accountId ? loadedSnapshot : null;
  const personalStatus = accountId === null ? "idle" : loadedAccountId === accountId ? loadedStatus : "loading";
  const visiblePersonalMessage = loadedAccountId === accountId ? personalMessage : "";
  const totalPages = Math.max(1, Math.ceil(result.totalCount / result.size));

  useEffect(() => {
    activeAccountId.current = accountId;
  }, [accountId]);

  useEffect(() => {
    if (accountId !== null) return;
    const timeout = window.setTimeout(() => {
      setLoadedAccountId(null);
      setSnapshot(null);
      setPersonalMessage("");
      setResetOpen(false);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [accountId]);

  useEffect(() => {
    if (!resetOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = resetDialogRef.current;
    dialog?.querySelector<HTMLButtonElement>("button")?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setResetOpen(false);
      }
      if (event.key !== "Tab" || !dialog) return;
      const buttons = [...dialog.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
      if (buttons.length === 0) return;
      if (event.shiftKey && document.activeElement === buttons[0]) {
        event.preventDefault();
        buttons[buttons.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) {
        event.preventDefault();
        buttons[0].focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [resetOpen]);

  useEffect(() => {
    if (state.view !== "recommended" || authState.status !== "anonymous") return;
    const nextPath = `${pathname}?${searchParams.toString()}`;
    router.replace(`/auth?mode=login&next=${encodeURIComponent(nextPath)}`);
  }, [authState.status, pathname, router, searchParams, state.view]);

  useEffect(() => {
    if (accountId === null || state.view !== "all") return;
    const controller = new AbortController();
    void getPersonalFilter({ getAccessToken, refresh }, controller.signal)
      .then((value) => {
        if (controller.signal.aborted) return;
        setSnapshot(value);
        setLoadedAccountId(accountId);
        setPersonalStatus("ready");
        setPersonalMessage("");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSnapshot(null);
        setLoadedAccountId(accountId);
        setPersonalStatus("error");
        setPersonalMessage(errorMessage(error));
      });
    return () => controller.abort();
  }, [accountId, getAccessToken, refresh, state.view]);

  function navigate(next: URLSearchParams) {
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
      writePersonalFilterParams(next, changePersonalFilter(state.personalFilter, key, value, filterOptions));
      next.delete("page");
      navigate(next);
      return;
    }
    updateParams({ [key]: key === "category" && value === "construction" ? undefined : value, page: undefined });
  }

  function resetSearchAndFilters() {
    const next = new URLSearchParams(searchParams.toString());
    writePersonalFilterParams(next);
    ["query", "category", "region", "industry", "contract", "agency", "period", "amount", "page"].forEach((key) => next.delete(key));
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
    if (!snapshot || !hasPersonalConditions(snapshot.filter)) return;
    const next = new URLSearchParams(searchParams.toString());
    ["category", "region", "industry", "contract", "period", "amount", "agency", "page", "view"].forEach((key) => next.delete(key));
    writePersonalFilterParams(next, snapshot.filter);
    setPersonalMessage("내 맞춤 조건을 현재 목록에 적용했어요.");
    navigate(next);
  }

  async function reloadPersonalFilter(message = "") {
    const requestedAccountId = accountId;
    try {
      const latest = await getPersonalFilter({ getAccessToken, refresh });
      if (activeAccountId.current !== requestedAccountId) return;
      setSnapshot(latest);
      setPersonalStatus("ready");
      setPersonalMessage(message);
    } catch (error) {
      if (activeAccountId.current !== requestedAccountId) return;
      setPersonalStatus("error");
      setPersonalMessage(errorMessage(error));
    }
  }

  function refreshAfterConflict() {
    return reloadPersonalFilter("다른 화면에서 맞춤 조건이 바뀌었어요. 최신 조건을 확인한 뒤 다시 저장해 주세요.");
  }

  async function saveToAccount() {
    if (!snapshot || saving) return;
    const filter = currentPersonalFilter(state, filterOptions);
    if (!hasPersonalConditions(filter)) return;
    const requestedAccountId = accountId;
    setSaving(true);
    setPersonalMessage("");
    try {
      const saved = await savePersonalFilter({ getAccessToken, refresh }, snapshot.version, filter);
      if (activeAccountId.current !== requestedAccountId) return;
      setSnapshot(saved);
      setPersonalMessage("내 맞춤 조건을 계정에 저장했어요. 다음 맞춤 이메일부터 반영됩니다.");
    } catch (error) {
      if (activeAccountId.current !== requestedAccountId) return;
      if (error instanceof ApiError && error.status === 409) await refreshAfterConflict();
      else setPersonalMessage(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function resetAccountFilter() {
    if (!snapshot || saving) return;
    const requestedAccountId = accountId;
    setSaving(true);
    setPersonalMessage("");
    try {
      const saved = await resetPersonalFilter({ getAccessToken, refresh }, snapshot.version);
      if (activeAccountId.current !== requestedAccountId) return;
      setSnapshot(saved);
      setResetOpen(false);
      setPersonalMessage("계정의 맞춤 조건을 초기화했어요. 현재 목록 조건은 그대로 유지됩니다.");
    } catch (error) {
      if (activeAccountId.current !== requestedAccountId) return;
      if (error instanceof ApiError && error.status === 409) {
        setResetOpen(false);
        await refreshAfterConflict();
      } else setPersonalMessage(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const personal = state.personalFilter;
  const personalDisplay = personal ? personalFilterDisplay(personal, filterOptions) : null;
  const currentFilter = state.view === "all" ? currentPersonalFilter(state, filterOptions) : null;
  const personalApplied = Boolean(personal && snapshot && samePersonalFilter(personal, snapshot.filter));
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BidFilterToolbar
              filterLabels={personalDisplay?.labels}
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={changeFilter}
              personalMode={Boolean(personal)}
              view={state.view}
            />
            {state.view === "all" && (
              <div className="flex flex-wrap items-center gap-2">
                {!personalApplied && (
                  <button
                    className="h-9 rounded-lg border border-primary-400 px-3 text-primary-400 type-body-5 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={authState.status === "loading" || (authState.status === "authenticated" && (!snapshot || !hasPersonalConditions(snapshot.filter)))}
                    onClick={applyPersonalFilter}
                    title={snapshot && !hasPersonalConditions(snapshot.filter) ? "저장된 맞춤 조건이 없습니다." : undefined}
                    type="button"
                  >
                    내 맞춤
                  </button>
                )}
                {authState.status === "authenticated" && (
                  <>
                    <button
                      className="h-9 rounded-lg bg-primary-400 px-3 text-white type-body-5 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!snapshot || saving || !currentFilter || !hasPersonalConditions(currentFilter) || (snapshot.source === "SAVED" && samePersonalFilter(currentFilter, snapshot.filter))}
                      onClick={() => void saveToAccount()}
                      type="button"
                    >
                      {saving ? "처리 중..." : "내 맞춤에 저장"}
                    </button>
                    {snapshot?.source === "SAVED" && hasPersonalConditions(snapshot.filter) && (
                      <button className="h-9 rounded-lg px-2 text-grayscale-600 underline type-body-7" disabled={saving} onClick={() => setResetOpen(true)} type="button">
                        계정 필터 초기화
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {state.view === "all" && authState.status === "authenticated" && (
            <div className="mt-2 text-grayscale-600 type-body-7">
              {personalStatus === "loading" ? "계정의 맞춤 조건을 확인하고 있어요." :
                personalStatus === "error" ? <button className="underline" onClick={() => void reloadPersonalFilter()} type="button">맞춤 조건 다시 불러오기</button> :
                  snapshot?.source === "COMPANY_DEFAULT" ? "회사 기본 조건을 볼 수 있어요. 계정에 저장하려면 ‘내 맞춤에 저장’을 누르세요." :
                    snapshot?.source === "EMPTY_DEFAULT" ? "저장된 맞춤 조건이 없어요. 현재 조건을 계정에 저장할 수 있어요." :
                    snapshot?.source === "SAVED" && !hasPersonalConditions(snapshot.filter) ? "계정의 맞춤 조건을 비워뒀어요. 회사 기본 조건은 자동으로 적용되지 않아요." :
                      "목록 필터 변경은 계정에 자동 저장되지 않아요."}
            </div>
          )}
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
          {result.items.length > 0 ? (
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
      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" ref={resetDialogRef} role="presentation">
          <BasicPopup
            aria-modal="true"
            className="max-w-full"
            description="계정에 저장된 맞춤 조건을 비웁니다. 회사 기본 조건으로 돌아가지 않으며, 현재 목록의 조건은 그대로 유지돼요."
            onClose={() => setResetOpen(false)}
            primaryAction={{ label: saving ? "처리 중..." : "초기화", tone: "danger", disabled: saving, onClick: () => void resetAccountFilter() }}
            role="dialog"
            secondaryAction={{ label: "취소", onClick: () => setResetOpen(false) }}
            title="계정 맞춤 조건을 초기화할까요?"
          />
        </div>
      )}
    </div>
  );
}
