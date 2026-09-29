"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { CompanyEvidencePanel, CompanyIdentityPanel, RegistrationFinished, RegistrationPreferences } from "@/components/auth/company-registration";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { ApiError, errorMessage } from "@/features/auth/api";
import { clearBusinessConnection, createBusinessConnection, createUnverifiedCompany, getBusinessConnection } from "@/features/auth/onboarding-api";
import { useAuthSession } from "@/features/auth/session";
import type { BidAmountRange, BusinessConnection } from "@/features/auth/types";

type Step = "input" | "enriching" | "identity" | "evidence" | "preferences" | "not-found" | "verified" | "done";

export function BusinessNumberRegistration() {
  const session = useAuthSession();
  const access = useMemo(() => ({ getAccessToken: session.getAccessToken, refresh: session.refresh }), [session.getAccessToken, session.refresh]);
  const [step, setStep] = useState<Step>("input");
  const [businessNumber, setBusinessNumber] = useState("");
  const [connection, setConnection] = useState<BusinessConnection | null>(null);
  const [representative, setRepresentative] = useState<boolean | null>(null);
  const [positionName, setPositionName] = useState("");
  const [amountRange, setAmountRange] = useState<BidAmountRange | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneWarning, setDoneWarning] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [restoreFailed, setRestoreFailed] = useState(false);
  const connectKey = useRef<string | null>(null);
  const registerKey = useRef<{ payload: string; key: string } | null>(null);

  const handleConnection = useCallback((value: BusinessConnection) => {
    setConnection(value);
    setBusinessNumber(value.businessNumber);
    if (value.enrichmentRun.status === "COMPLETED") {
      setStep(value.companyProfile.companyName && value.companyProfile.baseAddress ? "identity" : "not-found");
    } else if (value.enrichmentRun.status === "CANCELLED") {
      setStep("not-found");
    } else {
      setStep("enriching");
    }
  }, []);

  useEffect(() => {
    if (session.state.status !== "authenticated") return;
    let active = true;
    void getBusinessConnection(access)
      .then((value) => {
        if (!active) return;
        handleConnection(value);
        setRestoring(false);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        if (!(reason instanceof ApiError && reason.status === 404)) {
          setError(errorMessage(reason));
          setRestoreFailed(true);
        } else {
          setRestoring(false);
        }
      });
    return () => { active = false; };
  }, [access, handleConnection, session.state.status]);

  useEffect(() => {
    if (step !== "enriching" || session.state.status !== "authenticated") return;
    let active = true;
    let timer: number | undefined;
    async function poll() {
      try {
        const value = await getBusinessConnection(access);
        if (!active) return;
        handleConnection(value);
        if (value.enrichmentRun.status !== "COMPLETED" && value.enrichmentRun.status !== "CANCELLED") {
          timer = window.setTimeout(() => { void poll(); }, 1000);
        }
      } catch (reason) {
        if (active) setError(errorMessage(reason));
      }
    }
    timer = window.setTimeout(() => { void poll(); }, 1000);
    return () => { active = false; window.clearTimeout(timer); };
  }, [access, handleConnection, session.state.status, step]);

  async function connect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = businessNumber.replace(/\D/g, "");
    if (digits.length !== 10 || busy || restoring) {
      setError("사업자등록번호 10자리를 확인해 주세요.");
      return;
    }
    if (connection?.businessNumber.replace(/\D/g, "") === digits) {
      handleConnection(connection);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (connection) {
        await clearBusinessConnection(access);
        setConnection(null);
      }
      connectKey.current ??= crypto.randomUUID();
      handleConnection(await createBusinessConnection(access, digits, connectKey.current));
    } catch (reason) {
      if (reason instanceof ApiError && reason.code === "COMPANY_ALREADY_VERIFIED") setStep("verified");
      else setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  async function retryLookup() {
    setBusy(true);
    setError(null);
    try {
      handleConnection(await getBusinessConnection(access));
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  async function retryRestore() {
    setBusy(true);
    setError(null);
    try {
      handleConnection(await getBusinessConnection(access));
      setRestoring(false);
      setRestoreFailed(false);
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 404) {
        setRestoring(false);
        setRestoreFailed(false);
      } else {
        setError(errorMessage(reason));
      }
    } finally {
      setBusy(false);
    }
  }

  async function register() {
    if (!connection || representative === null || !amountRange || busy) return;
    if (!representative && !positionName.trim()) {
      setError("직급을 입력해 주세요.");
      return;
    }
    const body = {
      connectionId: connection.connectionId,
      preferredBidNoticeAmountRange: amountRange,
      representative,
      positionName: representative ? null : positionName.trim(),
    };
    const payload = JSON.stringify(body);
    setBusy(true);
    setError(null);
    try {
      if (registerKey.current?.payload !== payload) registerKey.current = { payload, key: crypto.randomUUID() };
      await createUnverifiedCompany(access, body, registerKey.current.key);
      setStep("done");
      try { await access.refresh(); }
      catch { setDoneWarning("회사 등록은 완료됐지만 로그인 상태를 갱신하지 못했습니다. 새로고침 후 확인해 주세요."); }
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  const profile = connection?.companyProfile;
  const backStep = step === "identity" ? "input" : step === "evidence" ? "identity" : "evidence";

  return (
    <AuthGate>
      <AuthCard>
        {step === "input" || step === "enriching" || step === "not-found" || step === "verified" ? <AuthBack href="/auth/company/register" /> : null}
        {step === "identity" || step === "evidence" || step === "preferences" ? (
          <button className="mb-6 text-grayscale-600 type-body-3" onClick={() => setStep(backStep)} type="button">← 뒤로가기</button>
        ) : null}
        {step === "input" && restoring ? (
          <div className="space-y-4" role="status">
            <p className="text-grayscale-700 type-body-3">이전에 조회하던 회사가 있는지 확인하고 있어요.</p>
            {restoreFailed ? <Button disabled={busy} onClick={() => void retryRestore()}>다시 확인하기</Button> : null}
          </div>
        ) : null}
        {step === "input" && !restoring ? (
          <>
            <h1 className="mb-6 text-grayscale-800 type-heading-7">우리 회사를<br />사업자등록번호로 조회 해볼까요?</h1>
            <form className="flex gap-2" onSubmit={(event) => void connect(event)}>
              <TextInput className="min-w-0 flex-1" inputMode="numeric" maxLength={12} onValueChange={(value) => { setBusinessNumber(value); connectKey.current = null; }} placeholder="사업자등록번호 10자리를 입력해주세요." value={businessNumber} />
              <Button className="h-12 shrink-0" disabled={busy || businessNumber.replace(/\D/g, "").length !== 10} type="submit">{busy ? "조회 중..." : connection && connection.businessNumber.replace(/\D/g, "") !== businessNumber.replace(/\D/g, "") ? "이전 조회 종료 후 조회" : "조회하기"}</Button>
            </form>
            <p className="mt-3 rounded-xl bg-grayscale-50 p-4 text-grayscale-600 type-body-7">예시 사업자등록번호: 123-45-67890</p>
          </>
        ) : null}
        {step === "enriching" ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">회사 정보를 불러오고 있어요!</h1>
            <p className="text-grayscale-600 type-body-7">공개된 회사 정보와 실적을 확인 중입니다. 잠시만 기다려 주세요.</p>
            <p className="rounded-xl bg-grayscale-50 p-5 text-primary type-body-3" role="status">{connection?.enrichmentRun.completedSteps ?? 0} / {connection?.enrichmentRun.totalSteps ?? 3} 단계 완료</p>
            <Button disabled={busy} onClick={() => void retryLookup()} variant="secondary">지금 상태 확인</Button>
          </div>
        ) : null}
        {step === "not-found" ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">회사를 찾을 수 없어요!</h1>
            <p className="text-grayscale-600 type-body-7">번호가 틀렸거나 신규 사업자라면 검색되지 않을 수 있어요.</p>
            <Button className="w-full" onClick={() => setStep("input")} variant="secondary">다른 번호 조회하기</Button>
            <Link className="block rounded-lg bg-primary px-5 py-4 text-center text-white" href="/auth/company/register/document">사업자등록증명서로 등록하기</Link>
          </div>
        ) : null}
        {step === "verified" ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">이미 인증된 회사 정보가 있어요!</h1>
            <p className="text-grayscale-600 type-body-7">기존 회사에 통합 요청을 보내면 합류할 수 있어요.</p>
            <Link className="block rounded-lg bg-primary px-5 py-4 text-center text-white" href={`/auth/company/search?query=${encodeURIComponent(businessNumber.replace(/\D/g, ""))}`}>기존 회사 찾기</Link>
          </div>
        ) : null}
        {step === "identity" && profile ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">조회한 회사 정보예요.<br />{profile.companyName} 회사가 맞으신가요?</h1>
            <CompanyIdentityPanel profile={profile} />
            <Button className="h-14 w-full" onClick={() => setStep("evidence")}>다음</Button>
          </div>
        ) : null}
        {step === "evidence" && profile ? (
          <div className="space-y-5">
            <h1 className="text-grayscale-800 type-heading-7">불러온 회사 정보와 실적이<br />모두 맞나요?</h1>
            <CompanyEvidencePanel onNext={() => setStep("preferences")} profile={profile} />
          </div>
        ) : null}
        {step === "preferences" ? (
          <div className="space-y-6">
            <h1 className="text-grayscale-800 type-heading-7">몇 가지만 확인할까요?<br />이제 마지막이에요!</h1>
            <RegistrationPreferences amountRange={amountRange} onAmountRangeChange={setAmountRange} onPositionNameChange={setPositionName} onRepresentativeChange={setRepresentative} positionName={positionName} representative={representative} />
            <Button className="h-14 w-full" disabled={busy || representative === null || !amountRange || (representative === false && !positionName.trim())} onClick={() => void register()}>{busy ? "등록하고 있어요..." : "메이트 시작하기"}</Button>
          </div>
        ) : null}
        {step === "done" ? <RegistrationFinished verified={false} warning={doneWarning} /> : null}
        <div className="mt-4"><AuthError message={error} /></div>
      </AuthCard>
    </AuthGate>
  );
}
