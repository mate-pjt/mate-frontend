"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { Button } from "@/components/ui/button";
import { ApiError, errorMessage } from "@/data/shared/errors";
import { acceptInvitation, declineInvitation, previewInvitation, resumeInvitation } from "@/data/company/client";
import { useAuthSession } from "@/features/auth/session";
import type { InvitationContext } from "@/data/company/contracts";
import type { AuthAccess } from "@/data/shared/http";
import { isInvitationAcceptanceUnconfirmed, type InvitationCompletion } from "@/features/company/invitation-completion";
import { useCompanyFlowScope } from "@/features/company/use-flow-scope";
import { authExitEvent } from "@/lib/auth-redirect";
import { InvitationCompletionCard } from "./invitation-completion-card";

const invitationPath = "/auth/company/invitations";
const roleLabels = { ADMIN: "관리자", AGENT: "담당자", VIEWER: "조회자" } as const;

export function InvitationClient() {
  const { state, getSessionEpoch } = useAuthSession();
  const account = state.status === "authenticated" ? state.authentication.account.id : null;
  const epoch = getSessionEpoch();
  const [visit, setVisit] = useState(0);
  const [identity, setIdentity] = useState({ account, epoch, revision: 0 });
  if (epoch !== identity.epoch || (account !== null && account !== identity.account)) {
    // Initial login restoration can race the fragment preview without replacing the screen.
    const replaced = epoch !== identity.epoch || identity.account !== null;
    setIdentity({ account, epoch, revision: identity.revision + Number(replaced) });
  }

  useEffect(() => {
    function revisit() {
      if (window.location.pathname === invitationPath) setVisit(previous => previous + 1);
    }
    function restore(event: PageTransitionEvent) {
      if (event.persisted) revisit();
    }
    window.addEventListener("popstate", revisit);
    window.addEventListener("pageshow", restore);
    return () => {
      window.removeEventListener("popstate", revisit);
      window.removeEventListener("pageshow", restore);
    };
  }, []);

  return <InvitationFlow key={`${visit}:${identity.revision}`} account={account} />;
}

