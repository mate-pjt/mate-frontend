"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { showToast } from "@/components/ui/toast";
import type { CompanyPermissionCatalog, CompanyTeamMember, TeamChangeRequest, TeamChangeStatus } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import { teamDate, teamMemberName } from "@/features/company/team";
import { createTeamCommandScope, loadTeamChanges, teamChangeKindLabel, teamChangePath, teamChangeStatusLabel, teamCommitToast, type TeamChanges, type TeamCommit } from "@/features/company/team-management";
import { MySideMenu } from "./my-side-menu";
import { TeamConfirmDialog } from "./team-confirm-dialog";

const statuses: TeamChangeStatus[] = ["PENDING", "APPLIED", "REJECTED", "CANCELED", "INVALIDATED"];
export function teamChangesListPath(scope: "mine" | "company", page = 1, status?: TeamChangeStatus) {
  const params = new URLSearchParams(); if (scope === "company") params.set("scope", scope); if (page > 1) params.set("page", String(page)); if (status) params.set("status", status);
  return `${teamChangePath()}${params.size ? `?${params}` : ""}`;
}
type Props = { page: number | null; scope: "mine" | "company" | null; status?: TeamChangeStatus | null; requestId?: number | null };
export function TeamChangeRequestsClient(props: Props) {
  const session = useAuthSession();
  const [committed, setCommitted] = useState<(TeamCommit & { epoch: number; account: string | null }) | null>(null);
  const visible = committed && committed.epoch === session.getSessionEpoch() && (committed.account === session.getAccountKey() || session.getAccountKey() === null);
  const valid = props.page !== null && props.scope !== null && props.status !== null && props.requestId !== null;
  const next = props.requestId ? teamChangePath(props.requestId) : teamChangesListPath(props.scope ?? "mine", props.page ?? 1, props.status ?? undefined);
  return <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1732px] flex-col gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:gap-6"><MySideMenu value="team" /><section className="min-w-0 max-w-[1180px] flex-1">
    {visible && <div className="mb-4 rounded-2xl bg-primary-100 p-4 type-body-5 text-grayscale-800" role="status"><p>{committed.message}</p><p className="mt-2 type-body-7">확인된 처리 결과와 최신 조회·로그인 상태는 별도로 확인해 주세요.</p></div>}
    {!valid ? <Notice message="변경 요청 주소와 페이지 정보를 확인해 주세요."><ButtonLink href={teamChangePath()} variant="outline">내 요청으로 돌아가기</ButtonLink></Notice>
      : session.state.status === "authenticated" ? <AuthenticatedRequests key={`${session.getAccountKey()}:${session.getSessionEpoch()}:${session.state.authentication.companyContext?.companyId ?? "none"}:${next}`}
        access={{ getAccountKey: session.getAccountKey, getAccessToken: session.getAccessToken, refresh: session.refresh }} getSessionEpoch={session.getSessionEpoch}
        page={props.page!} scope={props.scope!} status={props.status ?? undefined} requestId={props.requestId ?? undefined}
        onCommitted={value => setCommitted({ ...value, account: session.getAccountKey(), epoch: session.getSessionEpoch() })} />
        : <Notice message={session.state.status === "anonymous" ? "로그인하면 본인에게 온 변경 요청을 확인할 수 있어요." : session.state.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 상태를 확인하고 있어요."}>
          {session.state.status === "anonymous" ? <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(next)}`}>로그인하고 돌아오기</ButtonLink> : session.state.status === "error" && <Button onClick={() => void session.refresh().catch(() => undefined)}>다시 확인하기</Button>}
        </Notice>}
  </section></div>;
}

function AuthenticatedRequests({ access, getSessionEpoch, page, scope, status, requestId, onCommitted }: {
  access: AuthAccess; getSessionEpoch: () => number; page: number; scope: "mine" | "company"; status?: TeamChangeStatus; requestId?: number; onCommitted: (value: TeamCommit) => void;
}) {
  const router = useRouter();
  const [result, setResult] = useState<TeamChanges | null>(null), [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [attempt, setAttempt] = useState(0), [pending, setPending] = useState(false), [submitted, setSubmitted] = useState(false);
  const [action, setAction] = useState<"ACCEPT" | "REJECT" | "CANCEL" | null>(null);
  const active = useRef<AbortController | null>(null), command = useRef<ReturnType<typeof createTeamCommandScope> | null>(null);
  const dialog = useRef<HTMLDialogElement>(null), epoch = useRef(getSessionEpoch()), heading = useRef<HTMLHeadingElement>(null);
  const { getAccountKey, getAccessToken, refresh } = access;
  useEffect(() => {
    const started = getSessionEpoch();
    function hide() { active.current?.abort(); command.current?.dispose(); setAction(null); setResult(null); }
    function load() {
      hide(); setError(null); setSubmitted(false); setPending(false); command.current = null;
      const abort = new AbortController(); active.current = abort;
      void loadTeamChanges({ getAccountKey, getAccessToken, refresh }, { scope, page: page - 1, status }, requestId, abort.signal, undefined, () => started === getSessionEpoch()).then(value => {
        if (!abort.signal.aborted && started === getSessionEpoch()) setResult(value);
      }).catch(reason => { if (!abort.signal.aborted && started === getSessionEpoch()) setError({ message: errorMessage(reason), status: reason instanceof ApiError ? reason.status : 0 }); });
    }
    function visibility() { if (document.visibilityState === "visible") load(); else hide(); }
    load(); window.addEventListener("focus", load); window.addEventListener("pageshow", load); window.addEventListener("pagehide", hide); document.addEventListener("visibilitychange", visibility);
    return () => { active.current?.abort(); command.current?.dispose(); window.removeEventListener("focus", load); window.removeEventListener("pageshow", load); window.removeEventListener("pagehide", hide); document.removeEventListener("visibilitychange", visibility); };
  }, [getAccountKey, getAccessToken, refresh, getSessionEpoch, page, scope, status, requestId, attempt]);
  function conceal() { active.current?.abort(); command.current?.dispose(); setResult(null); setAction(null); }
  function reload() { conceal(); setError(null); setAttempt(value => value + 1); }
  function navigate(href: string, event?: { preventDefault: () => void }) {
    const current = requestId ? teamChangePath(requestId) : teamChangesListPath(scope, page, status);
    if (href === current) { event?.preventDefault(); return; }
    conceal(); if (!event) router.push(href);
  }
  async function confirm() {
    if (!action || result?.status !== "detail" || pending || submitted) return;
    const run = createTeamCommandScope(access, () => epoch.current === getSessionEpoch()); command.current = run; setPending(true); setSubmitted(true);
    try {
      const value = await run.request(result.request, action);
      if (epoch.current !== getSessionEpoch()) return;
      dialog.current?.close(); setAction(null); onCommitted(value); showToast(teamCommitToast(value)); reload();
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError" || epoch.current !== getSessionEpoch()) return;
      dialog.current?.close(); setAction(null);
      const status = reason instanceof ApiError ? reason.status : 0;
      if ([401, 403, 404].includes(status)) setResult(null);
      setError({ status, message: `${errorMessage(reason)} 완료로 확인된 것은 아니에요. 현재 요청만 다시 조회해 주세요.` });
    } finally { if (epoch.current === getSessionEpoch()) setPending(false); }
  }
  const request = result?.status === "detail" ? result.request : null;
  return <>
    <nav className="mb-4 type-body-7 text-grayscale-600" aria-label="현재 위치"><Link href="/my/team" onNavigate={event => navigate("/my/team", event)}>함께하는 팀원</Link> <span aria-hidden>›</span> <Link href={teamChangePath()} onNavigate={event => navigate(teamChangePath(), event)}>변경 요청</Link>{requestId && <> <span aria-hidden>›</span> 요청 상세</>}</nav>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="type-heading-5 text-grayscale-800" ref={heading} tabIndex={-1}>{requestId ? "변경 요청 상세" : "팀원 변경 요청"}</h1><Button variant="outline" size="xs" onClick={reload} disabled={!result && !error}>현재 상태 다시 조회하기</Button></div>
    <p className="mb-6 type-body-7 text-grayscale-600">요청을 열거나 알림을 읽는 것만으로 동의하지 않아요. 대기 요청은 자동으로 만료되거나 적용되지 않아요.</p>
    {error && <Notice alert message={error.message}>{error.status === 401 ? <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(requestId ? teamChangePath(requestId) : teamChangesListPath(scope, page, status))}`}>로그인하고 돌아오기</ButtonLink> : <Button variant="outline" onClick={reload}>최신 요청만 다시 조회하기</Button>}</Notice>}
    {!result && !error && <Notice message="변경 요청을 확인하고 있어요." />}
    {result?.status === "no-company" && <Notice message="현재 연결된 회사가 없어요. 본인의 과거 요청은 내 요청에서 확인할 수 있어요."><ButtonLink href={teamChangePath()} onNavigate={conceal}>내 요청 보기</ButtonLink></Notice>}
    {result?.status === "list" && <>
      <div className="mb-4 flex flex-wrap items-center gap-3" aria-label="변경 요청 목록 범위"><ButtonLink href={teamChangesListPath("mine", 1, status)} variant={scope === "mine" ? "primary" : "outline"} onNavigate={event => navigate(teamChangesListPath("mine", 1, status), event)}>내 요청</ButtonLink><ButtonLink href={teamChangesListPath("company", 1, status)} variant={scope === "company" ? "primary" : "outline"} onNavigate={event => navigate(teamChangesListPath("company", 1, status), event)}>회사 요청</ButtonLink>
        <Select ariaLabel="요청 상태 필터" value={status ?? "all"} options={[{ value: "all", label: "모든 상태" }, ...statuses.map(s => ({ value: s, label: teamChangeStatusLabel(s) }))]}
          onValueChange={value => navigate(teamChangesListPath(scope, 1, value === "all" ? undefined : value as TeamChangeStatus))} />
      </div>
      <p className="mb-4 type-body-7 text-grayscale-600">{scope === "mine" ? "현재 계정이 대상인 요청과 과거 처리 결과예요." : "현재 권한으로 조회할 수 있는 회사 요청만 표시해요."} {result.page.totalElements}건</p>
      <div className="space-y-3">{result.page.content.map(r => <article key={r.changeRequestId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-6 shadow-(--shadow-control)"><div className="min-w-0"><h2 className="type-heading-9 text-grayscale-800">{teamChangeKindLabel(r.kind)} · {teamChangeStatusLabel(r.status)}</h2><p className="mt-2 break-all type-body-5 text-grayscale-700">대상: {targetLabel(r, result.targets[r.targetMembershipId])}</p><p className="mt-2 type-body-7 text-grayscale-600">요청일 {teamDate(r.createdAt, true)}{r.proposedPosition ? ` · 제안 직급 ${r.proposedPosition.name}` : ""}</p></div><ButtonLink href={teamChangePath(r.changeRequestId)} variant="outline" onNavigate={conceal}>요청 보기</ButtonLink></article>)}</div>
      {!result.page.content.length && <Notice message={result.page.totalElements ? "이 페이지에는 요청이 없어요." : "표시할 변경 요청이 없어요."}>{page > 1 && <ButtonLink href={teamChangesListPath(scope, 1, status)} onNavigate={conceal}>첫 페이지 보기</ButtonLink>}</Notice>}
      {result.page.totalPages > 1 && <div className="mt-6 flex justify-center"><Pagination page={page} totalPages={result.page.totalPages} onPageChange={next => navigate(teamChangesListPath(scope, next, status))} /></div>}
    </>}
    {request && result?.status === "detail" && <>
      <RequestDetail request={request} catalog={result.catalog} target={result.targets[request.targetMembershipId]} />
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <ButtonLink href={teamChangePath()} variant="tertiary" onNavigate={conceal}>요청 목록으로 돌아가기</ButtonLink>
        {request.capabilities.canCancel && <Button variant="outline" disabled={pending || submitted} onClick={() => setAction("CANCEL")}>요청 취소하기</Button>}
        {request.capabilities.canReject && <Button variant="outline" disabled={pending || submitted} onClick={() => setAction("REJECT")}>거절하기</Button>}
        {request.capabilities.canAccept && <Button disabled={pending || submitted} onClick={() => setAction("ACCEPT")}>변경 내용 수락하기</Button>}
      </div>
      <TeamConfirmDialog dialogRef={dialog} open={!!action} pending={pending} title={action === "ACCEPT" ? "제안된 변경을 수락할까요?" : action === "REJECT" ? "변경 요청을 거절할까요?" : "변경 요청을 취소할까요?"}
        description={`대상: ${targetLabel(request, result.targets[request.targetMembershipId])}. ${action === "ACCEPT" ? "위에 표시한 직급·전체 권한 또는 소속 종료에 동의해요. 현재 대상·요청 버전과 마지막 관리자 조건을 다시 확인해요." : "기존 직급과 권한은 유지하며, 이 요청의 상태만 변경해요."}`} onClose={() => setAction(null)} onConfirm={() => void confirm()} />
    </>}
  </>;
}
function targetLabel(request: TeamChangeRequest, target: CompanyTeamMember | null | undefined) { return target ? `${teamMemberName(target)} · ${target.contactEmail}` : `원래 소속 #${request.targetMembershipId} (현재 팀원 정보 없음)`; }
function RequestDetail({ request: r, catalog, target }: { request: TeamChangeRequest; catalog: CompanyPermissionCatalog; target: CompanyTeamMember | null | undefined }) {
  const permissions = catalog.categories.flatMap(c => c.permissions);
  const names = (codes: string[]) => codes.map(code => permissions.find(p => p.code === code)?.name ?? `${code} (요청 당시 권한)`);
  const reason = r.invalidationReason ?? r.capabilities.blockingReason;
  const reasonLabel: Record<string, string> = { TARGET_CHANGED: "대상 소속 정보가 변경되어 제안이 무효예요.", TARGET_ENDED: "대상의 회사 소속이 종료되어 제안이 무효예요.", TARGET_UNAVAILABLE: "대상 상태를 확인할 수 없어 제안이 무효예요.", PROPOSED_POSITION_UNAVAILABLE: "제안한 직급을 더 이상 사용할 수 없어요.", PROPOSED_POSITION_CHANGED: "제안한 직급 정의가 변경됐어요.", PROPOSED_PERMISSIONS_INVALID: "제안 권한을 더 이상 적용할 수 없어요.", LAST_ADMIN_REQUIRED: "마지막 관리자의 권한과 소속은 유지해야 해요. 거절은 별도로 할 수 있어요.", COMPANY_CHANGE_LOCKED: "현재 회사 변경이 잠겨 있어요. 최신 상태를 다시 확인해 주세요." };
  return <article className="rounded-[20px] bg-white p-6 shadow-(--shadow-control)"><h2 className="type-heading-9 text-grayscale-800">{teamChangeKindLabel(r.kind)} · {teamChangeStatusLabel(r.status)}</h2>
    <p className="mt-3 break-all type-body-5 text-grayscale-700">대상: {targetLabel(r, target)}</p>
    <p className="mt-3 type-body-7 text-grayscale-600">요청일 {teamDate(r.createdAt, true)} · 요청자 {r.issuerName?.trim() || "이름 미제공"}</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">{[{ label: "요청 당시 상태", position: r.beforePosition.name, codes: r.beforePermissionCodes }, { label: "제안한 변경 후 상태", position: r.proposedPosition?.name ?? "회사 소속 종료", codes: r.proposedPermissionCodes ?? [] }].map(value => <section className="rounded-2xl bg-grayscale-50 p-4" key={value.label}><h3 className="type-body-1 text-grayscale-800">{value.label}</h3><p className="mt-3 type-body-5 text-grayscale-700">직급: {value.position}</p><p className="mt-3 type-body-5 text-grayscale-700">전체 권한 {value.codes.length}개</p><ul className="mt-2 list-disc space-y-1 pl-5 type-body-7 text-grayscale-600">{names(value.codes).map(name => <li className="break-words" key={name}>{name}</li>)}</ul></section>)}</div>
    {r.processedAt && <p className="mt-4 type-body-7 text-grayscale-600">처리일 {teamDate(r.processedAt, true)}</p>}
    {reason && <p className="mt-4 type-body-5 text-danger" role="status">{reasonLabel[reason] ?? "현재 조건에서 요청을 처리할 수 없어요. 최신 상태를 확인해 주세요."}</p>}
    {r.status === "PENDING" && <p className="mt-4 type-body-7 text-grayscale-600">수락 전에는 기존 직급·권한을 유지해요. 현재 대상 본인만 수락·거절하고 자격 있는 회사 담당자는 요청을 취소할 수 있어요.</p>}
  </article>;
}
function Notice({ message, alert = false, children }: { message: string; alert?: boolean; children?: React.ReactNode }) { return <div className="my-4 rounded-2xl bg-grayscale-50 p-6" role={alert ? "alert" : "status"}><p className="type-body-5 text-grayscale-800">{message}</p>{children && <div className="mt-4 flex flex-wrap gap-3">{children}</div>}</div>; }
