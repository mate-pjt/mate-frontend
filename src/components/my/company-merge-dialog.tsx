"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { normalizeCompanyMergeAction, type CompanyMergeAction } from "@/data/company/contracts";
import { errorMessage } from "@/data/shared/errors";

export type MergeDialogIntent = Exclude<CompanyMergeAction, { kind: "decline" }> | { kind: "decline"; roundId?: number } | { kind: "eligibility" };

const copy = {
  "withdraw-request": { title: "검토 신청을 철회할까요?", description: "검토 신청을 철회해요. 이전 통합 제안은 다시 활성화되지 않아요.", submit: "신청 철회하기" },
  "withdraw-proposal": { title: "통합 제안을 철회할까요?", description: "이 제안에 더 이상 응답할 수 없어요. 이전 발송 기록은 남아요.", submit: "제안 철회하기" },
  "resend-request": { title: "검토 신청을 다시 보낼까요?", description: "새 발송으로 기록되며 기존 마감은 연장되지 않아요.", submit: "다시 보내기" },
  "resend-proposal": { title: "통합 제안을 다시 보낼까요?", description: "새 발송으로 기록되며 기존 응답 마감은 연장되지 않아요.", submit: "다시 보내기" },
  request: { title: "검토를 신청할까요?", description: "인증 회사에 검토 신청을 보내요. 검토는 접수 후 시작돼요.", submit: "검토 신청 보내기" },
  propose: { title: "최초 통합 제안을 보낼까요?", description: "원본 회사에 제안을 보내고 응답을 기다려요.", submit: "최초 제안 보내기" },
  accept: { title: "통합 제안을 수락할까요?", description: "수락하면 검토가 시작돼요. 팀원과 회사 정보의 이전은 검토와 별도 확정이 필요해요.", submit: "제안 수락하기" },
  decline: { title: "통합 제안을 거절할까요?", description: "거절 사유가 인증 회사에 전달돼요.", submit: "제안 거절하기" },
  eligibility: { title: "회사 통합 자격 확인", description: "같은 사업자번호의 미인증 회사와 인증 회사가 현재 통합 사건으로 연결돼야 해요. 신청·제안·응답은 현재 회사에서 해당 권한이 있는 구성원이 할 수 있어요.", submit: "확인" },
};

export function CompanyMergeDialog({ intent, pending, close, submit }: {
  intent: MergeDialogIntent;
  pending: boolean;
  close: () => void;
  submit: (action: CompanyMergeAction) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  function dismiss() {
    dialog.current?.close();
    close();
  }
  const { title, description, submit: label } = copy[intent.kind];
  return (
    <dialog ref={dialog} aria-labelledby="merge-dialog-title" aria-describedby="merge-dialog-description" aria-busy={pending}
      className="m-auto max-h-[90dvh] w-[calc(100vw-2rem)] max-w-[420px] overflow-auto rounded-3xl border border-grayscale-200 bg-basic-white p-6 backdrop:bg-grayscale-900/50"
      onCancel={event => { event.preventDefault(); if (!pending) dismiss(); }}>
      <form onSubmit={event => {
        event.preventDefault();
        if (pending) return;
        if (intent.kind === "eligibility") { dismiss(); return; }
        try { submit(normalizeCompanyMergeAction(intent.kind === "decline" ? { ...intent, reason } : intent)); }
        catch (cause) { setError(errorMessage(cause)); }
      }}>
        <h2 className="type-heading-7 text-grayscale-800" id="merge-dialog-title">{title}</h2>
        <p className="mt-2 type-body-3 text-grayscale-700" id="merge-dialog-description">{description}</p>
        {intent.kind === "decline" && <div className="mt-5">
          <label className="type-body-2 text-grayscale-800" htmlFor="merge-decline-reason">거절 사유</label>
          <textarea id="merge-decline-reason" aria-invalid={error !== null} aria-describedby={error ? "merge-decline-error" : undefined}
            className="mt-2 block min-h-28 w-full resize-y rounded-lg border border-grayscale-200 p-3 type-body-3 focus-visible:outline-primary" value={reason}
            onChange={event => { setReason(event.target.value); setError(null); }} required maxLength={500} disabled={pending} />
        </div>}
        {error && <p role="alert" id="merge-decline-error" className="mt-2 type-body-7 text-danger">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {intent.kind !== "eligibility" && <Button disabled={pending} onClick={dismiss} variant="gray">돌아가기</Button>}
          <Button type="submit" disabled={pending}>{pending ? "처리하고 있어요…" : label}</Button>
        </div>
      </form>
    </dialog>
  );
}
