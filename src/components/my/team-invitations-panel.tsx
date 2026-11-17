"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { showToast } from "@/components/ui/toast";
import type { TeamInvitation, TeamInvitationCommand } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { canManageTeamInvitation, loadTeamInvitations, planTeamInvitationCommand, teamInvitationDeliveryLabel, teamInvitationStatus, type TeamInvitationSnapshot } from "@/features/company/team-invitations";
import { teamDate, teamRoleLabel } from "@/features/company/team";
import type { TeamCommit } from "@/features/company/team-management";
import { TeamInvitationDialog } from "./team-invitation-dialog";
import { TeamInvitationCommandDialog } from "./team-invitation-command-dialog";
import { useTeamInvitationClock } from "./use-team-invitation-clock";

type Result = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; value: TeamInvitationSnapshot };
export function TeamInvitationsPanel({ companyId, access, getSessionEpoch, onCommitted, onAccessError }: {
  companyId: number; access: AuthAccess; getSessionEpoch: () => number; onCommitted: (value: TeamCommit) => void; onAccessError: (error: ApiError) => void;
}) {
  const [result, setResult] = useState<Result>({ status: "loading" }), [page, setPage] = useState(0), [attempt, setAttempt] = useState(0);
  const [opened, setOpened] = useState<{ snapshot: TeamInvitationSnapshot; detail?: TeamInvitation; action?: TeamInvitationCommand } | null>(null);
  const clock = useTeamInvitationClock(result.status === "ready" ? result.value.page.content.map(v => v.expiresAt) : []);
  const active = useRef<AbortController | null>(null), [detailId, setDetailId] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null), focusAfterLoad = useRef(false);
  const { getAccessToken, getAccountKey, refresh } = access;

  useEffect(() => {
    const controller = new AbortController(), epoch = getSessionEpoch(); active.current = controller;
    void loadTeamInvitations({ getAccessToken, getAccountKey, refresh }, companyId, page, controller.signal, undefined, () => epoch === getSessionEpoch()).then(value => {
      if (!controller.signal.aborted && epoch === getSessionEpoch()) setResult({ status: "ready", value });
    }).catch(reason => {
      if (controller.signal.aborted || epoch !== getSessionEpoch()) return;
      if (reason instanceof ApiError && [401, 403, 404].includes(reason.status)) onAccessError(reason);
      else setResult({ status: "error", message: errorMessage(reason) });
    });
    return () => { controller.abort(); };
  }, [companyId, page, attempt, getAccessToken, getAccountKey, refresh, getSessionEpoch, onAccessError]);
  useEffect(() => { if (result.status !== "loading" && focusAfterLoad.current) { heading.current?.focus(); focusAfterLoad.current = false; } }, [result]);
  function reload(next = page) { active.current?.abort(); setOpened(null); setDetailId(null); setResult({ status: "loading" }); focusAfterLoad.current = true; setPage(next); setAttempt(value => value + 1); }
  async function detail(id: number, action?: TeamInvitationCommand) {
    if (detailId !== null || result.status !== "ready") return;
    const controller = new AbortController(), epoch = getSessionEpoch(); active.current?.abort(); active.current = controller; setDetailId(id);
    try {
      const value = await loadTeamInvitations(access, companyId, page, controller.signal, undefined, () => epoch === getSessionEpoch(), id);
      if (!controller.signal.aborted && epoch === getSessionEpoch()) { setResult({ status: "ready", value }); setOpened({ snapshot: value, detail: value.detail, action }); }
    } catch (reason) {
      if (controller.signal.aborted || epoch !== getSessionEpoch()) return;
      if (reason instanceof ApiError && [401, 403].includes(reason.status)) onAccessError(reason);
      else setResult({ status: "error", message: errorMessage(reason) });
    } finally { if (!controller.signal.aborted && epoch === getSessionEpoch()) setDetailId(null); }
  }
  useEffect(() => () => active.current?.abort(), []);
  function committed(value: TeamInvitation, action?: TeamInvitationCommand) {
    const message = action === "cancel" ? "보낸 초대를 취소했어요." : action === "resend" ? "초대 재발송을 요청했어요." : "팀원 초대를 만들었어요.";
    onCommitted({ ended: false, message: action === "cancel" ? message : `${message} ${teamInvitationDeliveryLabel(value.delivery.status)} · 상대방 수락과 실제 메일 도착은 별도로 확인해 주세요.` });
    showToast(message); reload(0);
  }
  return <section className="mb-8 rounded-[20px] border border-grayscale-200 bg-white p-4 sm:p-6" aria-label="보낸 팀원 초대">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="type-heading-7 text-grayscale-800 focus:outline-none" ref={heading} tabIndex={-1}>보낸 초대{result.status === "ready" ? ` ${result.value.page.totalElements}` : ""}</h2>
      <div className="flex flex-wrap gap-2"><Button variant="text_gray" size="xs" onClick={() => reload()} disabled={result.status === "loading" || opened !== null || detailId !== null}>초대 상태 확인</Button>
        {result.status === "ready" && <Button size="lg" onClick={() => setOpened({ snapshot: result.value })} disabled={!result.value.page.capabilities.canInvite || detailId !== null}
          title={!result.value.page.capabilities.canInvite ? "현재 초대 권한이 없어요." : undefined}>새 팀원 초대하기</Button>}</div>
    </div>
    {result.status === "loading" && <p role="status" className="py-6 type-body-3 text-grayscale-600">보낸 초대를 확인하고 있어요.</p>}
    {result.status === "error" && <div role="alert" className="space-y-3 py-4 type-body-3 text-grayscale-700"><p>{result.message}</p><p className="type-body-7">조회 결과를 확인한 뒤 새 초대를 작성해 주세요.</p><Button variant="outline" onClick={() => reload()}>다시 조회하기</Button></div>}
    {result.status === "ready" && <>
      <p className="mb-4 type-body-7 text-grayscale-600">상대가 이메일을 확인하고 수락하면 팀원으로 합류해요. 메일 전송 처리 완료와 수신함 도착은 별개예요.</p>
      {!result.value.page.capabilities.canInvite && <p className="mb-4 type-body-7 text-grayscale-600">초대를 조회할 수 있지만 현재 초대할 권한은 없어요.</p>}
      {result.value.page.content.length ? <ul className="space-y-3">{result.value.page.content.map(v => <li key={v.invitationId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-grayscale-50 p-4">
        <div className="min-w-0 flex-1"><p className="break-all type-body-1 text-grayscale-800">{v.inviteeDisplayName} <span className="ml-2 type-body-7 text-primary-400">{teamInvitationStatus(v, clock)}</span></p>
          <p className="mt-1 break-all type-body-7 text-grayscale-600">{v.invitedEmail}</p><p className="mt-2 type-body-7 text-grayscale-600">{v.position?.name ?? "직급 미제공"} · {teamRoleLabel(v.role)} · {teamDate(v.createdAt)} 초대</p>
          <p className="mt-1 type-body-7 text-grayscale-600">{teamDate(v.expiresAt, true)} 만료 · {teamInvitationDeliveryLabel(v.delivery.status)}</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" size="xs" disabled={detailId !== null} aria-label={`${v.inviteeDisplayName} 초대 정보 보기`} onClick={() => void detail(v.invitationId)}>{detailId === v.invitationId ? "확인 중…" : "초대 정보 보기"}</Button>
          {canManageTeamInvitation(v, clock) ? (["cancel", "resend"] as const).map(action => {
            return <InvitationCommandButton key={action} snapshot={result.value} value={v} action={action} now={clock} disabled={detailId !== null} onCommand={detail} />;
          }) : (v.status === "EXPIRED" || v.status === "PENDING") && <Button variant="outline" size="xs" disabled={!result.value.page.capabilities.canInvite || detailId !== null}
            onClick={() => setOpened({ snapshot: result.value })}>새 초대 작성</Button>}
        </div>
      </li>)}</ul> : <div className="py-8 text-center"><p className="type-heading-7 text-grayscale-800">{result.value.page.totalElements ? "이 페이지에는 보낸 초대가 없어요." : "보낸 초대가 없어요."}</p>
        {result.value.page.totalElements > 0 && <Button className="mt-4" variant="outline" onClick={() => reload(0)}>첫 초대 페이지로 돌아가기</Button>}</div>}
      {result.value.page.totalPages > 1 && result.value.page.content.length > 0 && <div className="mt-5 flex justify-center"><Pagination ariaLabel="보낸 초대 페이지" page={page + 1} totalPages={result.value.page.totalPages} onPageChange={value => reload(value - 1)} /></div>}
    </>}
    {opened?.action === "cancel" ? <TeamInvitationCommandDialog snapshot={opened.snapshot} action="cancel" access={access} getSessionEpoch={getSessionEpoch} onClose={() => setOpened(null)} onCommitted={committed}
      onRecheck={() => { const id = opened.detail!.invitationId; setOpened(null); void detail(id); }} onAccessError={onAccessError} />
      : opened && <TeamInvitationDialog snapshot={opened.snapshot} detail={opened.action === "resend" ? undefined : opened.detail} resend={opened.action === "resend" ? opened.detail : undefined} access={access} getSessionEpoch={getSessionEpoch}
        onEdited={() => onCommitted({ ended: false, message: "초대 정보를 저장했어요. 재발송 결과는 아직 확인 전이에요." })}
        onClose={() => { setOpened(null); reload(); }} onCommitted={value => committed(value, opened.action)} onAccessError={onAccessError} />}
  </section>;
}

function InvitationCommandButton({ snapshot, value, action, now, disabled, onCommand }: {
  snapshot: TeamInvitationSnapshot; value: TeamInvitation; action: TeamInvitationCommand; now: number; disabled: boolean; onCommand: (id: number, action: TeamInvitationCommand) => void;
}) {
  let reason = "";
  try { planTeamInvitationCommand(snapshot, value, "cancel", now); } catch (error) { reason = errorMessage(error); }
  return <Button variant={action === "cancel" ? "danger" : "gray"} size="xs" disabled={disabled || !!reason} title={reason || undefined}
    aria-label={`${value.inviteeDisplayName} 초대 ${action === "cancel" ? "취소" : "재발송"}`} onClick={() => onCommand(value.invitationId, action)}>{action === "cancel" ? "초대 취소" : "재발송"}</Button>;
}
