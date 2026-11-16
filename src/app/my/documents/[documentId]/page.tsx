import type { Metadata } from "next";

import { MyDocumentDetailClient } from "@/components/my/my-document-detail-client";
import { documentListPage } from "@/features/company/document-detail";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "서류 상세", description: "회사 서류의 버전 이력과 원본을 확인합니다.", robots: noIndexRobots };

export default async function MyDocumentDetailPage({ params, searchParams }: {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ version?: string | string[]; page?: string | string[] }>;
}) {
  const [{ documentId }, query] = await Promise.all([params, searchParams]);
  return <MyDocumentDetailClient documentId={documentId} versionId={query.version === undefined ? null : typeof query.version === "string" ? query.version : "invalid"} listPage={documentListPage(query.page)} />;
}
