import type { Metadata } from "next";

import { CompanyMergeClient } from "@/components/my/company-merge-client";
import { noIndexRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "나의 회사 통합", robots: noIndexRobots };

export default function CompanyMergePage() {
  return <CompanyMergeClient />;
}
