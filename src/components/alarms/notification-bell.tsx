"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthSession } from "@/features/auth/session";
import { getUnreadNotificationCount, NOTIFICATIONS_CHANGED_EVENT } from "@/features/notifications/api";

export function NotificationBell() {
  const pathname = usePathname();
  const { state, getAccessToken, refresh } = useAuthSession();
  const accountId = state.status === "authenticated" ? state.authentication.account.id : null;
  const [unread, setUnread] = useState<{ accountId: number; count: number } | null>(null);

  useEffect(() => {
    if (accountId === null) return;
    const currentAccountId = accountId;
    const controller = new AbortController();
    let requestVersion = 0;

    function loadCount() {
      const version = ++requestVersion;
      void getUnreadNotificationCount({ getAccessToken, refresh }, controller.signal).then(
        (count) => {
          if (!controller.signal.aborted && version === requestVersion) setUnread({ accountId: currentAccountId, count });
        },
        () => {
          if (!controller.signal.aborted && version === requestVersion) setUnread(null);
        },
      );
    }

    loadCount();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, loadCount);
    return () => {
      controller.abort();
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, loadCount);
    };
  }, [accountId, pathname, getAccessToken, refresh]);

  const count = unread?.accountId === accountId ? unread.count : null;

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
