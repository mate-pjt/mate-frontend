import type { Metadata } from "next";

import { MyCompanyClient } from "@/components/my/my-company-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "나의 회사 정보",
  description: "연결된 회사와 소속 신청 상태를 확인합니다.",
  robots: noIndexRobots,
};

export default function MyCompanyPage() {
  return <MyCompanyClient view="overview" />;
}
