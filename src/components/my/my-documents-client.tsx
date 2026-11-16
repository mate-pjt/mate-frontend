"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AddIcon, RightArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import { documentPeriod, documentStatusLabel, koreanDate, loadDocumentBox, type DocumentBoxResult, type DocumentBoxRow } from "@/features/company/document-box";
import { documentDetailPath, documentListPath } from "@/features/company/document-detail";
import { DocumentReuploadButton } from "./document-reupload-dialog";

type Result = DocumentBoxResult | { status: "loading" } | { status: "error"; message: string } | { status: "unauthorized" | "denied" };

export function MyDocumentsClient({ initialPage = 1 }: { initialPage?: number }) {
  const { state, refresh, getAccessToken, getAccountKey, getSessionEpoch } = useAuthSession();
  if (state.status === "authenticated") {
    return <AuthenticatedDocuments getAccessToken={getAccessToken} getAccountKey={getAccountKey} refresh={refresh} getSessionEpoch={getSessionEpoch} initialPage={initialPage}
      key={`${state.authentication.account.id}:${getSessionEpoch()}:${state.authentication.companyContext?.companyId ?? "none"}:${initialPage}`} />;
  }
  return (
    <DocumentsShell>
      <h1 className="mb-6 type-heading-9 text-grayscale-800">서류함</h1>
      {state.status === "anonymous" ? <Message title="로그인하면 회사 서류를 확인할 수 있어요."><LoginLink /></Message> : (
        <Message title={state.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 상태를 확인하고 있어요."} error={state.status === "error"}>
          {state.status === "error" && <Button onClick={() => void refresh().catch(() => undefined)} variant="outline">다시 시도하기</Button>}
        </Message>
      )}
    </DocumentsShell>
  );
}

function AuthenticatedDocuments({ getAccessToken, refresh, getAccountKey, getSessionEpoch, initialPage }: AuthAccess & { getSessionEpoch: () => number; initialPage: number }) {
  const router = useRouter();
  const [result, setResult] = useState<Result>({ status: "loading" });
  const page = initialPage - 1;
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(Date.now);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusAfterLoad = useRef(initialPage > 1);

  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const epoch = getSessionEpoch();
    void loadDocumentBox({ getAccessToken, refresh, getAccountKey }, page, controller.signal, undefined, () => epoch === getSessionEpoch()).then(value => {
      if (!controller.signal.aborted && epoch === getSessionEpoch()) setResult(value);
    }).catch(error => {
      if (controller.signal.aborted || epoch !== getSessionEpoch()) return;
      if (error instanceof ApiError && error.status === 401) setResult({ status: "unauthorized" });
      else if (error instanceof ApiError && error.status === 403) setResult({ status: "denied" });
      else setResult({ status: "error", message: errorMessage(error) });
    });
    return () => controller.abort();
  }, [getAccessToken, refresh, getAccountKey, getSessionEpoch, page, attempt]);

  useEffect(() => {
    if (result.status !== "loading" && focusAfterLoad.current) { heading.current?.focus(); focusAfterLoad.current = false; }
  }, [result]);

  function reload(nextPage = page) {
    focusAfterLoad.current = true;
    setResult({ status: "loading" });
    if (nextPage !== page) router.push(documentListPath(nextPage + 1));
    else setAttempt(current => current + 1);
  }

  return (
    <DocumentsShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="type-heading-9 text-grayscale-800 focus:outline-none" ref={heading} tabIndex={-1}>서류함</h1>
        <Button variant="text_gray" size="xs" onClick={() => reload()} disabled={result.status === "loading"}>새로고침</Button>
      </div>
      {result.status === "loading" && <Message title="서류함을 확인하고 있어요." />}
      {result.status === "unauthorized" && <Message title="로그인이 필요해요."><LoginLink /></Message>}
      {result.status === "denied" && <Message title="회사 서류를 관리할 권한이 없어요." error><p>회사 관리자에게 서류 관리 권한을 확인해 주세요.</p><Button onClick={() => reload()} variant="outline">다시 확인하기</Button></Message>}
      {result.status === "error" && <Message title={result.message} error><Button onClick={() => reload()} variant="outline">다시 시도하기</Button></Message>}
      {result.status === "no-company" && <Message title="연결된 회사가 없어요."><ButtonLink href="/my/company" variant="outline">나의 회사 확인하기</ButtonLink></Message>}
      {result.status === "ready" && (
        <>
          <p className="mb-4 type-body-7 text-grayscale-600" role="status">전체 {result.page.totalElements.toLocaleString("ko-KR")}개 · 최근 변경순</p>
          {result.page.totalElements === 0 ? <EmptyDocument /> : result.page.content.length === 0 ? (
            <Message title="이 페이지에는 서류가 없어요."><Button variant="outline" onClick={() => reload(0)}>첫 페이지로 돌아가기</Button></Message>
          ) : <ul className="flex flex-col gap-3" aria-label="회사 서류 목록">{result.page.content.map(item => <DocumentRow key={item.documentId} item={item} now={now} page={initialPage} onChanged={() => reload()} />)}</ul>}
          {result.page.totalPages > 1 && result.page.content.length > 0 && <div className="mt-6 flex justify-center"><Pagination ariaLabel="서류함 페이지" page={page + 1} totalPages={result.page.totalPages} onPageChange={next => reload(next - 1)} /></div>}
          <p className="mt-5 type-body-7 text-grayscale-600" id="document-actions-help">미리보기에서 상세·버전 이력을 확인할 수 있어요. 기존 서류의 다시 업로드를 지원해요. 신규 서류 추가는 준비 중이에요. 문서 처리·보유·유효기간과 회사 인증·회사정보 반영은 각각 다른 상태예요.</p>
        </>
      )}
    </DocumentsShell>
  );
}

