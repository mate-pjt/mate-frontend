"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { errorMessage } from "@/features/auth/api";
import { getMembershipContext, requestMembership } from "@/features/auth/onboarding-api";
import { useAuthSession } from "@/features/auth/session";
import type { MembershipApplicationContext } from "@/features/auth/types";

export function MembershipApplication({ companyId }: { companyId: number }) {
  const access = useAuthSession();
  const [context, setContext] = useState<MembershipApplicationContext | null>(null);
  const [representative, setRepresentative] = useState<boolean | null>(null);
  const [positionId, setPositionId] = useState("");
  const [customPosition, setCustomPosition] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (access.state.status !== "authenticated") return;
    let active = true;
    void getMembershipContext(access, companyId).then((value) => {
      if (active) setContext(value);
    }).catch((reason: unknown) => {
      if (active) setError(errorMessage(reason));
    });
    return () => { active = false; };
  }, [access, companyId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!context || context.availability !== "AVAILABLE" || representative === null || busy) return;
    if (!representative && !positionId && !customPosition.trim()) {
      setError("직급을 선택하거나 입력해 주세요.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await requestMembership(access, {
        companyId,
        representative,
        positionId: representative || !positionId ? null : Number(positionId),
        proposedPositionName: representative || positionId ? null : customPosition.trim(),
        message: message.trim() || null,
      });
      setDone(true);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthGate>
      <AuthCard>
        <AuthBack href="/auth/company/search" />
        {done ? (
          <div className="space-y-5 text-center">
            <h1 className="text-grayscale-800 type-heading-7">통합 요청을 보냈어요!</h1>
            <p className="text-grayscale-600 type-body-3">회사 관리자가 요청을 확인한 뒤 결과를 알려드릴게요.</p>
            <Link className="inline-block rounded-lg bg-primary px-5 py-3 text-white" href="/bids">입찰공고 둘러보기</Link>
          </div>
        ) : (
          <>
            <h1 className="mb-6 text-grayscale-800 type-heading-7">이미 등록된 회사가 있다면<br />통합 요청해볼까요?</h1>
            {context ? (
              <form className="space-y-5" onSubmit={(event) => void submit(event)}>
                <div className="rounded-xl border border-grayscale-200 p-4">
                  <p className="font-semibold">{context.company.companyName}</p>
                  <p className="text-grayscale-600 type-body-7">{context.company.businessNumber} · {context.company.baseAddress ?? "주소 정보 없음"}</p>
                </div>
                <div className="grid gap-4 rounded-xl bg-grayscale-50 p-4 sm:grid-cols-2">
                  <div><p className="text-grayscale-600 type-body-7">이름</p><p>{context.accountName ?? "이름 정보 없음"}</p></div>
                  <div><p className="text-grayscale-600 type-body-7">Google 확인 이메일</p><p>{context.googleVerifiedEmail ?? "이메일 정보 없음"}</p></div>
                </div>
                {context.availability !== "AVAILABLE" ? <AuthError message="현재 이 회사에 통합 요청할 수 없습니다. 기존 요청이나 초대를 확인해 주세요." /> : null}
                <fieldset className="space-y-2">
                  <legend className="mb-2 font-medium">대표자 여부</legend>
                  <div className="grid grid-cols-2 gap-2">
                    <button className={`rounded-lg border px-4 py-3 ${representative === true ? "border-primary text-primary" : "border-grayscale-200"}`} onClick={() => setRepresentative(true)} type="button">대표자</button>
                    <button className={`rounded-lg border px-4 py-3 ${representative === false ? "border-primary text-primary" : "border-grayscale-200"}`} onClick={() => setRepresentative(false)} type="button">팀원</button>
                  </div>
                </fieldset>
                {representative === false ? (
                  <div className="space-y-2">
                    <label className="block font-medium" htmlFor="position">직급</label>
                    <select className="h-12 w-full rounded-lg border border-grayscale-200 bg-white px-3" id="position" onChange={(event) => setPositionId(event.target.value)} value={positionId}>
                      <option value="">직급 직접 입력</option>
                      {context.positions.map((position) => <option key={position.positionId} value={position.positionId}>{position.name}</option>)}
                    </select>
                    {!positionId ? <TextInput className="w-full" maxLength={30} onValueChange={setCustomPosition} placeholder="직급을 입력해 주세요." value={customPosition} /> : null}
                  </div>
                ) : null}
                <label className="block space-y-2 font-medium">
                  관리자에게 전달할 메시지(선택)
                  <textarea className="min-h-24 w-full rounded-lg border border-grayscale-200 p-3 font-normal" maxLength={150} onChange={(event) => setMessage(event.target.value)} placeholder="관리자에게 전달할 메시지를 간단히 적어주세요!" value={message} />
                  <span className="block text-right text-grayscale-600 type-body-7">{message.length}/150</span>
                </label>
                <AuthError message={error} />
                <Button className="h-14 w-full" disabled={busy || representative === null || context.availability !== "AVAILABLE"} type="submit">{busy ? "요청하고 있어요..." : "통합 요청하기"}</Button>
              </form>
            ) : <p>{error ?? "회사 정보를 불러오고 있어요."}</p>}
          </>
        )}
      </AuthCard>
    </AuthGate>
  );
}
