"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { BidListResult } from "@/data/bids/contracts";
import { getPersonalFilter, type PersonalFilterSnapshot, type PersonalFilterValues } from "@/data/personal-filters/client";
import { ApiError } from "@/data/shared/errors";
import { useAuthSession } from "@/features/auth/session";
import { readRecommendedBidFilter } from "@/features/bids/recommended-bid-filter";

import { BidListEmpty } from "./bid-list-empty";
import { bidListLocationParams, bidPageSizeOptions, readBidListState, type BidListState, type BidView } from "./bid-list-model";
import { BidListSearch } from "./bid-list-search";
import { BidListTable } from "./bid-list-table";
import { BidViewSelector } from "./bid-view-selector";
import { personalFilterDisplay } from "./personal-filter-adapter";

type ReadListAction = (query: string, page: number, size: number, filter: PersonalFilterValues) => Promise<BidListResult | null>;
type MatchingConditions = { source: Exclude<PersonalFilterSnapshot["source"], "EMPTY_DEFAULT">; filter: PersonalFilterValues };
type ConditionResult = { status: "empty" } | { status: "ready"; conditions: MatchingConditions } | { status: "error"; login: boolean };

export function RecommendedBidList({ readListAction }: { readListAction: ReadListAction }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = readBidListState(searchParams);
  const loginHref = `/auth?mode=login&next=${encodeURIComponent(`/bids?${bidListLocationParams(location)}`)}`;
  const { state, refresh, getAccountKey, getSessionEpoch, subscribe } = useAuthSession();
  const epoch = useSyncExternalStore(subscribe, getSessionEpoch, () => 0);
  const accountKey = getAccountKey();

  const isCurrent = useCallback(() => accountKey !== null && accountKey === getAccountKey() && epoch === getSessionEpoch() &&
    window.location.pathname === "/bids" && new URLSearchParams(window.location.search).get("view") === "recommended",
  [accountKey, epoch, getAccountKey, getSessionEpoch]);

  useEffect(() => {
    if (state.status === "anonymous") router.replace(loginHref);
  }, [loginHref, router, state.status]);

  function changeView(view: BidView) {
    if (view === "recommended") return;
    const params = bidListLocationParams({ ...location, view, page: 1 });
    router.push(params.size ? `/bids?${params}` : "/bids");
  }

  return (
    <section className="w-full bg-white px-4 py-[30px] sm:px-8 xl:px-[30px]">
      <div className="p-2">
        <BidViewSelector heading onValueChange={changeView} value="recommended" />
        <p className="mt-2 text-grayscale-600 type-heading-10">
          전국의 모든 입찰공고를 한눈에, 사장님께 꼭 필요한 정보만 골라 정리했어요!
        </p>
      </div>

      {state.status === "error" ? (
        <Status title="로그인 상태를 확인하지 못했어요." error>
          <Button onClick={() => void refresh().catch(() => undefined)} size="sm" type="button">다시 시도하기</Button>
        </Status>
      ) : state.status === "authenticated" && accountKey !== null ? (
        <AccountRecommendations
          isCurrent={isCurrent}
          key={`${accountKey}:${epoch}`}
          location={location}
          loginHref={loginHref}
          readListAction={readListAction}
        />
      ) : (
        <Status title={state.status === "anonymous" ? "로그인 페이지로 이동하고 있어요." : "로그인 상태를 확인하고 있어요."} />
      )}
    </section>
  );
}

function AccountRecommendations({ isCurrent, location, loginHref, readListAction }: {
  isCurrent: () => boolean;
  location: BidListState;
  loginHref: string;
  readListAction: ReadListAction;
}) {
  const { getAccessToken, refresh, getAccountKey } = useAuthSession();
  const [attempt, setAttempt] = useState(0);
  const [completed, setCompleted] = useState<{ attempt: number; result: ConditionResult } | null>(null);
  const state = completed?.attempt === attempt ? completed.result : null;

  useEffect(() => {
    const controller = new AbortController();
    const active = () => !controller.signal.aborted && isCurrent();

    const access = {
      getAccessToken, refresh, getAccountKey,
      assertRequestScope() {
        if (!active()) throw new DOMException("조회 화면 또는 세션이 변경되었습니다.", "AbortError");
      },
    };
    void getPersonalFilter(access, controller.signal).then(snapshot => {
      if (!active()) return;
      const filter = readRecommendedBidFilter(snapshot.filter);
      if (snapshot.source === "EMPTY_DEFAULT" && filter) throw new Error("기본 맞춤 조건을 확인하지 못했습니다.");
      const result: ConditionResult = filter && snapshot.source !== "EMPTY_DEFAULT"
        ? { status: "ready", conditions: { source: snapshot.source, filter } }
        : { status: "empty" };
      setCompleted({ attempt, result });
    }).catch((error: unknown) => {
      if (active()) setCompleted({ attempt, result: { status: "error", login: error instanceof ApiError && error.status === 401 } });
    });

    return () => controller.abort();
  }, [attempt, getAccessToken, getAccountKey, isCurrent, refresh]);

  if (!state) return <Status title="맞춤 조건을 불러오고 있어요." />;
  if (state.status === "empty") {
    return (
      <Status title="설정된 맞춤 조건이 없어요.">
        <p className="text-grayscale-600 type-body-5">맞춤 조건을 설정하면 이곳에서 해당 입찰공고를 확인할 수 있어요.</p>
        <AllBidsLink />
      </Status>
    );
  }
  if (state.status === "error") {
    return (
      <Status title={state.login ? "다시 로그인해 맞춤 조건을 확인해 주세요." : "맞춤 조건을 불러오지 못했어요."} error>
        {state.login ? <Link className="text-primary-400 underline type-body-5" href={loginHref}>다시 로그인</Link> : (
          <Button onClick={() => setAttempt(attempt + 1)} size="sm" type="button">다시 시도하기</Button>
        )}
      </Status>
    );
  }
  return <MatchingBids conditions={state.conditions} isCurrent={isCurrent} location={location} readListAction={readListAction} />;
}

