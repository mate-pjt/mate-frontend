import type { Metadata } from "next";

import { AccountSettingsPageClient } from "@/components/my/account-settings-page-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "계정 관리",
  description: "Mate 계정의 연락용 이메일을 확인합니다.",
  robots: noIndexRobots,
};

export default function AccountSettingsPage() {
  return <AccountSettingsPageClient />;
}
