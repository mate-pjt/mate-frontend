import type { Metadata } from "next";

import { MyDocumentsClient } from "@/components/my/my-documents-client";
import { noIndexRobots } from "@/lib/metadata";
import { documentListPage } from "@/features/company/document-detail";

export const metadata: Metadata = {
  title: "서류함",
  description: "회사 서류의 보유 및 처리 상태를 확인합니다.",
  robots: noIndexRobots,
};

export default async function MyDocumentsPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const query = await searchParams;
  return <MyDocumentsClient initialPage={documentListPage(query.page)} />;
}
