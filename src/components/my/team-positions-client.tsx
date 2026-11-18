"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { InfoIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { NormalTag } from "@/components/ui/chip";
import { TextInput } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast";
import { normalizeTeamPositionName, type TeamPosition } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import { teamListPath } from "@/features/company/team";
import { membershipRequestPath } from "@/features/company/team-membership-requests";
import { applyTeamPositionChange, loadTeamPositions, positionCommandMessage, teamPositionsPath, type TeamPositionChange, type TeamPositionSnapshot } from "@/features/company/team-positions";
import { MySideMenu } from "./my-side-menu";
import { TeamConfirmDialog } from "./team-confirm-dialog";

type Result =
  | { status: "loading" | "no-company" | "unauthorized" | "denied" }
  | { status: "error"; message: string; committed?: Receipt }
  | { status: "ready"; value: TeamPositionSnapshot };
type Selection = { kind: "rename" | "delete"; position: TeamPosition };
type Work = { controller: AbortController; command: boolean };
type Receipt = { companyId: number; membershipId: number; message: string };

export function TeamPositionsClient({ returnPage }: { returnPage: number | null }) {
  const { state, refresh, getAccessToken, getAccountKey, getSessionEpoch } = useAuthSession();
  if (returnPage !== null && state.status === "authenticated") {
    const key = `${state.authentication.account.id}:${getSessionEpoch()}:${state.authentication.companyContext?.companyId ?? "none"}:${returnPage}`;
    return <AuthenticatedPositions key={key} returnPage={returnPage} access={{ getAccessToken, getAccountKey, refresh }} getSessionEpoch={getSessionEpoch} />;
  }
  return <PositionLayout returnPage={returnPage ?? 1}>
    {returnPage === null ? <Message error title="직급 관리 주소의 페이지 정보를 확인해 주세요." />
      : state.status === "anonymous" ? <Message title="로그인하면 회사 직급을 확인할 수 있어요."><Login page={returnPage} /></Message>
      : state.status === "error" ? <Message error title="로그인 상태를 확인하지 못했어요."><Button variant="outline" onClick={() => void refresh().catch(() => undefined)}>다시 확인하기</Button></Message>
      : <Message title="로그인 상태를 확인하고 있어요." />}
  </PositionLayout>;
}

