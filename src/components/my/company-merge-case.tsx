"use client";

import { useState } from "react";

import { StrokeRightArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { canSubmitCompanyMerge, type CompanyMergeAction, type CompanyMergeCase, type CompanyMergeOpening, type CompanyMergeStatus } from "@/data/company/contracts";
import type { CompanyMergeSnapshot } from "@/features/company/company-merge";
import { teamDate } from "@/features/company/team";
import type { MergeDialogIntent } from "./company-merge-dialog";

const openedBy: Record<CompanyMergeOpening, string> = {
  SOURCE_REQUEST: "원본 회사가 검토를 신청했어요.",
  SOURCE_ACCEPTED: "원본 회사가 최초 제안을 수락해 검토가 시작됐어요.",
  TARGET_PROPOSAL_TIMEOUT: "제안 응답 기한이 지나 검토가 자동으로 시작됐어요.",
  IN_PLACE_REGISTRATION: "기존 회사의 인증으로 구성원 검토가 시작됐어요.",
  ADMIN_REVIEW_REQUIRED: "운영 판정에 따라 검토가 다시 시작됐어요.",
};

const closed: Record<Exclude<CompanyMergeStatus, "REVIEW_PENDING">, { label: string; title: string }> = {
  REJECTED: { label: "거절", title: "통합 요청이 거절됐어요." },
  APPEAL_SUBMITTED: { label: "이의제기 접수", title: "이의제기가 접수됐어요." },
  FINALIZED: { label: "통합 완료", title: "회사 통합이 완료됐어요." },
  CLEANUP_PENDING: { label: "정리 대기", title: "통합 사건의 정리가 대기 중이에요." },
  CLEANUP_COMPLETED: { label: "정리 완료", title: "통합 사건의 정리가 끝났어요." },
  VERIFICATION_CANCELLED: { label: "인증 취소", title: "인증이 취소됐어요." },
};

function phase(value: CompanyMergeCase) {
  if (value.status !== "REVIEW_PENDING") return closed[value.status];
  if (value.reviewOpening || value.reviewRequested) return { label: "검토 중", title: "회사 통합을 검토하고 있어요." };
  if (value.proposal && (!value.proposalRound || value.proposalRound.status === "ACTIVE")) return { label: "응답 대기", title: "최초 통합 제안의 응답을 기다리고 있어요." };
  if (value.requestRound?.status === "WITHDRAWN" || value.proposalRound?.status === "WITHDRAWN") return { label: "철회됨", title: "보낸 통합 요청을 철회했어요." };
  return { label: "", title: "기존 팀원과 회사 정보의 통합을 시작할까요?" };
}

function CompanyPair({ value }: { value: CompanyMergeCase }) {
  const company = (label: string, name: string, verified = false) => <div className="flex min-w-0 flex-col items-center gap-1 text-center sm:mx-auto sm:w-fit sm:max-w-full sm:items-start sm:gap-2 sm:text-left">
    <span className={`inline-block rounded-md px-2 py-1 type-body-7 ${verified ? "bg-primary-100 text-primary" : "bg-grayscale-100 text-grayscale-700"}`}>{label}</span>
    <p className="max-w-full break-words text-lg font-bold text-grayscale-800 sm:text-2xl">{name}</p>
  </div>;
  return <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-2xl bg-grayscale-50 p-4 sm:min-h-[114px] sm:grid-cols-3 sm:gap-0 sm:p-6">
    {company("미인증 회사", value.source.name)}
    <StrokeRightArrowIcon className="size-7 justify-self-center text-primary sm:size-10" aria-hidden focusable="false" />
    {company("인증 회사", value.verified.name, true)}
  </div>;
}

function MessageCard({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-grayscale-200 p-4 sm:p-6">
    <p className="mb-2 type-body-7 text-grayscale-600">{label}</p>
    <div className="whitespace-pre-wrap break-words type-body-3 text-grayscale-800">{children}</div>
  </div>;
}

export function CompanyMergeCaseView({ snapshot, onOpen, onReload }: {
  snapshot: CompanyMergeSnapshot;
  onOpen: (intent: MergeDialogIntent) => void;
  onReload: () => void;
}) {
  const [message, setMessage] = useState("");
  const { value, actor } = snapshot;
  const allowed = (kind: CompanyMergeAction["kind"]) => canSubmitCompanyMerge(value, actor.companyId, actor.permissionCodes, kind);
  const compose = allowed("request") ? "request" : allowed("propose") ? "propose" : null;
  const resendKind = allowed("resend-request") ? "resend-request" : allowed("resend-proposal") ? "resend-proposal" : null;
  const withdrawKind = allowed("withdraw-request") ? "withdraw-request" : allowed("withdraw-proposal") ? "withdraw-proposal" : null;
  const canRespond = allowed("accept");
  const pending = value.status === "REVIEW_PENDING";
  const legacy = value.type === "IN_PLACE_MEMBER_REVIEW";
  const { title, label } = phase(value);
  return <>
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3 sm:p-2">
      <div className="min-w-0">
        <h1 className="type-heading-1 text-grayscale-900 max-sm:text-2xl">{legacy ? "기존 회사의 인증 검토" : title}</h1>
        {legacy ? <p className="mt-2 type-body-1 text-grayscale-600">{value.source.name}의 기존 소속을 확인하는 인증 검토예요.</p>
          : value.reviewOpening ? <p className="mt-2 type-body-1 text-grayscale-600">{openedBy[value.reviewOpening.origin]}</p>
            : pending && compose && !value.proposal ? <p className="mt-2 type-body-1 text-grayscale-600">{compose === "request" ? "신청이 접수되면 인증 회사가 검토를 시작해요." : "원본 회사에 최초 제안을 보내고 응답을 기다려요."}</p> : null}
      </div>
      {label && <span className={`rounded-md px-2 py-1 type-body-7 ${value.status === "REJECTED" ? "bg-danger-surface text-danger" : pending ? "bg-warning/10 text-warning" : "bg-grayscale-100 text-grayscale-700"}`}>{label}</span>}
    </div>

    <div className="space-y-4">
      {!legacy && <CompanyPair value={value} />}
      {value.requestMessage !== null && <MessageCard label="검토 신청 메시지">{value.requestMessage}</MessageCard>}
      {value.proposal && <MessageCard label="최초 제안 메시지">{value.proposal.message ?? "전달 메시지 없음"}</MessageCard>}
      {value.proposalResponse?.decision === "DECLINE" && value.rejectionOrigin === "SOURCE_PROPOSAL_DECLINED" &&
        <MessageCard label="원본 회사의 제안 거절 사유">{value.proposalResponse.reason}</MessageCard>}
      <dl className="flex flex-wrap gap-x-8 gap-y-2 type-body-7 text-grayscale-700">
        {value.reviewOpening && <div><dt>검토 개시</dt><dd>{teamDate(value.reviewOpening.openedAt, true)} KST</dd></div>}
        {pending && value.decisionDueAt && <div><dt>{value.reviewOpening || value.reviewRequested ? "검토 결정 기한" : "최초 보호 기한"}</dt><dd>{teamDate(value.decisionDueAt, true)} KST</dd></div>}
        {value.proposal && <div><dt>제안 응답 기한</dt><dd>{teamDate(value.proposal.responseDueAt, true)} KST</dd></div>}
        {value.finalizedAt && <div><dt>통합 확정</dt><dd>{teamDate(value.finalizedAt, true)} KST</dd></div>}
      </dl>
      {canRespond && <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => onOpen({ kind: "decline", roundId: value.proposalRound?.roundId })} variant="gray">제안 거절</Button>
        <Button onClick={() => onOpen({ kind: "accept", roundId: value.proposalRound?.roundId })}>제안 수락</Button>
      </div>}
      {(compose || resendKind) && <div>
        <label className="mb-2 block type-body-2 text-grayscale-800" htmlFor="company-merge-message">{canRespond ? "직접 검토 신청 메시지 (선택)" : "전달 메시지 (선택)"}</label>
        <textarea className="block min-h-[150px] w-full resize-y rounded-lg border border-grayscale-200 px-3 py-3 type-body-3 placeholder:text-grayscale-500 focus-visible:outline-primary"
          id="company-merge-message" value={message} onChange={event => setMessage(event.target.value)} maxLength={1000}
          placeholder="확인이 필요한 내용이나 전달할 말이 있다면 적어 주세요." />
        <div className="mt-6 flex justify-end">
          <Button className="min-h-12 min-w-[180px]" onClick={() => {
            if (resendKind) {
              const round = resendKind === "resend-request" ? value.requestRound : value.proposalRound;
              if (round) onOpen({ kind: resendKind, roundId: round.roundId, commandId: crypto.randomUUID(), message });
            } else if (compose) onOpen({ kind: compose, message });
          }}>{resendKind ? "다시 보내기" : compose === "request" ? "검토 신청하기" : "최초 제안하기"}</Button>
        </div>
      </div>}
      {resendKind && <p className="type-body-7 text-grayscale-600">다시 보내도 기존 마감은 연장되지 않아요.</p>}
      {withdrawKind && <div className="flex justify-end">
        <Button variant="gray" className="min-h-12 min-w-[180px]" onClick={() => {
          const round = withdrawKind === "withdraw-request" ? value.requestRound : value.proposalRound;
          if (round) onOpen({ kind: withdrawKind, roundId: round.roundId });
        }}>요청 취소하기</Button>
      </div>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {!compose && !canRespond && pending && !value.reviewOpening && !value.proposal &&
          <Button onClick={() => onOpen({ kind: "eligibility" })} variant="text_gray" size="xs">통합 자격 확인</Button>}
        <Button onClick={onReload} className="ml-auto" variant="text_gray" size="xs">상태 다시 확인</Button>
      </div>
    </div>
  </>;
}
