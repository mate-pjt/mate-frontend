import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSessionController } from "@/data/auth/session-controller";
import { ApiError } from "@/data/shared/errors";
import { BID_SEARCH_MAX_LENGTH, createRecentBidSearches } from "@/features/bids/recent-searches";

import { authentication } from "./helpers";

const minute = 60_000;

function bindToSession(session: ReturnType<typeof createSessionController>) {
  const searches = createRecentBidSearches();
  const sync = () => searches.setScope(session.getConfirmedSessionScope());
  session.subscribe(sync);
  sync();
  return searches;
}

function anonymousSearches(now?: () => number) {
  const searches = createRecentBidSearches(now);
  searches.setScope("anonymous:0");
  return searches;
}

describe("공개 입찰 검색 팝업의 최근 검색어", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("확정 문맥과 비어 있지 않은 1~100자의 명시 기록만 보존한다", () => {
    const searches = createRecentBidSearches();
    searches.record("확인 전 검색");
    expect(searches.getSnapshot()).toEqual([]);
    searches.setScope("anonymous:0");
    const longestQuery = "가".repeat(BID_SEARCH_MAX_LENGTH);
    searches.record("  ");
    searches.record(`${longestQuery}나`);
    searches.record(`  ${longestQuery}  `);
    expect(searches.getSnapshot().map(({ query }) => query)).toEqual([longestQuery]);
    expect(searches.getServerSnapshot()).toEqual([]);
  });

  it("최신순 다섯 건에서 중복 제출만 이동시키고 가장 오래된 고유 검색어를 버린다", () => {
    const searches = anonymousSearches();
    for (const query of ["가", "나", "다", "라", "마", "바", "  다  "]) searches.record(query);
    expect(searches.getSnapshot().map(({ query }) => query)).toEqual(["다", "바", "마", "라", "나"]);
  });

  it("명시 재제출과 재선택의 마지막 시각부터 정확히 30분 뒤 각 항목을 지운다", () => {
    const searches = anonymousSearches();
    searches.record("첫째");
    searches.record("둘째");
    searches.record("그대로 만료");
    vi.advanceTimersByTime(29 * minute);
    const first = searches.getSnapshot().find(({ query }) => query === "첫째")!;
    expect(searches.select(first)).toBe(true);
    searches.record("둘째");
    vi.advanceTimersByTime(minute - 1);
    expect(searches.getSnapshot()).toHaveLength(3);
    vi.advanceTimersByTime(1);
    expect(searches.getSnapshot().map(({ query }) => query)).toEqual(["둘째", "첫째"]);
    vi.advanceTimersByTime(29 * minute);
    expect(searches.getSnapshot()).toEqual([]);
  });

  it("백그라운드 탭의 타이머가 밀려도 오래된 항목을 다시 적용하지 않는다", () => {
    let now = 0;
    const searches = anonymousSearches(() => now);
    searches.record("만료할 검색");
    const [row] = searches.getSnapshot();
    now = 30 * minute;
    expect(searches.select(row)).toBe(false);
    expect(searches.getSnapshot()).toEqual([]);
  });

  it("단건·전체 삭제를 즉시 발행하고 새 저장소와 기록을 공유하지 않는다", () => {
    const searches = anonymousSearches();
    const changed = vi.fn();
    const unsubscribe = searches.subscribe(changed);
    searches.record("유지");
    searches.record("삭제");
    const [deleted, retained] = searches.getSnapshot();
    searches.remove(deleted);
    expect(searches.getSnapshot()).toEqual([retained]);
    expect(anonymousSearches().getSnapshot()).toEqual([]);
    searches.clear();
    expect(searches.getSnapshot()).toEqual([]);
    expect(changed).toHaveBeenCalledTimes(4);
    unsubscribe();
  });

  it("비로그인 확인, 일반 토큰 갱신, 계정 교체, 인증 오류와 세션 종료를 구분한다", async () => {
    const refreshBrowserSession = vi.fn()
      .mockRejectedValueOnce(new ApiError(401, "SYNTHETIC", "세션 없음"))
      .mockResolvedValueOnce(authentication(1))
      .mockResolvedValueOnce(authentication(2))
      .mockRejectedValueOnce(new Error("합성 인증 오류"))
      .mockResolvedValueOnce(authentication(1))
      .mockRejectedValueOnce(new ApiError(401, "SYNTHETIC", "세션 종료"));
    const session = createSessionController({ refreshBrowserSession, logoutBrowserSession: async () => {} });
    const searches = bindToSession(session);

    expect(session.getConfirmedSessionScope()).toBeNull();
    await session.refresh();
    searches.record("비로그인");
    session.setAuthentication(authentication(1));
    expect(searches.getSnapshot()).toEqual([]);

    searches.record("계정 기록");
    const [firstAccountRow] = searches.getSnapshot();
    await session.refresh();
    expect(searches.getSnapshot()).toEqual([firstAccountRow]);
    await session.refresh();
    expect(searches.getSnapshot()).toEqual([]);
    searches.record("계정 기록");
    expect(searches.select(firstAccountRow)).toBe(false);

    await expect(session.refresh()).rejects.toThrow("합성 인증 오류");
    searches.record("미확정 검색");
    expect(searches.getSnapshot()).toEqual([]);
    await session.refresh();
    expect(searches.getSnapshot()).toEqual([]);
    searches.record("복구 후 새 기록");
    await session.refresh();
    expect(searches.getSnapshot()).toEqual([]);
  });

  it.each([true, false])("로그아웃 시작 시 즉시 지우고 성공·실패 후에 복원하지 않는다 (%s)", async (succeeds) => {
    const session = createSessionController({
      refreshBrowserSession: async () => authentication(),
      logoutBrowserSession: async () => {
        if (!succeeds) throw new Error("합성 로그아웃 실패");
      },
    });
    session.setAuthentication(authentication());
    const searches = bindToSession(session);
    searches.record("로그아웃 전");
    const logout = session.logout();
    expect(session.getConfirmedSessionScope()).toBeNull();
    searches.record("로그아웃 중");
    expect(searches.getSnapshot()).toEqual([]);
    if (succeeds) await expect(logout).resolves.toBeUndefined();
    else await expect(logout).rejects.toThrow("합성 로그아웃 실패");
    expect(searches.getSnapshot()).toEqual([]);
    searches.record("이후 검색");
    expect(searches.getSnapshot().map(({ query }) => query)).toEqual(["이후 검색"]);
  });
});
