"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthSession } from "@/features/auth/session";
import { getUnreadNotificationCount, NOTIFICATIONS_CHANGED_EVENT, type NotificationCountUpdate } from "@/data/notifications/client";

export function NotificationBell() {
  const pathname = usePathname();
  const { state, getAccessToken, refresh, getAccountKey, getSessionEpoch } = useAuthSession();
  const accountId = state.status === "authenticated" ? state.authentication.account.id : null;
  const sessionEpoch = getSessionEpoch();
  const [unread, setUnread] = useState<NotificationCountUpdate | null>(null);

  useEffect(() => {
    if (accountId === null) return;
    const accountKey = String(accountId);
    const controller = new AbortController();
    const current = () => !controller.signal.aborted && getAccountKey() === accountKey && getSessionEpoch() === sessionEpoch;
    let requestVersion = 0;

    function loadCount() {
      if (!current()) return;
      const version = ++requestVersion;
      const assertRequestScope = () => { if (!current()) throw new DOMException("Alarm session ended", "AbortError"); };
      void getUnreadNotificationCount({ getAccessToken, refresh, getAccountKey, assertRequestScope }, controller.signal).then(
        (count) => {
          if (current() && version === requestVersion) setUnread({ accountKey, sessionEpoch, count });
        },
        () => {
          if (current() && version === requestVersion) setUnread(null);
        },
      );
    }

    function syncCount(event: Event) {
      if (!(event instanceof CustomEvent)) { loadCount(); return; }
      const update = event.detail as NotificationCountUpdate | null;
      if (!current() || update?.accountKey !== accountKey || update.sessionEpoch !== sessionEpoch) return;
      requestVersion += 1;
      setUnread(update);
    }

    loadCount();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, syncCount);
    return () => {
      controller.abort();
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, syncCount);
    };
  }, [accountId, pathname, getAccessToken, refresh, getAccountKey, getSessionEpoch, sessionEpoch]);

  const count = accountId !== null && unread?.accountKey === String(accountId) && unread.sessionEpoch === sessionEpoch ? unread.count : null;

  return (
    <Link
      aria-label={count ? `미확인 알림 ${count}건, 알람 페이지로 이동` : "알람 페이지로 이동"}
      className="relative inline-flex size-8 items-center justify-center"
      href="/alarms"
    >
      <Image src="/icon/24dp/alarm.svg" alt="" width={32} height={32} />
      {count !== null && count > 0 && (
        <span aria-hidden className="absolute right-0 top-0 size-2.5 rounded-full bg-primary-400" />
      )}
    </Link>
  );
}