function AuthenticatedPositions({ returnPage, access, getSessionEpoch }: { returnPage: number; access: AuthAccess; getSessionEpoch: () => number }) {
  const { getAccessToken, getAccountKey, refresh } = access;
  const [result, setResult] = useState<Result>({ status: "loading" });
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const active = useRef<Work | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const conceal = useCallback(() => {
    active.current?.controller.abort();
    active.current = null;
    dialog.current?.close();
    trigger.current = null;
    setSelection(null);
    setPending(false);
    setName("");
    setNameError("");
    setNotice("");
    setResult({ status: "loading" });
  }, []);

  const read = useCallback(async (receipt?: Receipt, focus = false) => {
    const controller = new AbortController();
    const account = getAccountKey(), epoch = getSessionEpoch();
    active.current?.controller.abort();
    active.current = { controller, command: receipt !== undefined };
    const isCurrent = () => active.current?.controller === controller && !controller.signal.aborted && account === getAccountKey() && epoch === getSessionEpoch();
    try {
      const value = await loadTeamPositions({ getAccessToken, getAccountKey, refresh }, controller.signal, undefined, isCurrent);
      if (!isCurrent()) return;
      setResult(value ? { status: "ready", value } : { status: "no-company" });
      if (receipt && value?.companyId === receipt.companyId && value.current.membershipId === receipt.membershipId && value.canManage) showToast(receipt.message);
    } catch (cause) {
      if (!isCurrent()) return;
      if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) setResult({ status: cause.status === 401 ? "unauthorized" : "denied" });
      else {
        const scopeChanged = cause instanceof ApiError && (cause.code === "POSITION_CONTEXT_CHANGED" || cause.status === 404);
        setResult({ status: "error", message: "최신 직급 목록을 불러오지 못했어요.", committed: scopeChanged ? undefined : receipt });
      }
    } finally {
      if (isCurrent()) {
        active.current = null;
        if (focus) heading.current?.focus();
      }
    }
  }, [getAccessToken, getAccountKey, refresh, getSessionEpoch]);

  useEffect(() => {
    function resume() {
      if (active.current?.command) return;
      conceal();
      void read();
    }
    function visibility() { if (document.visibilityState === "visible") resume(); else conceal(); }
    void read();
    window.addEventListener("focus", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("pagehide", conceal);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      active.current?.controller.abort();
      active.current = null;
      window.removeEventListener("focus", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("pagehide", conceal);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [conceal, read]);

  function closeSelection() {
    dialog.current?.close();
    setSelection(null);
    trigger.current?.focus();
    trigger.current = null;
  }

  async function commit(change: TeamPositionChange) {
    if (active.current || result.status !== "ready" || !result.value.canManage) return;
    const snapshot = result.value, controller = new AbortController();
    const account = getAccountKey(), epoch = getSessionEpoch();
    active.current = { controller, command: true };
    const isCurrent = () => active.current?.controller === controller && !controller.signal.aborted && account === getAccountKey() && epoch === getSessionEpoch();
    setPending(true);
    setNotice("");
    try {
      const outcome = await applyTeamPositionChange(access, snapshot, change, controller.signal, undefined, isCurrent);
      if (!isCurrent()) return;
      if (outcome === "unchanged") {
        setNotice("현재 이름과 같아요.");
        dialog.current?.close();
        setSelection(null);
        heading.current?.focus();
        return;
      }
      const message = { create: "새로운 직급이 추가됐어요!", rename: "직급 이름을 변경했어요.", delete: "직급을 삭제했어요." }[change.kind];
      conceal();
      await read({ companyId: snapshot.companyId, membershipId: snapshot.current.membershipId, message }, true);
    } catch (cause) {
      if (!isCurrent()) return;
      dialog.current?.close();
      setSelection(null);
      setName("");
      setNameError("");
      if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) setResult({ status: cause.status === 401 ? "unauthorized" : "denied" });
      else setResult({ status: "error", message: positionCommandMessage(cause) });
      heading.current?.focus();
    } finally {
      if (isCurrent()) {
        active.current = null;
        setPending(false);
      }
    }
  }

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { void commit({ kind: "create", name: normalizeTeamPositionName(name) }); }
    catch (cause) { if (cause instanceof ApiError) setNameError(cause.message); }
  }

  function reload() {
    const receipt = result.status === "error" ? result.committed : undefined;
    conceal();
    void read(receipt, true);
  }
  const snapshot = result.status === "ready" ? result.value : null;
  const selectedPosition = selection?.position;
  return <PositionLayout returnPage={returnPage} snapshot={snapshot} onNavigate={conceal} heading={heading}>
    {result.status === "loading" && <Message title="회사 직급을 확인하고 있어요." />}
    {result.status === "unauthorized" && <Message error title="로그인이 필요해요."><Login page={returnPage} /></Message>}
    {result.status === "denied" && <Message error title="현재 직급을 보거나 관리할 권한이 없어요."><Button variant="outline" onClick={reload}>현재 권한 다시 확인하기</Button></Message>}
    {result.status === "no-company" && <Message title="연결된 회사가 없어요."><ButtonLink href="/my/company" variant="outline" onNavigate={conceal}>나의 회사 확인하기</ButtonLink></Message>}
    {result.status === "error" && <>
      {result.committed && <p role="status" className="mb-3 rounded-lg bg-primary-100 p-4 type-body-3 text-grayscale-800">{result.committed.message} 최신 목록은 다시 확인해 주세요.</p>}
      <Message error title={result.message}><Button variant="outline" onClick={reload}>현재 목록 다시 조회하기</Button></Message>
    </>}
    {snapshot && <section aria-label="회사 직급 목록" className="min-w-0 sm:px-6">
      {snapshot.canManage ? <form onSubmit={add} className="flex items-start gap-2" aria-busy={pending}>
        <TextInput aria-label="추가할 직급 이름" autoComplete="off" placeholder="추가할 직급 이름을 입력해주세요." className="min-w-0 flex-1"
          fieldClassName="focus-within:border-primary-400" value={name} disabled={pending} status={nameError ? "error" : "default"} helperText={nameError || undefined}
          onValueChange={value => { setName(value); setNameError(""); }} />
        <Button type="submit" size="lg" className="h-12 shrink-0 whitespace-nowrap text-base!" disabled={pending}>직급 추가</Button>
      </form> : <p role="status" className="type-body-3 text-grayscale-700">현재 권한으로는 직급 목록을 볼 수 있어요.</p>}
      <p className="mt-4 flex items-start gap-1 rounded-xl bg-primary-100 p-4 type-body-2 text-primary-800 sm:p-5">
        <InfoIcon className="mt-px size-5 shrink-0 text-primary-400" aria-hidden />
        <span>대표자 직급은 수정할 수 없으며, 일반 직급은 사용 중인 구성원의 직급을 먼저 바꾼 뒤 삭제할 수 있어요.</span>
      </p>
      {notice && <p role="status" className="mt-3 type-body-3 text-grayscale-700">{notice}</p>}
      {snapshot.positions.length ? <ul className="mt-8 divide-y divide-grayscale-100">
        {snapshot.positions.map(position => {
          const system = position.type === "REPRESENTATIVE";
          const disabled = system || !snapshot.canManage || pending;
          return <li key={position.id} className="flex min-h-[86px] flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-6">
              <span className="min-w-0 break-words type-body-2 text-grayscale-900 sm:min-w-20">{position.name}</span>
              <NormalTag className="shrink-0 bg-primary-100! text-primary-400!">{system ? "기본 설정" : "사용자 지정"}</NormalTag>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" disabled={disabled} aria-label={`${position.name} 이름변경`} onClick={event => { trigger.current = event.currentTarget; setSelection({ kind: "rename", position }); }}>이름변경</Button>
              <Button variant="danger" size="sm" disabled={disabled} aria-label={`${position.name} 삭제`} onClick={event => { trigger.current = event.currentTarget; setSelection({ kind: "delete", position }); }}>삭제</Button>
            </div>
          </li>;
        })}
      </ul> : <div className="mt-6"><Message title="등록된 직급이 없어요." /></div>}
    </section>}
    {selection?.kind === "rename" && <RenameDialog key={selection.position.id} dialogRef={dialog} position={selection.position} pending={pending}
      onClose={closeSelection} onRename={value => void commit({ kind: "rename", position: selection.position, name: value })} />}
    {selection?.kind === "delete" && selectedPosition && <TeamConfirmDialog open dialogRef={dialog} pending={pending} title="직급을 삭제할까요?"
      description={`‘${selectedPosition.name}’ 직급을 목록에서 삭제해요.`} onClose={closeSelection}
      onConfirm={() => void commit({ kind: "delete", position: selectedPosition })} />}
  </PositionLayout>;
}

