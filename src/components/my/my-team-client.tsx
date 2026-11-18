"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { NormalTag } from "@/components/ui/chip";
import { Pagination } from "@/components/ui/pagination";
import type { CompanyTeamMember } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import { loadCompanyTeam, teamDate, teamDetailPath, teamListPath, teamMemberName, teamRoleLabel, type TeamResult } from "@/features/company/team";
import { MySideMenu } from "./my-side-menu";
import { TeamMemberEditor } from "./team-member-editor";
import { teamChangePath, type TeamCommit } from "@/features/company/team-management";
import { TeamInvitationsPanel } from "./team-invitations-panel";
import { membershipRequestPath } from "@/features/company/team-membership-requests";

type Result = TeamResult | { status: "loading" | "unauthorized" | "denied" | "missing" } | { status: "error"; message: string };
type Props = { initialPage: number | null; membershipId?: number | null };

export function MyTeamClient({ initialPage, membershipId }: Props) {
  const { state, refresh, getAccessToken, getAccountKey, getSessionEpoch } = useAuthSession();
  const [committed, setCommitted] = useState<(TeamCommit & { account: string | null; epoch: number }) | null>(null);
  const receipt = committed && committed.epoch === getSessionEpoch() && (getAccountKey() === committed.account || getAccountKey() === null) ? committed : null;
  const banner = receipt && <div className="mx-auto my-4 max-w-[1100px] rounded-2xl bg-primary-100 p-4 type-body-5 text-grayscale-800" role="status"><p>{receipt.message}</p><p className="mt-2 type-body-7">최신 상태 조회와 로그인 상태는 별도로 확인해 주세요.</p>{receipt.requestId && <ButtonLink href={teamChangePath(receipt.requestId)} variant="outline" size="xs" className="mt-3">변경 요청 보기</ButtonLink>}</div>;
  const detail = membershipId !== undefined;
  const valid = initialPage !== null && membershipId !== null;
  if (valid && state.status === "authenticated") {
    return <>{banner}<AuthenticatedTeam initialPage={initialPage} membershipId={membershipId} getAccessToken={getAccessToken} refresh={refresh} getAccountKey={getAccountKey} getSessionEpoch={getSessionEpoch}
      onCommitted={value => setCommitted({ ...value, account: getAccountKey(), epoch: getSessionEpoch() })}
      key={`${state.authentication.account.id}:${getSessionEpoch()}:${state.authentication.companyContext?.companyId ?? "none"}:${initialPage}:${membershipId ?? "list"}`} /></>;
  }
  return <>{banner}<TeamShell detail={detail}>
    <Message title={!valid ? "팀원 주소와 페이지 정보를 확인해 주세요." : state.status === "anonymous" ? "로그인하면 함께하는 팀원을 확인할 수 있어요." : state.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 상태를 확인하고 있어요."} error={!valid || state.status === "error"}>
      {!valid ? <ButtonLink href={teamListPath()} variant="outline">팀원 목록으로 돌아가기</ButtonLink> : state.status === "anonymous" ? <LoginLink page={initialPage!} membershipId={membershipId} /> : state.status === "error" ? <Button onClick={() => void refresh().catch(() => undefined)} variant="outline">다시 시도하기</Button> : null}
    </Message>
  </TeamShell></>;
}

function AuthenticatedTeam({ initialPage, membershipId, getAccessToken, refresh, getAccountKey, getSessionEpoch, onCommitted }: AuthAccess & { initialPage: number; membershipId?: number; getSessionEpoch: () => number; onCommitted: (value: TeamCommit) => void }) {
  const router = useRouter();
  const [result, setResult] = useState<Result>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const active = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusAfterLoad = useRef(false);
  const onAccessError = useCallback((error: ApiError) => setResult({ status: error.status === 401 ? "unauthorized" : error.status === 403 ? "denied" : "missing" }), []);
  const detail = membershipId !== undefined;

  useEffect(() => {
    const epoch = getSessionEpoch();
    function load() {
      active.current?.abort();
      const controller = new AbortController(); active.current = controller;
      void loadCompanyTeam({ getAccessToken, refresh, getAccountKey }, initialPage - 1, membershipId, controller.signal, undefined, () => epoch === getSessionEpoch()).then(value => {
        if (!controller.signal.aborted && epoch === getSessionEpoch()) setResult(value);
      }).catch(reason => {
        if (controller.signal.aborted || epoch !== getSessionEpoch()) return;
        if (reason instanceof ApiError && reason.status === 401) setResult({ status: "unauthorized" });
        else if (reason instanceof ApiError && reason.status === 403) setResult({ status: "denied" });
        else if (reason instanceof ApiError && reason.status === 404) setResult({ status: "missing" });
        else setResult({ status: "error", message: errorMessage(reason) });
      });
    }
    function resume() { setResult({ status: "loading" }); load(); }
    function hide() { active.current?.abort(); setResult({ status: "loading" }); }
    function visibility() { if (document.visibilityState === "visible") resume(); else hide(); }
    load();
    window.addEventListener("focus", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("pagehide", hide);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      active.current?.abort();
      window.removeEventListener("focus", resume); window.removeEventListener("pageshow", resume); window.removeEventListener("pagehide", hide);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [getAccessToken, refresh, getAccountKey, getSessionEpoch, initialPage, membershipId, attempt]);

  useEffect(() => { if (result.status !== "loading" && focusAfterLoad.current) { heading.current?.focus(); focusAfterLoad.current = false; } }, [result]);
  function conceal() { active.current?.abort(); setResult({ status: "loading" }); }
  function reload() { conceal(); focusAfterLoad.current = true; setAttempt(value => value + 1); }
  function navigate(page: number) { conceal(); router.push(teamListPath(page)); }

  return <TeamShell detail={detail}>
    {detail && <nav aria-label="현재 위치" className="mb-4 type-body-7 text-grayscale-600"><Link href={teamListPath(initialPage)} onNavigate={conceal}>함께하는 팀원</Link> <span aria-hidden>›</span> 팀원 정보</nav>}
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className={`${detail ? "type-heading-9" : "text-2xl font-bold sm:text-[32px]"} text-grayscale-900 focus:outline-none`} ref={heading} tabIndex={-1}>{detail ? "팀원 정보" : "우리 팀원을 한곳에서 관리해요!"}</h1>
        {!detail && <p className="mt-2 type-body-1 text-grayscale-600">팀원의 역할을 확인하고 정보를 확인할 수 있어요.</p>}
      </div>
      <ButtonLink href={teamChangePath()} variant="outline" size="xs" onNavigate={conceal}>변경 요청 확인하기</ButtonLink>
      <Button onClick={reload} variant="text_gray" size="xs" disabled={result.status === "loading"}>새로고침</Button>
    </div>
    {result.status === "loading" && <Message title="팀원 정보를 확인하고 있어요." />}
    {result.status === "unauthorized" && <Message title="로그인이 필요해요."><LoginLink page={initialPage} membershipId={membershipId} /></Message>}
    {result.status === "denied" && <Message title="팀원을 조회할 권한이 없어요." error><p>현재 소속과 팀원 조회 권한을 회사 관리자에게 확인해 주세요.</p><Button variant="outline" onClick={reload}>다시 확인하기</Button></Message>}
    {result.status === "missing" && <Message title="팀원을 찾지 못했어요." error><p>탈퇴하거나 소속이 변경됐을 수 있어요.</p><ButtonLink href={teamListPath(initialPage)} variant="outline" onNavigate={conceal}>목록으로 돌아가기</ButtonLink><Button variant="text_gray" onClick={reload}>다시 확인하기</Button></Message>}
    {result.status === "error" && <Message title={result.message} error><Button variant="outline" onClick={reload}>다시 시도하기</Button></Message>}
    {result.status === "no-company" && <Message title="연결된 회사가 없어요."><ButtonLink href="/my/company" variant="outline">나의 회사 확인하기</ButtonLink></Message>}
    {result.status === "list" && <>
      <div className="mb-6 flex flex-wrap items-start gap-4" aria-label="팀원 관리 메뉴">
        <span className="inline-flex items-center gap-2 rounded-xl bg-grayscale-800 px-4 py-2 type-heading-9 text-white" aria-current="page"><Image src="/images/team/team.svg" width={20} height={20} alt="" />팀원 {result.page.totalElements}</span>
        {result.page.capabilities.canReviewRequests ? <ButtonLink href={membershipRequestPath()} onNavigate={conceal} variant="tertiary"><span className="flex size-6 items-center justify-center"><Image src="/images/team/requests.svg" alt="" width={13} height={18} /></span>팀원 신청</ButtonLink>
          : <span className="inline-flex flex-col gap-1"><Button disabled variant="tertiary" title="현재 신청 검토 권한이 없어요."><Image src="/images/team/requests.svg" alt="" width={13} height={18} />팀원 신청</Button><span className="type-body-7 text-grayscale-600">현재 검토 권한 없음</span></span>}
        <PreparedTab icon="positions" width={20} height={16.6668} label="직급 관리" available={result.page.capabilities.canManagePositions} />
      </div>
      <p className="mb-4 type-body-7 text-grayscale-600" id="team-prepared">직급 관리는 준비 중이에요.</p>
      <TeamInvitationsPanel companyId={result.companyId} access={{ getAccessToken, refresh, getAccountKey }} getSessionEpoch={getSessionEpoch} onCommitted={onCommitted} onAccessError={onAccessError} />
      {result.page.content.length ? <div className="overflow-x-auto rounded-lg" role="region" aria-label="팀원 목록 표" tabIndex={0}>
        <table className="w-full min-w-[850px] border-separate border-spacing-y-2 text-left type-body-3 text-grayscale-800">
          <caption className="sr-only">현재 회사 팀원 {result.page.totalElements}명, {initialPage}페이지</caption>
          <thead className="type-body-7 text-grayscale-600"><tr>{["이름", "이메일", "직급", "역할", "가입일", "마지막 로그인", "작업"].map(label => <th className="px-3 py-2 font-medium" scope="col" key={label}>{label}</th>)}</tr></thead>
          <tbody>{result.page.content.map(member => <tr className="h-[60px] bg-grayscale-50" key={member.membershipId}>
            <th className="rounded-l-lg px-3 py-3 font-medium" scope="row">{teamMemberName(member)}</th>
            <td className="break-all px-3 py-3">{member.contactEmail}</td><td className="px-3 py-3">{member.positionName}</td>
            <td className="px-3 py-3"><RoleTag member={member} /></td><td className="whitespace-nowrap px-3 py-3">{teamDate(member.joinedAt)}</td>
            <td className="whitespace-nowrap px-3 py-3">{teamDate(member.lastLoginAt, true)}</td>
            <td className="rounded-r-lg px-3 py-3 text-right"><ButtonLink href={teamDetailPath(member.membershipId, initialPage)} onNavigate={conceal} variant="secondary" size="xs" aria-label={`${teamMemberName(member)} 정보 보기`}>보기</ButtonLink></td>
          </tr>)}</tbody>
        </table>
      </div> : <Message title={result.page.totalElements === 0 ? "함께하는 팀원이 없어요." : "이 페이지에는 팀원이 없어요."}>{result.page.totalElements > 0 && <Button onClick={() => navigate(1)} variant="outline">첫 페이지로 돌아가기</Button>}</Message>}
      {result.page.totalPages > 1 && result.page.content.length > 0 && <div className="mt-6 flex justify-center"><Pagination ariaLabel="팀원 목록 페이지" page={initialPage} totalPages={result.page.totalPages} onPageChange={navigate} /></div>}
    </>}
    {result.status === "detail" && <MemberDetail result={result} page={initialPage} conceal={conceal}
      access={{ getAccessToken, refresh, getAccountKey }} getSessionEpoch={getSessionEpoch} reload={reload} onCommitted={value => { onCommitted(value); reload(); }}
      onAccessError={error => setResult({ status: error.status === 401 ? "unauthorized" : error.status === 403 ? "denied" : "missing" })} />}
  </TeamShell>;
}

function MemberDetail({ result, page, conceal, access, getSessionEpoch, reload, onCommitted, onAccessError }: { result: Extract<TeamResult, { status: "detail" }>; page: number; conceal: () => void; access: AuthAccess; getSessionEpoch: () => number; reload: () => void; onCommitted: (value: TeamCommit) => void; onAccessError: (error: ApiError) => void }) {
  const { member } = result;
  const [failedImage, setFailedImage] = useState(false);
  const cards = [
    ["마지막 로그인", teamDate(member.lastLoginAt, true)], ["가입일", teamDate(member.joinedAt)], ["생년월일", "미제공"], ["핸드폰번호", "미제공"],
  ];
  return <>
    <section className="rounded-[20px] bg-white p-6 shadow-(--shadow-control)" aria-label="팀원 기본 정보">
      <div className="mb-6 flex min-w-0 items-center gap-4">
        <Image src={!failedImage && member.profileImageUrl ? member.profileImageUrl : "/icon/24dp/ceo.svg"} onError={() => setFailedImage(true)} alt="" width={60} height={60} className="size-[60px] shrink-0 rounded-full bg-grayscale-50 object-contain p-1" unoptimized referrerPolicy="no-referrer" />
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="break-all type-heading-5 text-grayscale-800">{teamMemberName(member)}</h2><RoleTag member={member} /></div><p className="mt-1 break-all type-body-7 text-grayscale-600">{member.contactEmail}</p></div>
      </div>
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">{cards.map(([label, value]) => <div className="rounded-xl bg-grayscale-50 p-4" key={label}><dt className="mb-5 type-body-7 text-grayscale-600">{label}</dt><dd className="type-body-5 text-grayscale-800">{value}</dd></div>)}</dl>
    </section>
    <TeamMemberEditor snapshot={result} access={access} getSessionEpoch={getSessionEpoch} reload={reload} onNavigate={conceal} onCommitted={onCommitted} onAccessError={onAccessError} />
    <div className="mt-6 flex justify-end"><ButtonLink href={teamListPath(page)} variant="tertiary" onNavigate={conceal}>목록으로 돌아가기</ButtonLink></div>
  </>;
}

function RoleTag({ member }: { member: CompanyTeamMember }) { return <NormalTag className={member.role === "ADMIN" ? "bg-primary-100 text-primary-400" : "bg-grayscale-50! text-grayscale-700!"}>{teamRoleLabel(member.role)}</NormalTag>; }
function PreparedTab({ icon, width, height, label, available }: { icon: string; width: number; height: number; label: string; available: boolean }) {
  return <span className="inline-flex flex-col gap-1"><Button disabled variant="tertiary" aria-describedby="team-prepared" title={available ? "권한 있음 · 기능 준비 중" : "현재 권한 없음 · 기능 준비 중"}><span className="flex size-6 items-center justify-center"><Image src={`/images/team/${icon}.svg`} alt="" width={width} height={Math.round(height)} className="h-auto w-auto" /></span>{label}</Button><span className="type-body-7 text-grayscale-600">{available ? "권한 있음 · 준비 중" : "현재 권한 없음"}</span></span>;
}
function Message({ title, error = false, children }: { title: string; error?: boolean; children?: React.ReactNode }) { return <div className="rounded-2xl bg-grayscale-50 p-6 text-grayscale-700" role={error ? "alert" : "status"}><p className={error ? "type-body-1 text-danger" : "type-body-1"}>{title}</p>{children && <div className="mt-4 flex flex-wrap items-center gap-3 type-body-7">{children}</div>}</div>; }
function LoginLink({ page, membershipId }: { page: number; membershipId?: number }) { const next = membershipId ? teamDetailPath(membershipId, page) : teamListPath(page); return <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(next)}`}>로그인하고 돌아오기</ButtonLink>; }
function TeamShell({ detail, children }: { detail: boolean; children: React.ReactNode }) {
  return detail ? <div className="min-h-[calc(100vh-56px)] bg-grayscale-50 px-4 py-8 sm:px-8"><div className="mx-auto max-w-[1100px]">{children}</div></div> : <div className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[1732px] flex-col gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:gap-6"><MySideMenu value="team" /><section className="min-w-0 max-w-[1180px] flex-1">{children}</section></div>;
}
