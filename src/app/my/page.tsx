import type { Metadata } from "next";

import { MySettingsHomeClient } from "@/components/my/my-settings-home-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "설정 및 관리",
  description: "Mate 서비스 설정과 관리 메뉴입니다.",
  robots: noIndexRobots,
};

export default function MyPage() {
  return <MySettingsHomeClient />;
}