function MatchingBids({ conditions, isCurrent, location, readListAction }: {
  conditions: MatchingConditions;
  isCurrent: () => boolean;
  location: BidListState;
  readListAction: ReadListAction;
}) {
  const { source, filter } = conditions;
  const { query, page, size } = location;
  const href = `/bids?${bidListLocationParams(location)}`;
  const [requestedHref, setRequestedHref] = useState(href);
  const [attempt, setAttempt] = useState(0);
  const [completed, setCompleted] = useState<{ href: string; attempt: number; result: BidListResult | null } | null>(null);
  if (requestedHref !== href) {
    setRequestedHref(href);
    setCompleted(null);
  }
  const outcome = completed?.href === href && completed.attempt === attempt ? completed : null;
  const result = outcome?.result;
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const isLatest = () => active && isCurrent() && `/bids?${new URLSearchParams(window.location.search)}` === href;
    const finish = (result: BidListResult | null) => {
      if (isLatest()) setCompleted({ href, attempt, result });
    };

    void Promise.resolve().then(async () => {
      if (isLatest()) finish(await readListAction(query, page, size, filter));
    }).catch(() => finish(null));
    return () => { active = false; };
  }, [attempt, filter, href, isCurrent, page, query, readListAction, size]);

  function navigate(updates: Partial<Pick<BidListState, "query" | "page" | "size">>) {
    const next = `/bids?${bidListLocationParams({ ...location, ...updates })}`;
    if (next === href) return;
    if (resultsRef.current?.contains(document.activeElement)) resultsRef.current.focus({ preventScroll: true });
    window.history.pushState(null, "", next);
  }

  const { chips } = personalFilterDisplay(filter);
  return (
    <>
      <div className="mt-[18px] rounded-lg bg-primary-50 p-3">
        <p className="text-grayscale-700 type-body-7">{source === "SAVED" ? "저장한 맞춤 조건" : "회사 기본 조건"}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {chips.map((chip, index) => <li className="rounded-full bg-white px-3 py-1 text-primary-400 type-body-7" key={`${chip}-${index}`}>{chip}</li>)}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
        <span className="mr-auto text-grayscale-600 type-body-7">마감 빠른 순</span>
        <BidListSearch initialValue={query} onSearch={value => navigate({ query: value, page: 1 })} recentSearchesEnabled={false} />
        <Select
          align="right"
          ariaLabel="페이지당 공고 수"
          boxClassName="w-[107px] justify-between"
          menuClassName="w-[132px]"
          onValueChange={value => navigate({ size: Number(value), page: 1 })}
          options={bidPageSizeOptions}
          size="xs"
          value={String(size)}
        />
      </div>

      <div aria-label="맞춤 공고 검색 결과" className="mt-6" ref={resultsRef} role="region" tabIndex={-1}>
        {!outcome ? <Status title="맞춤 공고를 불러오고 있어요." /> : !result ? (
          <Status title="맞춤 공고를 불러오지 못했어요." error>
            <Button onClick={() => setAttempt(attempt + 1)} size="sm" type="button">다시 시도하기</Button>
          </Status>
        ) : result.totalCount === 0 ? (
          <Status title="맞춤 조건에 맞는 공고가 없어요.">
            {query && <Button onClick={() => navigate({ query: "", page: 1 })} size="sm" type="button">검색어 지우기</Button>}
            <AllBidsLink />
          </Status>
        ) : result.items.length === 0 ? (
          <BidListEmpty hasResults onFirstPage={() => navigate({ page: 1 })} />
        ) : (
          <BidListTable
            bids={result.items}
            onPageChange={page => navigate({ page })}
            onReset={() => navigate({ query: "", page: 1 })}
            page={result.page}
            totalPages={Math.ceil(result.totalCount / result.size)}
            totalResults={result.totalCount}
            view="recommended"
          />
        )}
      </div>
    </>
  );
}

function AllBidsLink() {
  return <Link className="text-primary-400 underline type-body-5" href="/bids">전체 입찰공고 보기</Link>;
}

function Status({ title, error = false, children }: { title: string; error?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center gap-3 border-b border-grayscale-200 px-4 text-center">
      <p className="text-grayscale-800 type-heading-7" role={error ? "alert" : "status"}>{title}</p>
      {children}
    </div>
  );
}