function RenameDialog({ dialogRef, position, pending, onClose, onRename }: { dialogRef: React.RefObject<HTMLDialogElement | null>; position: TeamPosition; pending: boolean; onClose: () => void; onRename: (name: string) => void }) {
  const [name, setName] = useState(position.name);
  const [error, setError] = useState("");
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, [dialogRef]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { onRename(normalizeTeamPositionName(name)); }
    catch (cause) { if (cause instanceof ApiError) setError(cause.message); }
  }
  return <dialog ref={dialogRef} aria-label="직급 이름 변경" aria-busy={pending} onCancel={event => { event.preventDefault(); if (!pending) onClose(); }}
    className="m-auto w-[calc(100vw-2rem)] max-w-[520px] rounded-2xl bg-white p-6 text-grayscale-800 backdrop:bg-grayscale-900/50">
    <h2 className="mb-4 type-heading-9">직급 이름 변경</h2>
    <form onSubmit={submit} className="space-y-5">
      <p className="type-body-3 text-grayscale-700">변경한 이름은 이 직급을 사용하는 팀원에게도 반영돼요.</p>
      <TextInput aria-label="새 직급 이름" autoComplete="off" className="w-full" fieldClassName="focus-within:border-primary-400" value={name}
        onValueChange={value => { setName(value); setError(""); }} readOnly={pending} status={error ? "error" : "default"} helperText={error || undefined} />
      <div className="flex justify-end gap-2">
        <Button variant="tertiary" disabled={pending} onClick={onClose}>취소</Button>
        <Button type="submit" disabled={pending || !name || name === position.name}>{pending ? "저장 중…" : "이름 변경"}</Button>
      </div>
    </form>
  </dialog>;
}

