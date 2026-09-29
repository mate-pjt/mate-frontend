"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { Button } from "@/components/ui/button";
import { errorMessage, googleAuthorizationUrl } from "@/features/auth/api";
import { acceptInvitation, declineInvitation, previewInvitation, resumeInvitation } from "@/features/auth/onboarding-api";
import { useAuthSession } from "@/features/auth/session";
import type { InvitationContext } from "@/features/auth/types";

const invitationPath = "/auth/company/invitations";
const roleLabels = { ADMIN: "관리자", AGENT: "담당자", VIEWER: "조회자" } as const;

export function InvitationClient() {
  const access = useAuthSession();
  const initialPreviewStarted = useRef(false);
  const [context, setContext] = useState<InvitationContext | null>(null);
  const [previewStatus, setPreviewStatus] = useState<"checking" | "ready" | "failed">("checking");
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState<"accepted" | "declined" | null>(null);
  const [sessionWarning, setSessionWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPreviewStarted.current) return;
    initialPreviewStarted.current = true;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const token = hash.get("token");
    if (!token) {
      queueMicrotask(() => setPreviewStatus("ready"));
      return;
    }
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    void previewInvitation(token)
      .then((value) => { setContext(value); setPreviewStatus("ready"); })
      .catch((reason: unknown) => { setError(errorMessage(reason)); setPreviewStatus("failed"); });
  }, []);

  useEffect(() => {
    if (previewStatus !== "ready" || finished || access.state.status !== "authenticated") return;
    let active = true;
    void resumeInvitation(access)
      .then((value) => { if (active) setContext(value); })
      .catch((reason: unknown) => { if (active) setError(errorMessage(reason)); });
    return () => { active = false; };
  }, [access, finished, previewStatus]);

  async function decide(accept: boolean) {
    if (!context || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (accept) await acceptInvitation(access, context.version);
      else await declineInvitation(access, context.version);
      setFinished(accept ? "accepted" : "declined");
      if (accept) {
        try { await access.refresh(); }
        catch { setSessionWarning("초대 수락은 완료됐지만 로그인 상태를 갱신하지 못했습니다. 새로고침 후 확인해 주세요."); }
      }
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  async function switchAccount() {
    setBusy(true);
    try {
      await access.logout();
      window.location.assign(googleAuthorizationUrl(invitationPath));
    } catch (reason) {
      setError(errorMessage(reason));
      setBusy(false);
    }
  }

  if (finished) return (
    <AuthCard className="space-y-5 text-center">
      <h1 className="text-grayscale-800 type-heading-7">{finished === "accepted" ? "새로운 팀에 오신 걸 환영해요!" : "초대를 거절했어요."}</h1>
      <p className="text-grayscale-600 type-body-7">{finished === "accepted" ? "회사에 합류했습니다. 메이트 서비스를 시작해 보세요." : "필요하면 회사 관리자에게 다시 초대를 요청해 주세요."}</p>
      <AuthError message={sessionWarning} />
      <Link className="inline-block w-full rounded-xl bg-primary px-5 py-4 text-white" href="/bids">{finished === "accepted" ? "메이트 시작하기" : "입찰공고로 이동하기"}</Link>
    </AuthCard>
  );

  return (
    <AuthCard className="space-y-5">
      <AuthBack href="/auth/start" />
      <h1 className="text-grayscale-800 type-heading-7">{context?.companyName ?? "회사"}에서<br />보낸 초대가 도착했어요!</h1>
      {context ? (
        <>
          <div className="grid gap-4 rounded-xl bg-grayscale-50 p-5 sm:grid-cols-2">
            <div><p className="text-grayscale-600 type-body-7">이름</p><p>{context.inviteeDisplayName}</p></div>
            <div><p className="text-grayscale-600 type-body-7">직급</p><p>{context.position?.name ?? "미지정"}</p></div>
            <div><p className="text-grayscale-600 type-body-7">역할</p><p>{roleLabels[context.role]}</p></div>
            <div><p className="text-grayscale-600 type-body-7">만료</p><p>{new Date(context.expiresAt).toLocaleDateString("ko-KR")}</p></div>
          </div>
          {access.state.status === "anonymous" ? (
            <div className="space-y-3">
              <p className="text-grayscale-600 type-body-7">초대받은 Google 계정으로 로그인해 주세요.</p>
              <button className="w-full rounded-xl bg-primary px-5 py-4 text-white" onClick={() => window.location.assign(googleAuthorizationUrl(invitationPath))} type="button">Google로 로그인</button>
            </div>
          ) : null}
          {access.state.status === "authenticated" && context.emailMatched === false ? (
            <div className="space-y-3">
              <AuthError message="초대받은 Google 계정이 아니에요. 초대받은 이메일 계정으로 다시 로그인해 주세요." />
              <Button className="w-full" disabled={busy} onClick={() => void switchAccount()}>다른 Google 계정으로 로그인</Button>
            </div>
          ) : null}
          {access.state.status === "authenticated" && context.emailMatched !== false ? (
            <div className="grid grid-cols-2 gap-2">
              <Button className="h-14" disabled={busy} onClick={() => void decide(false)} variant="secondary">초대 거절하기</Button>
              <Button className="h-14" disabled={busy || !context.canAccept} onClick={() => void decide(true)}>초대 수락하기</Button>
            </div>
          ) : null}
        </>
      ) : <p className="text-grayscale-600 type-body-3">{previewStatus === "checking" ? "초대를 확인하고 있어요." : "초대 정보를 확인하지 못했습니다."}</p>}
      {access.state.status === "error" ? (
        <button className="text-primary underline type-body-7" onClick={() => void access.refresh().catch(() => undefined)} type="button">로그인 상태 다시 확인하기</button>
      ) : null}
      <AuthError message={error} />
    </AuthCard>
  );
}
