"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { errorMessage } from "@/features/auth/api";
import { searchCompanies } from "@/features/auth/onboarding-api";
import { useAuthSession } from "@/features/auth/session";
import type { CompanySearchPage } from "@/features/auth/types";

export function CompanySearch({ initialQuery = "" }: { initialQuery?: string }) {
  const session = useAuthSession();
  const access = useMemo(() => ({ getAccessToken: session.getAccessToken, refresh: session.refresh }), [session.getAccessToken, session.refresh]);
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<CompanySearchPage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);

  useEffect(() => {
    if (!initialQuery || session.state.status !== "authenticated") return;
    let active = true;
    const version = ++requestVersion.current;
    void searchCompanies(access, initialQuery).then((value) => {
      if (active && version === requestVersion.current) setResult(value);
    }).catch((reason: unknown) => {
      if (active && version === requestVersion.current) setError(errorMessage(reason));
    });
    return () => { active = false; };
  }, [access, initialQuery, session.state.status]);

  async function search(page = 0) {
    const value = query.trim();
    if (!value) return;
    const version = ++requestVersion.current;
    setBusy(true);
    setError(null);
    try {
      const next = await searchCompanies(access, value, page);
      if (version === requestVersion.current) setResult(next);
    } catch (reason) {
      if (version === requestVersion.current) setError(errorMessage(reason));
    } finally {
      if (version === requestVersion.current) setBusy(false);
    }
  }

  function changeQuery(value: string) {
    requestVersion.current += 1;
    setQuery(value);
    setResult(null);
    setError(null);
    setBusy(false);
  }

  return (
    <AuthGate nextPath={initialQuery ? `/auth/company/search?query=${encodeURIComponent(initialQuery)}` : undefined}>
      <AuthCard>
        <AuthBack href="/auth/start" />
        <h1 className="mb-6 text-grayscale-800 type-heading-7">이미 등록된 회사가 있다면<br />통합 요청해볼까요?</h1>
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void search(); }}>
          <TextInput className="min-w-0 flex-1" onValueChange={changeQuery} placeholder="회사명 또는 사업자등록번호 10자리" value={query} />
          <Button className="h-12 shrink-0" disabled={!query.trim() || busy} type="submit">조회하기</Button>
        </form>
        <div className="mt-4"><AuthError message={error} /></div>
        {result?.content.length ? (
          <>
            <ul className="mt-4 space-y-2">
              {result.content.map((company) => (
                <li className="flex items-center justify-between gap-3 rounded-xl border border-grayscale-200 p-4" key={company.companyId}>
                  <div className="min-w-0">
                    <p className="font-semibold text-grayscale-800">{company.companyName} {company.verificationStatus === "VERIFIED" ? <span className="text-success type-body-7">인증</span> : null}</p>
                    <p className="text-grayscale-600 type-body-7">{company.businessNumber} · {company.baseAddress ?? "주소 정보 없음"}</p>
                  </div>
                  <Link className="shrink-0 rounded-lg bg-primary-100 px-3 py-2 text-primary type-body-7" href={`/auth/company/search/${company.companyId}`}>통합 요청</Link>
                </li>
              ))}
            </ul>
            {result.totalPages > 1 ? (
              <div className="mt-4 flex items-center justify-end gap-3 text-grayscale-700 type-body-7">
                <button disabled={busy || result.page === 0} onClick={() => void search(result.page - 1)} type="button">이전</button>
                <span>{result.page + 1} / {result.totalPages}</span>
                <button disabled={busy || result.page + 1 >= result.totalPages} onClick={() => void search(result.page + 1)} type="button">다음</button>
              </div>
            ) : null}
          </>
        ) : result ? (
          <div className="mt-4 rounded-xl bg-grayscale-50 p-8 text-center">
            <p className="text-grayscale-800 type-body-1">우리 회사, 아직 등록 전인가요?</p>
            <p className="mt-2 text-grayscale-600 type-body-7">지금 직접 우리 회사를 등록할 수 있어요.</p>
            <Link className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-white type-body-7" href="/auth/company/register">회사 등록하기</Link>
          </div>
        ) : null}
      </AuthCard>
    </AuthGate>
  );
}