function PositionLayout({ returnPage, children, snapshot, onNavigate, heading }: { returnPage: number; children: ReactNode; snapshot?: TeamPositionSnapshot | null; onNavigate?: () => void; heading?: React.Ref<HTMLHeadingElement> }) {
  return <div className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[1732px] flex-col gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:gap-6 lg:pt-[30px]">
    <MySideMenu value="team" onNavigate={onNavigate} />
    <section className="min-w-0 max-w-[1180px] flex-1">
      <div className="sm:p-2">
        <h1 ref={heading} tabIndex={-1} className="text-2xl leading-[1.4] font-bold text-grayscale-900 focus:outline-none sm:text-[32px]">우리 팀원을 한곳에서 관리해요!</h1>
        <p className="mt-2.5 type-heading-10 text-grayscale-600">팀원의 역할을 확인하고 정보를 편집할 수 있어요.</p>
      </div>
      <nav aria-label="팀원 관리 메뉴" className="mb-10 mt-8 flex flex-wrap items-center gap-2 sm:mb-12 sm:gap-3">
        <ButtonLink href={teamListPath(returnPage)} onNavigate={onNavigate} variant="tertiary" size="lg" className="gap-2 text-lg!"><span className="flex size-6 items-center justify-center"><Image src="/images/team/team.svg" width={20} height={20} alt="" /></span>팀원{snapshot ? ` ${snapshot.teamCount}` : ""}</ButtonLink>
        {snapshot?.canReviewRequests && <ButtonLink href={membershipRequestPath()} onNavigate={onNavigate} variant="tertiary" size="lg" className="gap-2 text-lg!"><span className="flex size-6 items-center justify-center"><Image src="/images/team/requests.svg" width={13} height={18} alt="" /></span>팀원 신청</ButtonLink>}
        <span aria-current="page" className="inline-flex items-center gap-2 rounded-xl bg-grayscale-700 px-[18px] py-2.5 type-heading-9 text-white"><span className="flex size-6 items-center justify-center"><Image src="/images/team/positions.svg" width={20} height={17} className="h-auto w-auto" alt="" /></span>직급 관리</span>
        <ButtonLink href={teamListPath(returnPage)} onNavigate={onNavigate} variant="tertiary" size="lg" className="gap-2 text-lg!"><span className="flex size-6 items-center justify-center"><Image src="/images/team/positions-cancel.svg" width={20} height={20} alt="" /></span>취소</ButtonLink>
      </nav>
      {children}
    </section>
  </div>;
}

function Message({ title, error = false, children }: { title: string; error?: boolean; children?: ReactNode }) {
  return <div className="rounded-xl bg-grayscale-50 p-6 text-grayscale-800" role={error ? "alert" : "status"}>
    <p className={error ? "type-body-1 text-danger" : "type-body-1"}>{title}</p>
    {children && <div className="mt-4">{children}</div>}
  </div>;
}

function Login({ page }: { page: number }) {
  return <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(teamPositionsPath(page))}`}>로그인하고 돌아오기</ButtonLink>;
}
