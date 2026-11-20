"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import type { CompanyMergeAction } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import { useAuthSession } from "@/features/auth/session";
import { CompanyMergeUnconfirmed, companyMergeReference, loadCompanyMerge, submitCurrentCompanyMerge } from "@/features/company/company-merge";
import type { CompanyMergeReference, CompanyMergeView } from "@/features/company/company-merge";
import { CompanyMergeCaseView } from "./company-merge-case";
import { CompanyMergeDialog, type MergeDialogIntent } from "./company-merge-dialog";
import { MySideMenu } from "./my-side-menu";

const path = "/my/company-merge";
const receipts: Record<CompanyMergeAction["kind"], string> = {
  request: "검토 신청을 보냈어요!", propose: "최초 통합 제안을 보냈어요!", accept: "통합 제안을 수락했어요!", decline: "통합 제안을 거절했어요.",
};
const errors = {
  login: "다시 로그인하고 통합 요청을 확인해 주세요.",
  access: "이 통합 사건을 확인하거나 처리할 권한이 없어요.",
  conflict: "회사나 통합 요청의 상태가 바뀌었어요. 최신 상태를 확인해 주세요.",
  unconfirmed: "처리 결과를 확인하지 못했어요. 같은 통합 사건의 상태를 다시 조회해 주세요.",
  lookup: "통합 요청을 확인하지 못했어요. 다시 조회해 주세요.",
};
type Screen = { status: "loading" } | { status: "ready"; view: CompanyMergeView } | { status: "error"; kind: keyof typeof errors };

function screenError(error: unknown, unconfirmed: boolean): Screen {
  if (error instanceof ApiError && error.status === 401) return { status: "error", kind: "login" };
  if (unconfirmed || error instanceof CompanyMergeUnconfirmed) return { status: "error", kind: "unconfirmed" };
  if (error instanceof ApiError && (error.status === 403 || error.status === 404)) return { status: "error", kind: "access" };
  if (error instanceof ApiError && error.status === 409) return { status: "error", kind: "conflict" };
  return { status: "error", kind: "lookup" };
}