function InvitationFlow({ account }: { account: number | null }) {
  const { state, getAccessToken, refresh, getAccountKey, logout, startGoogleLogin } = useAuthSession();
  const access = useMemo<AuthAccess>(() => ({ getAccessToken, refresh, getAccountKey }), [getAccessToken, refresh, getAccountKey]);
  const scope = useCompanyFlowScope();
  const leaving = useRef(false);
  const previewRequest = useRef<Promise<InvitationContext | null> | null>(null);
  const [preview, setPreview] = useState<InvitationContext | null>(null);
  const [resumed, setResumed] = useState<InvitationContext | "account-mismatch" | null>(null);
  const [previewStatus, setPreviewStatus] = useState<"checking" | "ready" | "failed">("checking");
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState<{ completion: InvitationCompletion; isCurrent: () => boolean } | "declined" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accountMismatch = account !== null && (resumed === "account-mismatch" || resumed?.emailMatched === false);
  const needsSignIn = state.status === "anonymous" && previewStatus === "ready";
  const context = account === null ? preview : resumed === "account-mismatch" ? null : resumed;

  const leave = useCallback(() => {
    leaving.current = true;
    scope.dispose();
  }, [scope]);
  const onInvitationPage = useCallback(() => !leaving.current && window.location.pathname === invitationPath, []);
  useEffect(() => {
    window.addEventListener(authExitEvent, leave);
    window.addEventListener("pagehide", leave);
    window.addEventListener("popstate", leave);
    return () => {
      window.removeEventListener(authExitEvent, leave);
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("popstate", leave);
    };
  }, [leave]);

  useEffect(() => {
    if (!previewRequest.current) {
      const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
      if (token) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      previewRequest.current = token ? previewInvitation(token) : Promise.resolve(null);
    }
    let active = true;
    void previewRequest.current.then(value => {
      if (active && onInvitationPage()) { setPreview(value); setPreviewStatus("ready"); }
    }).catch((reason: unknown) => {
      if (active && onInvitationPage()) { setError(errorMessage(reason)); setPreviewStatus("failed"); }
    });
    return () => { active = false; };
  }, [onInvitationPage]);

  useEffect(() => {
    if (previewStatus !== "ready" || finished || busy || account === null) return;
    let active = true;
    const request = scope.capture();
    const isCurrent = () => active && request.current() && onInvitationPage();
    const assertRequestScope = () => { if (!isCurrent()) throw new DOMException("aborted", "AbortError"); };
    void resumeInvitation({ ...access, assertRequestScope })
      .then(value => { if (isCurrent()) setResumed(value); })
      .catch((reason: unknown) => {
        if (!isCurrent()) return;
        const mismatch = reason instanceof ApiError && reason.status === 403 && reason.code === "CI006";
        setResumed(mismatch ? "account-mismatch" : null);
        setError(mismatch ? null : errorMessage(reason));
      });
    return () => { active = false; };
  }, [access, account, busy, finished, onInvitationPage, previewStatus, scope]);

  async function decide(accept: boolean) {
    if (!context || context.emailMatched !== true || (accept && !context.canAccept) || !onInvitationPage()) return;
    const request = scope.begin();
    if (!request) return;
    const isCurrent = () => request.current(true) && onInvitationPage();
    const assertRequestScope = () => {
      if (!request.current() || !onInvitationPage()) throw new DOMException("aborted", "AbortError");
    };
    const scopedAccess: AuthAccess = {
      ...access, assertRequestScope,
      refresh(options) { assertRequestScope(); return refresh(options); },
    };
    setBusy(true);
    setError(null);
    let settled = false;
    try {
      if (accept) {
        const result = await acceptInvitation(scopedAccess, context.version);
        if (!isCurrent()) return;
        const completion: InvitationCompletion = result.companyId === context.companyId
          ? { kind: "accepted", receipt: result, sessionWarning: result.sessionWarning }
          : { kind: "uncertain", companyId: context.companyId };
        setFinished({ completion, isCurrent });
      } else {
        await declineInvitation(scopedAccess, context.version);
        if (!isCurrent()) return;
        setFinished("declined");
      }
      settled = true;
    } catch (reason) {
      if (!isCurrent()) return;
      if (accept && isInvitationAcceptanceUnconfirmed(reason)) {
        settled = true;
        setFinished({ completion: { kind: "uncertain", companyId: context.companyId }, isCurrent });
      } else {
        setResumed(null);
        setError(errorMessage(reason));
      }
    } finally {
      if (!settled) request.finish();
      if (isCurrent()) setBusy(false);
    }
  }

  async function switchAccount() {
    const request = scope.begin();
    if (!request || !onInvitationPage()) return;
    setBusy(true);
    try {
      await logout();
      if (onInvitationPage()) startGoogleLogin(invitationPath, "alternate");
    } catch (reason) {
      if (onInvitationPage()) {
        setError(errorMessage(reason));
        setBusy(false);
      }
      request.finish();
    }
  }

  if (finished && finished !== "declined") return (
    <InvitationCompletionCard access={access} authenticated={account !== null} completion={finished.completion} isCurrent={finished.isCurrent} onLeave={leave} />
  );
  if (finished === "declined") return (
    <AuthCard className="mx-auto max-w-[420px] space-y-5 text-center">
      <h1 className="text-grayscale-800 type-heading-7">초대를 거절했어요.</h1>
      <p className="text-grayscale-600 type-body-7">필요하면 회사 관리자에게 다시 초대를 요청해 주세요.</p>
      <Link className="inline-block w-full rounded-xl bg-primary px-5 py-4 text-white" href="/bids" onNavigate={leave}>입찰공고로 이동하기</Link>
    </AuthCard>
  );

  return (
    <AuthCard>
      <AuthBack href="/auth/start" onNavigate={leave} />
      <h1 className="mb-6 break-words text-grayscale-800 type-heading-7">{context?.companyName ?? "회사"}에서<br />보낸 초대가 도착했어요!</h1>
      {context ? (
        <>
          <div className="grid gap-4 rounded-2xl bg-grayscale-50 p-4 text-grayscale-800 type-body-2 sm:grid-cols-2">
            <div><p className="mb-1 text-grayscale-600 type-body-7">이름</p><p className="break-words">{context.inviteeDisplayName}</p></div>
            <div><p className="mb-1 text-grayscale-600 type-body-7">직급</p><p className="break-words">{context.position?.name ?? "미지정"}</p></div>
            <div><p className="mb-1 text-grayscale-600 type-body-7">역할</p><p>{roleLabels[context.role]}</p></div>
            <div><p className="mb-1 text-grayscale-600 type-body-7">만료</p><p>{new Date(context.expiresAt).toLocaleDateString("ko-KR")}</p></div>
          </div>
          {account !== null && context.emailMatched === true ? (
            <div className="mt-[30px] grid gap-[10px] min-[440px]:grid-cols-2">
              <Button className="h-16 w-full" disabled={busy} onClick={() => void decide(false)} size="xxl" variant="gray">초대 거절하기</Button>
              <Button className="h-16 w-full" disabled={busy || !context.canAccept} onClick={() => void decide(true)} size="xxl">초대 수락하기</Button>
            </div>
          ) : null}
        </>
      ) : !accountMismatch && !needsSignIn && <p className="text-grayscale-600 type-body-3" role="status">{previewStatus === "checking" || state.status === "loading" || (account !== null && previewStatus === "ready" && !error) ? "초대를 확인하고 있어요." : "초대 정보를 확인하지 못했습니다."}</p>}
      {needsSignIn ? (
        <div className="mt-[30px] space-y-3">
          <p className="text-grayscale-600 type-body-7">초대받은 Google 계정으로 로그인해 주세요.</p>
          <button className="w-full rounded-xl bg-primary px-5 py-4 text-white" onClick={() => startGoogleLogin(invitationPath, "alternate")} type="button">Google로 로그인</button>
        </div>
      ) : null}
      {accountMismatch ? (
        <div className="mt-[30px] space-y-3">
          <AuthError message="초대받은 Google 계정이 아니에요. 초대받은 이메일 계정으로 다시 로그인해 주세요." />
          <Button className="w-full" disabled={busy} onClick={() => void switchAccount()}>다른 Google 계정으로 로그인</Button>
        </div>
      ) : null}
      {state.status === "error" ? (
        <button className="text-primary underline type-body-7" onClick={() => void refresh().catch(() => undefined)} type="button">로그인 상태 다시 확인하기</button>
      ) : null}
      {error ? <div className="mt-6"><AuthError message={error} /></div> : null}
    </AuthCard>
  );
}
