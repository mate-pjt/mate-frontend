"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { showToast } from "@/components/ui/toast";
import type { TeamMembershipRequest } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import { loadTeamMembershipRequests, membershipApplicantName, membershipRequestPath, requestedMembershipPosition, type TeamMembershipSnapshot } from "@/features/company/team-membership-requests";
import { teamDate, teamDetailPath, teamListPath, teamRoleLabel } from "@/features/company/team";
import { teamPositionsPath } from "@/features/company/team-positions";
import { MySideMenu } from "./my-side-menu";
import { TeamMembershipReviewDialog } from "./team-membership-review-dialog";
import { TeamInvitationsPanel } from "./team-invitations-panel";

type Result = { status: "loading" | "unauthorized" | "denied" | "no-company" } | { status: "error"; message: string } | { status: "ready"; value: TeamMembershipSnapshot };
export function TeamMembershipRequestsClient({ initialPage }: { initialPage: number | null }) {
  const { state, refresh, getAccessToken, getAccountKey, getSessionEpoch } = useAuthSession();
  const [committed, setCommitted] = useState<{ value: TeamMembershipRequest; account: string | null; epoch: number } | null>(null);
  const receipt = committed && committed.epoch === getSessionEpoch() && (committed.account === getAccountKey() || getAccountKey() === null)
    && (state.status !== "authenticated" || !state.authentication.companyContext || state.authentication.companyContext.companyId === committed.value.companyId) ? committed.value : undefined;
  const banner = receipt && <div role="status" className="mx-auto my-4 max-w-[1180px] rounded-2xl bg-primary-100 p-4 type-body-5 text-grayscale-800"><p>{receipt.status === "APPROVED" ? "합류 신청을 승인했어요." : "팀원 합류 신청을 거절했어요!"}</p><p className="mt-2 type-body-7">처리는 완료됐어요. 최신 목록·팀원 정보와 로그인 상태는 별도로 확인해 주세요.</p></div>;
  if (initialPage !== null && state.status === "authenticated") return <>{banner}<AuthenticatedMembershipRequests initialPage={initialPage} access={{ getAccessToken, getAccountKey, refresh }} getSessionEpoch={getSessionEpoch} receipt={receipt}
    onCommitted={value => setCommitted({ value, account: getAccountKey(), epoch: getSessionEpoch() })} key={`${state.authentication.account.id}:${getSessionEpoch()}:${state.authentication.companyContext?.companyId ?? "none"}:${initialPage}`} /></>;
  return <>{banner}<Shell><Message title={initialPage === null ? "신청 목록의 페이지 정보를 확인해 주세요." : state.status === "anonymous" ? "로그인하면 회사에 들어온 신청을 검토할 수 있어요." : state.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 상태를 확인하고 있어요."} error={initialPage === null || state.status === "error"}>
    {initialPage === null ? <ButtonLink href={membershipRequestPath()}>첫 신청 페이지로 돌아가기</ButtonLink> : state.status === "anonymous" ? <Login page={initialPage} /> : state.status === "error" ? <Button variant="outline" onClick={() => void refresh().catch(() => undefined)}>다시 확인하기</Button> : null}
  </Message></Shell></>;
}
function AuthenticatedMembershipRequests({ initialPage, access, getSessionEpoch, receipt, onCommitted }: {
  initialPage: number; access: AuthAccess; getSessionEpoch: () => number; receipt?: TeamMembershipRequest; onCommitted: (value: TeamMembershipRequest) => void;
}) {
  const { getAccessToken, getAccountKey, refresh } = access, router = useRouter();
  const [result, setResult] = useState<Result>({ status: "loading" }), [attempt, setAttempt] = useState(0), [opening, setOpening] = useState<number | null>(null);
  const [opened, setOpened] = useState<(TeamMembershipSnapshot & { detail: TeamMembershipRequest }) | null>(null), [invitationNotice, setInvitationNotice] = useState("");
  const active = useRef<AbortController | null>(null), heading = useRef<HTMLHeadingElement>(null), focusAfterLoad = useRef(false);
  const accessError = useCallback((cause: ApiError) => { setOpened(null); setOpening(null); setResult({ status: cause.status === 401 ? "unauthorized" : "denied" }); }, []);
  useEffect(() => {
    const epoch = getSessionEpoch();
    function hide() { active.current?.abort(); setOpened(null); setOpening(null); setResult({ status: "loading" }); }
    function load() {
      hide(); const controller = new AbortController(); active.current = controller;
      void loadTeamMembershipRequests({ getAccessToken, getAccountKey, refresh }, initialPage - 1, controller.signal, undefined, () => epoch === getSessionEpoch(), undefined, receipt).then(value => {
        if (!controller.signal.aborted && epoch === getSessionEpoch()) setResult(value ? { status: "ready", value } : { status: "no-company" });
      }).catch(cause => {
        if (controller.signal.aborted || epoch !== getSessionEpoch()) return;
        if (cause instanceof ApiError && [401, 403].includes(cause.status)) accessError(cause);
        else setResult({ status: "error", message: errorMessage(cause) });
      });
    }
    function visibility() { if (document.visibilityState === "visible") load(); else hide(); }
    load(); window.addEventListener("focus", load); window.addEventListener("pageshow", load); window.addEventListener("pagehide", hide); document.addEventListener("visibilitychange", visibility);
    return () => { active.current?.abort(); window.removeEventListener("focus", load); window.removeEventListener("pageshow", load); window.removeEventListener("pagehide", hide); document.removeEventListener("visibilitychange", visibility); };
  }, [getAccessToken, getAccountKey, refresh, getSessionEpoch, initialPage, attempt, receipt, accessError]);
  useEffect(() => { if (result.status !== "loading" && focusAfterLoad.current) { heading.current?.focus(); focusAfterLoad.current = false; } }, [result]);
  function conceal() { active.current?.abort(); setOpened(null); setOpening(null); setResult({ status: "loading" }); }
  function reload() { conceal(); focusAfterLoad.current = true; setAttempt(value => value + 1); }
  function navigate(page: number) { if (page === initialPage) return; conceal(); router.push(membershipRequestPath(page)); }
  async function review(id: number) {
    if (opening !== null || result.status !== "ready") return;
    const controller = new AbortController(), epoch = getSessionEpoch(); active.current?.abort(); active.current = controller; setOpening(id);
    try {
      const value = await loadTeamMembershipRequests(access, initialPage - 1, controller.signal, undefined, () => epoch === getSessionEpoch(), id);
      if (controller.signal.aborted || epoch !== getSessionEpoch()) return;
      if (!value?.detail) { setResult({ status: "no-company" }); return; }
      setResult({ status: "ready", value }); setOpened({ ...value, detail: value.detail });
    } catch (cause) {
      if (controller.signal.aborted || epoch !== getSessionEpoch()) return;
      if (cause instanceof ApiError && [401, 403].includes(cause.status)) accessError(cause);
      else setResult({ status: "error", message: cause instanceof ApiError && cause.status === 404 ? "대기 중인 신청을 찾지 못했어요. 이미 처리됐거나 신청자가 취소했을 수 있어요." : errorMessage(cause) });
    } finally { if (!controller.signal.aborted && epoch === getSessionEpoch()) setOpening(null); }
  }
  function committed(value: TeamMembershipRequest) { onCommitted(value); showToast(value.status === "APPROVED" ? "합류 신청을 승인했어요." : "팀원 합류 신청을 거절했어요!"); setOpened(null); }
  return <Shell onNavigate={conceal}>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 ref={heading} tabIndex={-1} className="text-2xl font-bold text-grayscale-900 focus:outline-none sm:text-[32px]">우리 팀원을 한곳에서 관리해요!</h1><p className="mt-2 type-body-1 text-grayscale-600">팀원의 역할을 확인하고 정보를 편집할 수 있어요.</p></div>
      <Button variant="text_gray" size="xs" onClick={reload} disabled={result.status === "loading" || opened !== null || opening !== null}>신청 상태 확인</Button></div>
    <nav aria-label="팀원 관리 메뉴" className="mb-8 flex flex-wrap items-center gap-4"><ButtonLink href={teamListPath()} onNavigate={conceal} variant="tertiary"><Image src="/images/team/team.svg" width={20} height={20} alt="" />팀원</ButtonLink>
      <span aria-current="page" className="inline-flex items-center gap-2 rounded-xl bg-grayscale-800 px-4 py-2 type-heading-9 text-white"><span className="inline-flex size-6 items-center justify-center"><Image src="/images/team/requests.svg" width={13} height={18} alt="" /></span>팀원 신청{result.status === "ready" ? ` ${result.value.page.totalElements}` : ""}</span>
      <ButtonLink href={teamPositionsPath()} onNavigate={conceal} variant="tertiary"><Image src="/images/team/positions.svg" width={20} height={17} className="h-auto w-auto" alt="" />직급 관리</ButtonLink></nav>
    {invitationNotice && <p role="status" className="mb-4 rounded-xl bg-primary-100 p-4 type-body-7 text-grayscale-800">{invitationNotice}</p>}
    {result.status === "loading" && <Message title="회사에 들어온 신청을 확인하고 있어요." />}
    {result.status === "unauthorized" && <Message title="로그인이 필요해요."><Login page={initialPage} /></Message>}
    {result.status === "denied" && <Message title="합류 신청을 검토할 권한이 없어요." error><p>현재 회사의 소속 신청 승인·거절 권한을 확인해 주세요.</p><Button variant="outline" onClick={reload}>다시 확인하기</Button></Message>}
    {result.status === "no-company" && <Message title="연결된 회사가 없어요."><ButtonLink href="/my/company" onNavigate={conceal} variant="outline">나의 회사 확인하기</ButtonLink></Message>}
    {result.status === "error" && <Message title={result.message} error><Button variant="outline" onClick={reload}>현재 상태 다시 조회하기</Button></Message>}
    {result.status === "ready" && <>
      {receipt && receipt.companyId === result.value.companyId && <details className="mb-6 rounded-2xl bg-grayscale-50 p-4"><summary className="cursor-pointer type-body-1">처리 결과 보기</summary><dl className="mt-4 space-y-2 type-body-7">
        <div><dt className="text-grayscale-600">신청한 직급</dt><dd>{requestedMembershipPosition(receipt)}</dd></div>
        {receipt.status === "APPROVED" ? <><div><dt className="text-grayscale-600">실제 부여한 직급·역할</dt><dd>{receipt.appliedPositionName} · {teamRoleLabel(receipt.appliedRole!)}</dd></div><div><dt className="text-grayscale-600">실제 부여한 권한</dt><dd>{receipt.appliedPermissions.map(code => result.value.catalog.categories.flatMap(c => c.permissions).find(p => p.code === code)?.name || code).join(", ")}</dd></div>
          <div><dt className="text-grayscale-600">현재 소속 확인</dt><dd>{result.value.memberCheck === "confirmed" ? "승인된 팀원을 다시 확인했어요." : result.value.memberCheck === "changed" ? "승인 이후 팀원 정보가 변경됐어요. 위 내용은 승인 당시 결과예요." : "현재 팀원 정보를 확인하지 못했어요. 승인 당시 결과는 유지돼요."}</dd></div><ButtonLink href={teamDetailPath(receipt.appliedMembershipId!)} variant="outline" size="xs" onNavigate={conceal}>승인한 팀원 보기</ButtonLink></> : <div><dt className="text-grayscale-600">거절 사유</dt><dd className="break-all">{receipt.rejectionReason}</dd></div>}
        <div><dt className="text-grayscale-600">처리 시각</dt><dd>{teamDate(receipt.completedAt, true)}</dd></div></dl></details>}
      <section aria-label="받은 합류 신청" className="mb-8"><h2 className="type-heading-7 text-grayscale-800">우리 팀 합류를 원하는 팀원이 있어요!</h2><p className="mt-2 mb-6 type-body-3 text-grayscale-600">신청 정보를 확인하고 승인해 팀원으로 맞아주세요.</p>
        {result.value.page.content.length ? <ul className="space-y-3">{result.value.page.content.map(row => <li key={row.requestId} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-grayscale-50 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-4"><Image src="/icon/24dp/ceo.svg" width={40} height={40} alt="" /><div className="min-w-0"><p className="break-all type-body-1 text-grayscale-800">{membershipApplicantName(row)} <span className="ml-2 type-body-7 text-primary-400">합류 요청</span></p><p className="mt-1 break-all type-body-7 text-grayscale-600">{row.googleVerifiedEmail || "확인 이메일 미제공"}</p><p className="mt-1 type-body-7 text-grayscale-600">{requestedMembershipPosition(row)} · {teamDate(row.createdAt)} 합류 요청</p></div></div>
          <Button variant="tertiary" size="lg" disabled={opening !== null || !row.capabilities.canReview} aria-label={`${membershipApplicantName(row)} 신청 검토`} onClick={() => void review(row.requestId)}>{opening === row.requestId ? "확인 중…" : "검토"}</Button>
        </li>)}</ul> : <Message title={result.value.page.totalElements ? "이 페이지에는 합류 신청이 없어요." : "아직 대기 중인 합류 신청이 없어요."}>{result.value.page.totalElements > 0 && <Button variant="outline" onClick={() => navigate(1)}>첫 신청 페이지로 돌아가기</Button>}</Message>}
        {result.value.page.totalPages > 1 && result.value.page.content.length > 0 && <div className="mt-6 flex justify-center"><Pagination ariaLabel="합류 신청 페이지" page={initialPage} totalPages={result.value.page.totalPages} onPageChange={navigate} /></div>}
      </section>
      <TeamInvitationsPanel companyId={result.value.companyId} access={access} getSessionEpoch={getSessionEpoch} onAccessError={accessError} onCommitted={value => setInvitationNotice(value.message)} />
    </>}
    {opened && <TeamMembershipReviewDialog snapshot={opened} access={access} getSessionEpoch={getSessionEpoch} onAccessError={accessError} onClose={submitted => { setOpened(null); if (submitted) reload(); }} onCommitted={committed} />}
  </Shell>;
}
function Shell({ children, onNavigate }: { children: React.ReactNode; onNavigate?: () => void }) { return <div className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[1732px] flex-col gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:gap-6"><MySideMenu value="team" onNavigate={onNavigate} /><section className="min-w-0 max-w-[1180px] flex-1">{children}</section></div>; }
function Message({ title, error = false, children }: { title: string; error?: boolean; children?: React.ReactNode }) { return <div className="rounded-2xl bg-grayscale-50 p-6 text-grayscale-700" role={error ? "alert" : "status"}><p className={error ? "type-body-1 text-danger-emphasis" : "type-body-1"}>{title}</p>{children && <div className="mt-4 flex flex-wrap items-center gap-3 type-body-7">{children}</div>}</div>; }
function Login({ page }: { page: number }) { return <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(membershipRequestPath(page))}`}>로그인하고 돌아오기</ButtonLink>; }
