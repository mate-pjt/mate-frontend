import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { noIndexRobots } from "@/lib/metadata";

type LegalPageProps = { params: Promise<{ document: string }> };

const agreementDocumentUrls = {
  terms: "https://docs.google.com/document/d/1C71kv7fBE-VaT9l_V-xf66KGYKlyo8VMHmvMqbIhCyc/edit?usp=drivesdk",
  privacy: "https://docs.google.com/document/d/1ujFOkfewn_oa6YOtoKATjkiakpMv2JfUc9d1o5amRjM/edit?usp=drivesdk",
};

export const metadata: Metadata = { title: "메이트 약관", robots: noIndexRobots };

export default async function LegalPage({ params }: LegalPageProps) {
  const { document } = await params;
  if (document !== "terms" && document !== "privacy") notFound();
  redirect(agreementDocumentUrls[document]);
}
