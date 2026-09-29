import type { Metadata } from "next";

import { NotificationSettingsPageClient } from "@/components/my/notification-settings-page-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "알림 설정",
  description: "Mate 맞춤 공고 이메일 수신 설정입니다.",
  robots: noIndexRobots,
};

export default function NotificationSettingsPage() {
  return <NotificationSettingsPageClient />;
}
