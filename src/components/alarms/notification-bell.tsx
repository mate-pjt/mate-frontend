"use client";

import Image from "next/image";
import Link from "next/link";

import { useNotificationSnapshot } from "@/features/notifications/notification-sync";

export function NotificationBell() {
  const { count, countFailed } = useNotificationSnapshot();
  const label = count ? `미확인 알림 ${count}건, 알람 페이지로 이동` : "알람 페이지로 이동";

  return (
    <Link
      aria-label={countFailed ? `미확인 알림 수 갱신 실패. ${label}` : label}
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
