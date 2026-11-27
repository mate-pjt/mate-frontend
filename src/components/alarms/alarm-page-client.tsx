"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { UpArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { BasicPopup } from "@/components/ui/popup";
import { showToast } from "@/components/ui/toast";
import { errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import { createNotificationActivationController } from "@/features/notifications/activation-controller";
import { useNotificationSnapshot, useNotificationSync } from "@/features/notifications/notification-sync";
import { uniqueNotifications, type InboxSubscription } from "@/features/notifications/refresh-controller";
import type { AlarmNotification } from "@/types/alarm";
import {
  deleteNotifications,
  getNotifications,
  markNotificationRead,
  MAX_NOTIFICATION_SELECTION,
  NOTIFICATIONS_CHANGED_EVENT,
  type NotificationDeletion,
  type NotificationPage,
} from "@/data/notifications/client";

import { AlarmEmpty } from "./alarm-empty";
import { AlarmListItem } from "./alarm-list-item";

const allDeletionDescription = "아직 불러오지 않은 소식도 함께 삭제돼요.";

export function AlarmPageClient() {
  const { state, getAccessToken, refresh, getAccountKey, getSessionEpoch } = useAuthSession();
  const { scope, requiresLogin, countFailed } = useNotificationSnapshot();

  if (state.status === "authenticated" && scope?.accountKey === String(state.authentication.account.id) && !requiresLogin) {
    return (
      <AuthenticatedAlarmPage
        countFailed={countFailed}
        getAccessToken={getAccessToken}
        getAccountKey={getAccountKey}
        getSessionEpoch={getSessionEpoch}
        key={`${scope.accountKey}:${scope.epoch}`}
        refresh={refresh}
      />
    );
  }

  if (state.status === "anonymous" || requiresLogin) {
    return (
      <section aria-labelledby="alarm-login-title" className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex max-w-[420px] flex-col items-center gap-5">
          <h1 className="type-heading-7 text-grayscale-800" id="alarm-login-title">내 회사에 딱 맞는 알림을 받아보세요!</h1>
          <p className="type-body-3 text-grayscale-600">로그인하고 받은 알림을 확인해 보세요.</p>
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

type InboxScope = {
  access: AuthAccess;
  signal: AbortSignal;
  current: () => boolean;
  inbox: InboxSubscription;
  lastPage: number;
  reading: boolean;
  busy: boolean;
  dismissToast?: () => void;
};

function appendPage(current: NotificationPage, next: NotificationPage): NotificationPage {
  return { ...next, items: uniqueNotifications([...current.items, ...next.items]) };
}

function setBusy(scope: InboxScope, busy: boolean) {
  scope.busy = busy;
  scope.inbox.setBusy(busy || scope.reading);
}

function AuthenticatedAlarmPage({ getAccessToken, refresh, getAccountKey, getSessionEpoch, countFailed }:
  AuthAccess & { getSessionEpoch: () => number; countFailed: boolean }) {
  const router = useRouter();
  const { controller: notifications, connectionRejected, retry } = useNotificationSync();
  const [page, setPage] = useState<NotificationPage | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [readError, setReadError] = useState<{ message: string; alarm: AlarmNotification } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [readingIds, setReadingIds] = useState<readonly string[]>([]);
  const [editing, setEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [deleting, setDeleting] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  const activation = useRef<ReturnType<typeof createNotificationActivationController> | null>(null);
  const lifetime = useRef<InboxScope | null>(null);
  const readVersion = useRef(0);
  const refreshingDeletion = useRef(false);
  const confirmAllRef = useRef<HTMLDialogElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);
  const selectAllRef = useRef<HTMLButtonElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const emptyRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const scrollAnchor = useRef<{ id?: string; top?: number; scrollY: number } | null>(null);
  const restoreFocus = useRef(false);

  useLayoutEffect(() => {
    const accountKey = getAccountKey();
    if (accountKey === null) return;
    const sessionEpoch = getSessionEpoch();
    const abort = new AbortController();
    const current = () => !abort.signal.aborted && getAccountKey() === accountKey && getSessionEpoch() === sessionEpoch && !notifications.getSnapshot().requiresLogin;
    const access = { getAccessToken, refresh, getAccountKey, assertRequestScope: () => {
      if (!current()) throw new DOMException("Alarm session ended", "AbortError");
    } };
    const inbox = notifications.attachInbox({
      lastPage: () => scope.lastPage,
      apply(list, count) {
        if (!current()) return;
        if (refreshingDeletion.current && (list.status === "rejected" || count.status === "rejected")) {
          setLoadError("삭제 결과는 받았지만 최신 소식이나 미확인 건수를 불러오지 못했어요.");
          return;
        }
        if (list.status === "rejected") {
          setLoadError(errorMessage(list.reason));
          return;
        }
        if (!refreshingDeletion.current && listRef.current && window.scrollY > 0) {
          const firstVisible = Array.from(listRef.current.children).find((row) => row.getBoundingClientRect().bottom > 0);
          scrollAnchor.current = {
            id: firstVisible?.getAttribute("data-alarm-id") ?? undefined,
            top: firstVisible?.getBoundingClientRect().top,
            scrollY: window.scrollY,
          };
        }
        refreshingDeletion.current = false;
        scope.lastPage = list.value.page;
        setPage(list.value);
        setLoadError(null);
        setSelectedIds((ids) => {
          if (ids.size === 0) return ids;
          const selected = new Set(list.value.items.filter(({ id }) => ids.has(id)).map(({ id }) => id));
          return selected.size === ids.size ? ids : selected;
        });
      },
    });
    const scope: InboxScope = { signal: abort.signal, access, current, inbox, lastPage: 0, reading: false, busy: false };
    lifetime.current = scope;
    const controller = createNotificationActivationController({
      getAccountKey: () => current() ? accountKey : null,
      markRead: (id) => markNotificationRead(access, id, scope.signal),
      onRead: (updated) => {
        readVersion.current += 1;
        setPage((current) => current && {
          ...current,
          unreadCount: Math.max(0, current.unreadCount - (current.items.some((item) => item.id === updated.id && item.unread) ? 1 : 0)),
          items: current.items.map((item) => item.id === updated.id ? updated : item),
        });
        window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
      },
      onPending: (ids) => {
        scope.reading = ids.length > 0;
        scope.inbox.setBusy(scope.busy || scope.reading);
        setReadingIds(ids);
      },
      onNotice: setNotice,
      onError: (error, alarm) => setReadError({ message: errorMessage(error), alarm }),
      clearError: () => setReadError(null),
      navigate: (path) => router.push(path),
    });
    activation.current = controller;
    return () => {
      abort.abort();
      inbox.dispose();
      controller.dispose();
      scope.dismissToast?.();
      activation.current = null;
      lifetime.current = null;
    };
  }, [getAccessToken, refresh, getAccountKey, getSessionEpoch, notifications, router]);

  useLayoutEffect(() => {
    const anchor = scrollAnchor.current;
    if (!anchor) return;
    scrollAnchor.current = null;
    const row = listRef.current && Array.from(listRef.current.children).find((item) => item.getAttribute("data-alarm-id") === anchor.id);
    const top = row && anchor.top !== undefined ? window.scrollY + row.getBoundingClientRect().top - anchor.top : anchor.scrollY;
    window.scrollTo({ top, behavior: "instant" });
  }, [page]);

  useEffect(() => {
    if (!restoreFocus.current) return;
    const selectAll = selectAllRef.current;
    const target = (editing && selectAll && !selectAll.disabled ? selectAll : editRef.current) ?? emptyRef.current ?? retryRef.current;
    if (!target) return;
    restoreFocus.current = false;
    target.focus();
  }, [editing, page, loadError]);

  function retryLoad() {
    const scope = lifetime.current;
    if (!scope?.current() || scope.busy) return;
    restoreFocus.current = true;
    retry();
  }

  async function loadMore() {
    const scope = lifetime.current;
    if (!page || page.page + 1 >= page.totalPages || !scope?.current() || scope.busy) return;
    setBusy(scope, true);
    const version = readVersion.current;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const next = await getNotifications(scope.access, page.page + 1, scope.signal);
      if (!scope.current()) return;
      if (next.page >= next.totalPages) {
        notifications.request();
        return;
      }
      scope.lastPage = next.page;
      setPage((current) => {
        if (!current || current.page + 1 !== next.page) return current;
        return {
          ...appendPage(current, next),
          unreadCount: version === readVersion.current ? next.unreadCount : current.unreadCount,
        };
      });
    } catch (error) {
      if (scope.current()) setMoreError(errorMessage(error));
    } finally {
      setBusy(scope, false);
      if (scope.current()) setLoadingMore(false);
    }
  }

  function toggleEditing() {
    const scope = lifetime.current;
    if (!scope?.current() || scope.reading || deleting) return;
    if (!editing) {
      scope.dismissToast?.();
      scope.dismissToast = undefined;
    }
    restoreFocus.current = true;
    setEditing(!editing);
    setSelectedIds(new Set());
    setNotice(null);
    setReadError(null);
    setDeletionError(null);
  }

  function toggleSelection(id: string) {
    setSelectedIds((selection) => {
      const next = new Set(selection);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_NOTIFICATION_SELECTION) next.add(id);
      return next;
    });
  }

  async function submitDeletion(deletion: NotificationDeletion) {
    const scope = lifetime.current;
    if (!page || !editing || !scope?.current() || scope.busy || scope.reading) return;
    setBusy(scope, true);
    setDeleting(true);
    setDeletionError(null);
    try {
      const result = await deleteNotifications(scope.access, deletion, scope.signal);
      if (!scope.current()) return;

      if (result.deletedCount > 0) {
        const message = deletion.scope === "ALL" ? "소식을 삭제했어요!"
          : result.deletedCount === deletion.notificationIds.length ? "선택한 소식을 삭제했어요!"
          : `선택한 소식 중 ${result.deletedCount}개를 삭제했어요.`;
        scope.dismissToast = showToast(message);
      }
      setNotice(result.deletedCount === 0 ? "삭제할 소식이 없어요. 최신 목록을 확인해 주세요." : null);
      setEditing(false);
      setSelectedIds(new Set());
      setMoreError(null);
      setLoadError(null);
      setPage(null);
      restoreFocus.current = true;
      refreshingDeletion.current = true;
      scope.inbox.discardCount();
      notifications.request();
    } catch (error) {
      if (scope.current()) setDeletionError(errorMessage(error));
    } finally {
      setBusy(scope, false);
      if (scope.current()) setDeleting(false);
    }
  }

  const refreshError = loadError ?? (countFailed ? "미확인 알림 수를 갱신하지 못했어요." : null);
  const refreshFeedback = (refreshError || connectionRejected) && (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2">
      {refreshError && <p className="type-body-7 text-danger" role="alert">{refreshError}</p>}
      {connectionRejected && <p className="type-body-7 text-grayscale-600" role="status">알림 자동 갱신에 연결하지 못했어요.</p>}
      <Button disabled={deleting || loadingMore} onClick={retryLoad} ref={retryRef} variant="outline">다시 시도하기</Button>
    </div>
  );

  if (!page) {
    return (
      <section aria-live="polite" className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          {!loadError && <p className="type-body-3 text-grayscale-600" role="status">받은 소식을 확인하고 있어요.</p>}
          {refreshFeedback}
        </div>
      </section>
    );
  }

  if (page.items.length === 0) return <>{refreshFeedback}<AlarmEmpty focusRef={emptyRef} /></>;

  const loadedIds = page.items.map((item) => item.id);
  const allLoadedSelected = loadedIds.every((id) => selectedIds.has(id));
  const canSelectAllLoaded = loadedIds.length <= MAX_NOTIFICATION_SELECTION;

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
        {refreshFeedback}
        <div className="flex min-h-[38px] flex-wrap items-center justify-end gap-2">
          {editing ? (
            <>
              <div className="mr-auto flex flex-wrap items-center gap-2">
                <Button aria-label={allLoadedSelected ? "선택 해제" : "불러온 소식 전체선택"} disabled={deleting || !canSelectAllLoaded}
                  onClick={() => setSelectedIds(new Set(allLoadedSelected ? [] : loadedIds))} ref={selectAllRef} variant="outline">
                  {allLoadedSelected ? "선택 해제" : "전체선택"}
                </Button>
                <Button disabled={deleting || loadingMore} onClick={() => confirmAllRef.current?.showModal()} variant="tertiary">모든 소식 삭제</Button>
              </div>
              <span className="type-body-7 text-grayscale-600" role="status">{selectedIds.size}개 선택</span>
              <Button aria-label="선택한 소식 삭제" disabled={deleting || loadingMore || selectedIds.size === 0}
                onClick={() => void submitDeletion({ scope: "SELECTED", notificationIds: [...selectedIds] })} variant="danger">
                {deleting ? "삭제 중…" : "삭제"}
              </Button>
              <Button disabled={deleting} onClick={toggleEditing} ref={editRef}>완료</Button>
            </>
          ) : (
            <Button disabled={readingIds.length > 0} onClick={toggleEditing} ref={editRef} variant="tertiary">편집</Button>
          )}
        </div>

        {editing && !canSelectAllLoaded && <p className="type-body-7 text-grayscale-600">한 번에 최대 {MAX_NOTIFICATION_SELECTION}개까지 선택할 수 있어요.</p>}
        {deletionError && <p className="type-body-7 text-danger" role="alert">{deletionError}</p>}
        {notice && <p className="type-body-7 text-grayscale-600" role="status">{notice}</p>}
        {readError && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="type-body-7 text-danger" role="alert">{readError.message}</p>
            <Button onClick={() => void activation.current?.activate(readError.alarm)} variant="outline">다시 시도하기</Button>
          </div>
        )}
        <ul aria-label="받은 소식" className="flex flex-col" ref={listRef}>
          {page.items.map((alarm, index) => (
            <li data-alarm-id={alarm.id} key={alarm.id}>
              <AlarmListItem
                alarm={alarm}
                index={index}
                onActivate={(alarm) => void activation.current?.activate(alarm)}
                pending={readingIds.includes(alarm.id)}
                selection={editing ? {
                  checked: selectedIds.has(alarm.id),
                  disabled: deleting || (selectedIds.size >= MAX_NOTIFICATION_SELECTION && !selectedIds.has(alarm.id)),
                  toggle: () => toggleSelection(alarm.id),
                } : undefined}
              />
            </li>
          ))}
        </ul>

        {page.page + 1 < page.totalPages && (
          <div className="flex flex-col items-center gap-3">
            {moreError && <p className="type-body-7 text-danger" role="alert">{moreError}</p>}
            <Button disabled={loadingMore || deleting} onClick={() => void loadMore()} variant="outline">
              {loadingMore ? "불러오는 중..." : "더 보기"}
            </Button>
          </div>
        )}
      </div>

      {editing && (
        <dialog aria-describedby="alarm-all-deletion-description" aria-label="모든 소식 삭제 확인" ref={confirmAllRef}
          className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[420px] overflow-y-auto border-0 bg-transparent p-0 text-grayscale-800 backdrop:bg-grayscale-900/50">
          <p className="sr-only" id="alarm-all-deletion-description">{allDeletionDescription}</p>
          <BasicPopup className="max-w-full" title="받은 소식을 모두 삭제할까요?"
            description={allDeletionDescription}
            onClose={() => confirmAllRef.current?.close()}
            secondaryAction={{ label: "돌아가기", onClick: () => confirmAllRef.current?.close() }}
            primaryAction={{ label: "모든 소식 삭제", tone: "danger", onClick: () => {
              confirmAllRef.current?.close();
              void submitDeletion({ scope: "ALL" });
            } }} />
        </dialog>
      )}

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
