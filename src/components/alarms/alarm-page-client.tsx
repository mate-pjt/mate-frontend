"use client";

import { useEffect, useRef, useState } from "react";

import { UpArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { errorMessage, type AuthAccess } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";
import {
  getNotifications,
  markNotificationRead,
  NOTIFICATIONS_CHANGED_EVENT,
  type NotificationPage,
} from "@/features/notifications/api";

import { AlarmEmpty } from "./alarm-empty";
import { AlarmListItem } from "./alarm-list-item";

export function AlarmPageClient() {
  const { state, getAccessToken, refresh } = useAuthSession();

  if (state.status === "authenticated") {
    return (
      <AuthenticatedAlarmPage
        getAccessToken={getAccessToken}
        key={state.authentication.account.id}
        refresh={refresh}
      />
    );
  }

  if (state.status === "anonymous") {
    return (
      <section aria-labelledby="alarm-login-title" className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex max-w-[420px] flex-col items-center gap-5">
          <h1 className="type-heading-7 text-grayscale-800" id="alarm-login-title">내 회사에 딱 맞는 알림을 받아보세요!</h1>
          <p className="type-body-3 text-grayscale-600">로그인하고 실시간 알림으로 확인해 보세요.</p>
          <ButtonLink href="/auth?mode=login&next=%2Falarms">로그인하고 알림 받기</ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section aria-live="polite" className="grid flex-1 place-items-center px-4 py-20 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="type-body-3 text-grayscale-600" role={state.status === "error" ? "alert" : "status"}>
          {state.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 상태를 확인하고 있어요."}
        </p>
        {state.status === "error" && (
          <Button onClick={() => void refresh().catch(() => undefined)} variant="outline">다시 시도하기</Button>
        )}
      </div>
    </section>
  );
}

function AuthenticatedAlarmPage({ getAccessToken, refresh }: AuthAccess) {
  const [page, setPage] = useState<NotificationPage | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [readError, setReadError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [readingIds, setReadingIds] = useState<readonly string[]>([]);
  const [retry, setRetry] = useState(0);
  const pendingReadIds = useRef(new Set<string>());

  useEffect(() => {
    const controller = new AbortController();
    const access = { getAccessToken, refresh };

    void getNotifications(access, 0, controller.signal).then(
      (result) => {
        if (!controller.signal.aborted) setPage(result);
      },
      (error: unknown) => {
        if (!controller.signal.aborted) setLoadError(errorMessage(error));
      },
    );

    return () => controller.abort();
  }, [getAccessToken, refresh, retry]);

  function retryLoad() {
    setLoadError(null);
    setPage(null);
    setRetry((current) => current + 1);
  }

  async function loadMore() {
    if (!page || loadingMore || page.page + 1 >= page.totalPages) return;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const next = await getNotifications({ getAccessToken, refresh }, page.page + 1);
      setPage((current) => {
        if (!current || current.page + 1 !== next.page) return current;
        const ids = new Set(current.items.map((item) => item.id));
        return {
          ...next,
          items: [...current.items, ...next.items.filter((item) => !ids.has(item.id))],
        };
      });
    } catch (error) {
      setMoreError(errorMessage(error));
    } finally {
      setLoadingMore(false);
    }
  }

  async function markAsRead(id: string) {
    const alarm = page?.items.find((item) => item.id === id);
    if (!alarm?.unread || pendingReadIds.current.has(id)) return;

    pendingReadIds.current.add(id);
    setReadingIds((current) => [...current, id]);
    setReadError(null);
    try {
      const updated = await markNotificationRead({ getAccessToken, refresh }, id);
      setPage((current) => current && {
        ...current,
        unreadCount: Math.max(0, current.unreadCount - 1),
        items: current.items.map((item) => item.id === id ? updated : item),
      });
      window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
    } catch (error) {
      setReadError(errorMessage(error));
    } finally {
      pendingReadIds.current.delete(id);
      setReadingIds((current) => current.filter((pendingId) => pendingId !== id));
    }
  }

  if (!page) {
    return (
      <section aria-live="polite" className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="type-body-3 text-grayscale-600" role={loadError ? "alert" : "status"}>
            {loadError ?? "받은 소식을 확인하고 있어요."}
          </p>
          {loadError && <Button onClick={retryLoad} variant="outline">다시 시도하기</Button>}
        </div>
      </section>
    );
  }

  if (page.items.length === 0) return <AlarmEmpty />;

  return (
    <section
      aria-labelledby="alarm-page-title"
      className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-4 pb-24 pt-[30px] sm:px-6 xl:px-0"
      id="alarms-page-top"
    >
      <header className="flex flex-col items-start p-2">
        <div className="flex flex-col gap-2.5">
          <h1 className="type-heading-1 text-grayscale-900" id="alarm-page-title">
            메이트가 사장님의 소식을 가져왔어요!
          </h1>
          <p className="type-heading-10 text-grayscale-600">
            메이트의 소식, 입찰 소식, 사장님의 모든 소식을 한 곳에서
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex min-h-[38px] items-center justify-end">
          {/* TODO: 사용자별 받은 알림 삭제 API가 제공되면 편집·삭제를 서버 상태에 연결한다. */}
          <Button disabled title="알림 삭제 API 준비 중" variant="tertiary">편집 (준비 중)</Button>
        </div>

        {readError && <p className="type-body-7 text-danger" role="alert">{readError}</p>}
        <ul aria-label="받은 소식" className="flex flex-col">
          {page.items.map((alarm, index) => (
            <li key={alarm.id}>
              <AlarmListItem
                alarm={alarm}
                index={index}
                onRead={(id) => void markAsRead(id)}
                pending={readingIds.includes(alarm.id)}
              />
            </li>
          ))}
        </ul>

        {page.page + 1 < page.totalPages && (
          <div className="flex flex-col items-center gap-3">
            {moreError && <p className="type-body-7 text-danger" role="alert">{moreError}</p>}
            <Button disabled={loadingMore} onClick={() => void loadMore()} variant="outline">
              {loadingMore ? "불러오는 중..." : "더 보기"}
            </Button>
          </div>
        )}
      </div>

      {page.items.length >= 4 && (
        <a
          aria-label="알림 페이지 맨 위로 이동"
          className="fixed bottom-[50px] right-[50px] hidden size-16 items-center justify-center rounded-full bg-grayscale-800 text-white sm:inline-flex"
          href="#alarms-page-top"
        >
          <UpArrowIcon className="size-8" aria-hidden />
        </a>
      )}
    </section>
  );
}
