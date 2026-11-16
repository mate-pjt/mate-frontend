import type { Metadata } from "next";

import { MyDocumentsClient } from "@/components/my/my-documents-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "서류함",
  description: "회사 서류의 보유 및 처리 상태를 확인합니다.",
  robots: noIndexRobots,
};

export default function MyDocumentsPage() {
  return <MyDocumentsClient />;
}
