import type { Metadata } from "next";

import { MyCompanyClient } from "@/components/my/my-company-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "우리 회사 등록·통합",
  description: "회사를 등록하거나 기존 회사를 찾습니다.",
  robots: noIndexRobots,
};

export default function MyCompanyStartPage() {
  return <MyCompanyClient view="start" />;
}