function DocumentRow({ item, now, page, onChanged }: { item: DocumentBoxRow; now: number; page: number; onChanged: () => void }) {
  const versions = item.versions;
  return (
    <li className="flex flex-col gap-4 rounded-xl bg-primary-100 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="flex items-center gap-2 type-body-2 text-grayscale-700"><Image alt="" aria-hidden src="/icon/24dp/check_circle.svg" width={20} height={20} />{item.documentType === "BUSINESS_REGISTRATION" ? "사업자등록증명서" : "회사 서류"}</h2>
          <p className="type-body-7 text-primary-400">{koreanDate(Date.parse(item.uploadedAt)).replaceAll("-", ".")} 등록</p>
        </div>
        <p className="mt-2 break-all type-body-7 text-grayscale-700">{item.filename} · v{item.versionNumber} · {item.current ? "현재 문서" : "교체 후보"} · {documentStatusLabel(item.status)}</p>
        {versions.status === "unavailable" ? <p className="mt-2 type-body-7 text-danger">보유·기간 정보를 확인하지 못했어요. 새로고침으로 다시 확인해 주세요.</p> : (
          <div className="mt-2 flex flex-col gap-1 type-body-7 text-grayscale-600">
            <p>{item.current ? "현재 문서" : "표시 후보"} 유효기간: <Period version={versions.displayed} now={now} /></p>
            {!item.current && <p>{versions.current ? <>기존 문서 보유 (v{versions.current.versionNumber}) · <Period version={versions.current} now={now} /></> : "현재 적용된 문서는 없어요."}</p>}
            {item.current && <p>문서 보유</p>}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2" aria-describedby="document-actions-help">
        <ButtonLink variant="outline" href={documentDetailPath(item.documentId, item.versionId, page)} aria-label={`${item.filename} v${item.versionNumber} 상세·미리보기`}>미리보기</ButtonLink>
        <DocumentReuploadButton documentId={item.documentId} onChanged={onChanged} />
      </div>
    </li>
  );
}

function Period({ version, now }: { version: Parameters<typeof documentPeriod>[0]; now: number }) {
  const label = documentPeriod(version, now);
  return <span className={label === "만료" || label === "기간 확인 필요" ? "text-danger" : undefined}>{label}{version.validFrom && label !== "기간 확인 필요" ? ` · ${version.validFrom}부터` : ""}{version.validUntil && label !== "기간 확인 필요" ? ` · ${version.validUntil}까지` : ""}</span>;
}

function EmptyDocument() {
  return <div className="rounded-xl bg-grayscale-50 p-6"><p className="flex items-center gap-2 type-body-2 text-grayscale-700"><AddIcon aria-hidden className="size-5" />사업자등록증명서</p><p className="mt-2 type-body-7 text-grayscale-600">보유한 회사 서류가 없어요. 서류 추가는 준비 중이에요.</p></div>;
}

function Message({ title, error = false, children }: { title: string; error?: boolean; children?: React.ReactNode }) {
  return <div className="flex flex-col items-start gap-3 rounded-xl bg-grayscale-50 p-6 type-body-3 text-grayscale-600" role={error ? "alert" : "status"}><p>{title}</p>{children}</div>;
}
function LoginLink() { return <ButtonLink href="/auth?mode=login&next=%2Fmy%2Fdocuments">로그인하고 돌아오기</ButtonLink>; }
function DocumentsShell({ children }: { children: React.ReactNode }) {
  return <section className="flex-1 bg-grayscale-50 px-4 pb-24 pt-[30px] sm:px-6"><div className="mx-auto w-full max-w-[1100px]">
    <nav className="mb-4 flex items-center gap-1 type-body-3 text-grayscale-600" aria-label="현재 위치"><Link href="/my" className="hover:text-grayscale-700">마이페이지</Link><RightArrowIcon aria-hidden className="size-4" /><span className="type-body-1 text-grayscale-700" aria-current="page">서류함</span></nav>
    <div className="rounded-[20px] bg-white p-6 shadow-[0_0_12px_var(--color-grayscale-100)]">{children}</div>
  </div></section>;
}