function Login() {
  return <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(path)}`}>로그인하고 돌아오기</ButtonLink>;
}

function Shell({ children, onNavigate, onLogoutChange, contentRef }: {
  children: React.ReactNode;
  onNavigate?: () => void;
  onLogoutChange?: (pending: boolean) => void;
  contentRef?: React.RefObject<HTMLElement | null>;
}) {
  return <div className="mx-auto flex w-full max-w-[1668px] flex-1 flex-col gap-6 px-4 pb-24 pt-[30px] sm:px-6 lg:flex-row xl:px-0">
    <MySideMenu value="merge" onNavigate={onNavigate} onLogoutChange={onLogoutChange} />
    <section aria-label="나의 회사 통합" className="w-full min-w-0 max-w-[1180px] focus:outline-none" ref={contentRef} tabIndex={-1}>
      {children}
    </section>
  </div>;
}

function MergeMessage({ title, error = false, children }: { title: string; error?: boolean; children?: React.ReactNode }) {
  return <div className="rounded-2xl bg-grayscale-50 p-6 text-grayscale-800">
    <h1 role={error ? "alert" : "status"} className="type-heading-7">{title}</h1>
    {children && <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>}
  </div>;
}

function NoCurrentCase({ status, onEligibility, onReload }: {
  status: Exclude<CompanyMergeView["status"], "case">;
  onEligibility: () => void;
  onReload: () => void;
}) {
  if (status === "no-company") return <MergeMessage title="연결된 회사가 없어요.">
    <ButtonLink href="/my/company" variant="outline">나의 회사 확인하기</ButtonLink>
    <Button onClick={onEligibility} variant="text_gray">통합 자격 확인</Button>
  </MergeMessage>;
  return <div className="flex min-h-64 flex-col items-center justify-center gap-4 py-8 text-center lg:min-h-[calc(100dvh-210px)]">
    <Image alt="" width={80} height={80} src="/images/alarms/no-result.png" />
    <div>
      <h1 className="type-heading-8 text-grayscale-800">{status === "empty" ? "아직 확인할 통합 요청이 없어요!" : "현재 회사에서 확인할 수 있는 통합 요청이 없어요."}</h1>
      <p className="mt-2 type-body-3 text-grayscale-600">{status === "empty" ? "접근할 수 있는 통합 사건이 생기면 이곳에서 확인할 수 있어요." : "현재 소속과 통합 요청을 볼 수 있는 권한을 확인해 주세요."}</p>
    </div>
    <div className="flex flex-wrap justify-center gap-2">
      <Button onClick={onEligibility} variant="text_gray" size="xs">통합 자격 확인</Button>
      <Button onClick={onReload} variant="text_gray" size="xs">상태 다시 확인</Button>
    </div>
  </div>;
}

export function CompanyMergeClient() {
  const { state, getSessionEpoch, refresh } = useAuthSession();
  if (state.status === "authenticated") {
    const { account, companyContext } = state.authentication;
    return <AuthenticatedMerge key={`${account.id}:${getSessionEpoch()}:${companyContext?.companyId ?? "none"}`} />;
  }
  return <Shell>
    {state.status === "loading" && <MergeMessage title="로그인 상태를 확인하고 있어요." />}
    {state.status === "anonymous" && <MergeMessage title="로그인하면 나의 회사 통합을 확인할 수 있어요."><Login /></MergeMessage>}
    {state.status === "error" && <MergeMessage title="로그인 상태를 확인하지 못했어요." error>
      <Button onClick={() => void refresh().catch(() => undefined)} variant="outline">로그인 상태 다시 확인</Button>
    </MergeMessage>}
  </Shell>;
}

function AuthenticatedMerge() {
  const { getAccessToken, getAccountKey, getSessionEpoch, refresh } = useAuthSession();
  const [screen, setScreen] = useState<Screen>({ status: "loading" });
  const [dialog, setDialog] = useState<MergeDialogIntent | null>(null);
  const [pending, setPending] = useState(false);
  const [canReadCurrent, setCanReadCurrent] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const active = useRef<AbortController | null>(null);
  const reference = useRef<CompanyMergeReference | undefined>(undefined);
  const unconfirmed = useRef(false);
  const dismissReceipt = useRef<(() => void) | null>(null);
  const content = useRef<HTMLElement>(null);
  const restoreFocus = useRef(false);

  const conceal = useCallback(() => {
    active.current?.abort();
    active.current = null;
    dismissReceipt.current?.();
    dismissReceipt.current = null;
    setDialog(null);
    setPending(false);
    setScreen({ status: "loading" });
    setNotice(null);
  }, []);

  const reload = useCallback(async (exact: boolean, focus: boolean) => {
    conceal();
    if (!exact) {
      reference.current = undefined;
      unconfirmed.current = false;
    }
    const controller = new AbortController();
    const saved = reference.current;
    const epoch = getSessionEpoch();
    const account = getAccountKey();
    active.current = controller;
    const current = () => account !== null && account === getAccountKey() && epoch === getSessionEpoch() && !controller.signal.aborted;
    try {
      const view = await loadCompanyMerge({ getAccessToken, getAccountKey, refresh }, controller.signal, current, saved);
      if (!current()) return;
      restoreFocus.current = focus;
      if (view.status === "case") {
        reference.current = companyMergeReference(view);
        if (unconfirmed.current) setNotice("같은 통합 사건의 최신 상태를 확인했어요.");
        unconfirmed.current = false;
      } else if (unconfirmed.current) {
        setScreen({ status: "error", kind: "unconfirmed" });
        setCanReadCurrent(true);
        return;
      } else reference.current = undefined;
      setCanReadCurrent(false);
      setScreen({ status: "ready", view });
    } catch (error) {
      if (current()) {
        restoreFocus.current = focus;
        setCanReadCurrent(saved !== undefined);
        setScreen(screenError(error, unconfirmed.current));
      }
    } finally { if (active.current === controller) active.current = null; }
  }, [conceal, getAccessToken, getAccountKey, getSessionEpoch, refresh]);

  useEffect(() => {
    function resume() { if (document.visibilityState === "visible") void reload(true, false); }
    function visibility() { if (document.visibilityState === "visible") resume(); else conceal(); }
    resume();
    window.addEventListener("pagehide", conceal);
    window.addEventListener("pageshow", resume);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      active.current?.abort();
      dismissReceipt.current?.();
      window.removeEventListener("pagehide", conceal);
      window.removeEventListener("pageshow", resume);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [conceal, reload]);

  useEffect(() => {
    if (screen.status !== "loading" && restoreFocus.current) {
      restoreFocus.current = false;
      content.current?.focus();
    }
  }, [screen]);

  async function submit(action: CompanyMergeAction) {
    if (active.current || screen.status !== "ready" || screen.view.status !== "case") return;
    const controller = new AbortController();
    const saved = companyMergeReference(screen.view);
    const epoch = getSessionEpoch();
    const account = getAccountKey();
    const current = () => account !== null && account === getAccountKey() && epoch === getSessionEpoch() && !controller.signal.aborted;
    active.current = controller;
    reference.current = saved;
    unconfirmed.current = true;
    setPending(true);
    setNotice(null);
    try {
      const view = await submitCurrentCompanyMerge({ getAccessToken, getAccountKey, refresh }, controller.signal, current, saved, action);
      if (!current()) return;
      reference.current = companyMergeReference(view);
      unconfirmed.current = false;
      restoreFocus.current = true;
      setScreen({ status: "ready", view });
      dismissReceipt.current = showToast(receipts[action.kind]);
    } catch (error) {
      if (!current()) return;
      unconfirmed.current = error instanceof CompanyMergeUnconfirmed;
      restoreFocus.current = true;
      setCanReadCurrent(true);
      setScreen(screenError(error, unconfirmed.current));
    } finally {
      if (active.current === controller) {
        active.current = null;
        if (current()) { setDialog(null); setPending(false); }
      }
    }
  }

  function logoutChange(started: boolean) {
    if (started) { reference.current = undefined; unconfirmed.current = false; conceal(); }
    else if (getAccountKey() !== null) void reload(false, true);
  }
  const readAgain = () => void reload(true, true);
  return <Shell contentRef={content} onNavigate={conceal} onLogoutChange={logoutChange}>
    {notice && <p className="mb-4 rounded-lg bg-primary-100 p-4 type-body-3 text-grayscale-800" role="status">{notice}</p>}
    {screen.status === "loading" && <MergeMessage title="현재 회사의 통합 요청을 확인하고 있어요." />}
    {screen.status === "error" && <MergeMessage title={errors[screen.kind]} error>
      {screen.kind === "login" ? <Login /> : <>
        <Button onClick={readAgain} variant="outline">다시 조회하기</Button>
        {canReadCurrent && <Button onClick={() => void reload(false, true)} variant="text_gray">현재 요청 보기</Button>}
      </>}
    </MergeMessage>}
    {screen.status === "ready" && (screen.view.status === "case"
      ? <CompanyMergeCaseView key={`${screen.view.value.caseId}:${screen.view.value.revision}`} snapshot={screen.view} onOpen={setDialog} onReload={readAgain} />
      : <NoCurrentCase status={screen.view.status} onEligibility={() => setDialog({ kind: "eligibility" })} onReload={readAgain} />)}
    {dialog && <CompanyMergeDialog intent={dialog} pending={pending} close={() => setDialog(null)} submit={action => void submit(action)} />}
  </Shell>;
}
