"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthCard, AuthError } from "@/components/auth/auth-screen";
import { Button, ButtonLink } from "@/components/ui/button";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { loadInvitationDestination, readInvitationCompany, type InvitationCompletion, type InvitationDestination } from "@/features/company/invitation-completion";

type DestinationCheck = { kind: "checking" } | { kind: "ready"; destination: InvitationDestination }
  | { kind: "unavailable"; message: string | null };

const unavailable = "현재 소속과 화면을 열 권한을 확인하지 못했어요.";
const signInAgain = "로그인 상태를 다시 확인해 주세요.";
const focusClasses = "h-16 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function InvitationCompletionCard({ access, completion, authenticated, isCurrent, onLeave }: {
  access: AuthAccess;
  completion: InvitationCompletion;
  authenticated: boolean;
  isCurrent: () => boolean;
  onLeave: () => void;
}) {
  const router = useRouter();
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = useRef<AbortController | null>(null);
  const accepted = completion.kind === "accepted";
  const [check, setCheck] = useState<DestinationCheck>(() => {
    if (completion.kind === "uncertain") return { kind: "unavailable", message: null };
    return completion.sessionWarning ? { kind: "unavailable", message: signInAgain } : { kind: "checking" };
  });

  const confirm = useCallback(async (requested?: InvitationDestination) => {
    if (pending.current || !isCurrent()) return;
    const controller = new AbortController();
    pending.current = controller;
    setCheck({ kind: "checking" });
    const stillHere = () => !controller.signal.aborted && isCurrent();
    try {
      if (completion.kind === "uncertain") {
        const companyId = await readInvitationCompany(access, controller.signal, stillHere);
        if (stillHere()) setCheck({ kind: "unavailable", message: companyId === completion.companyId
          ? "현재 소속은 확인했어요. 이 초대의 수락 결과는 확인할 수 없어요."
          : "이 초대의 현재 소속을 확인하지 못했어요." });
        return;
      }
      const destination = await loadInvitationDestination(access, completion.receipt, controller.signal, stillHere);
      if (!stillHere()) return;
      if (destination && destination === requested) {
        onLeave();
        router.push(destination);
      } else {
        setCheck(destination ? { kind: "ready", destination } : { kind: "unavailable", message: unavailable });
      }
    } catch (error) {
      if (stillHere()) setCheck({ kind: "unavailable", message: error instanceof ApiError && error.status === 401 ? signInAgain : unavailable });
    } finally {
      if (pending.current === controller) pending.current = null;
    }
  }, [access, completion, isCurrent, onLeave, router]);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  useEffect(() => {
    let active = true;
    if (completion.kind === "accepted" && !completion.sessionWarning) {
      queueMicrotask(() => { if (active) void confirm(); });
    }
    return () => {
      active = false;
      pending.current?.abort();
      pending.current = null;
    };
  }, [completion, confirm]);

  const destination = check.kind === "ready" && authenticated ? check.destination : undefined;
  const label = destination === "/my/team" ? "팀원 화면으로 이동하기"
    : destination === "/my/company" ? "나의 회사로 이동하기"
    : accepted ? "다시 확인하기" : "상태 다시 확인하기";
  const message = check.kind === "unavailable" ? check.message : check.kind === "ready" && !authenticated ? signInAgain : null;
  return (
    <AuthCard className="mx-auto max-w-[420px] space-y-5 text-center">
      <h1 ref={heading} tabIndex={-1} className="text-grayscale-800 type-heading-7">
        {accepted ? "새로운 팀에 오신 걸 환영해요!" : "초대 수락 결과를 확인하지 못했어요."}
      </h1>
      <p className="text-grayscale-600 type-body-7">
        {accepted ? "회사에 합류했습니다." : "다시 수락하기 전에 현재 소속을 확인해 주세요."}
      </p>
      <AuthError message={message} />
      {check.kind === "checking" && <p className="text-grayscale-600 type-body-7" role="status">현재 소속과 이동할 화면을 확인하고 있어요.</p>}
      <div className="space-y-2">
        <Button className={focusClasses} size="xxl" aria-disabled={check.kind === "checking"} onClick={() => {
          if (check.kind !== "checking") void confirm(destination);
        }}>
          {check.kind === "checking" ? "확인 중…" : label}
        </Button>
        {!destination && <ButtonLink className={focusClasses} size="xxl" variant="tertiary" href="/bids" onNavigate={onLeave}>입찰공고로 이동하기</ButtonLink>}
      </div>
    </AuthCard>
  );
}
