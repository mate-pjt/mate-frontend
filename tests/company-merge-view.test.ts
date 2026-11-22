import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CompanyMergeCaseView } from "@/components/my/company-merge-case";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { access, mockRuntime } from "./helpers";

it("철회한 신청 이력보다 현재 활성 제안의 응답 대기를 표시한다", async () => {
  const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "merge-proposal" }));
  const value = (await repo.getCurrentCompanyMergeCase(access, 7002))!;
  value.requestRound = { roundId: 3, status: "WITHDRAWN", message: "과거 합성 신청", sentAt: value.proposal!.proposedAt };
  const actor = await repo.getCurrentCompanyPermissions(access, 7002);
  const html = renderToStaticMarkup(createElement(CompanyMergeCaseView, {
    snapshot: { status: "case", value, actor }, onOpen: () => {}, onReload: () => {},
  }));
  expect(html).toContain("응답 대기");
  expect(html).toContain("제안 수락");
  expect(html).not.toContain("보낸 통합 요청을 철회했어요");
});
