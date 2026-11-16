"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { RightArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { readCompanyDocumentOriginal, type DocumentDeletion, type DocumentHistoryVersion } from "@/data/company/client";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import { documentPeriod, documentStatusLabel } from "@/features/company/document-box";
import { canReadDocumentOriginal, documentDetailPath, documentFileSize, documentListPath, documentTimestamp, documentVersionLabel, downloadFilename, loadDocumentDetail } from "@/features/company/document-detail";
import { createDocumentOriginalController, type OriginalState } from "@/features/company/document-original";
import { DocumentOriginalViewer } from "./document-original-viewer";
import { DocumentReuploadButton } from "./document-reupload-dialog";
import { DocumentDeletionDialog } from "./document-deletion-dialog";

type Props = { documentId: string; versionId: string | null; listPage: number };
type Result = { status: "loading" } | { status: "ready"; versions: DocumentHistoryVersion[]; selected: DocumentHistoryVersion }
  | { status: "error"; statusCode: number; message: string } | { status: "deleted"; deletion: DocumentDeletion };

export function MyDocumentDetailClient(props: Props) {
  const [completed, setCompleted] = useState<{ documentId: string; account: string | null; epoch: number } | null>(null);
  const query = useSearchParams();
  const selectedIds = query.getAll("version");
  const currentProps = { ...props, versionId: selectedIds.length === 0 ? null : selectedIds.length === 1 ? selectedIds[0] : "invalid" };
  const { state, refresh, getAccessToken, getAccountKey, getSessionEpoch } = useAuthSession();
  if (state.status === "authenticated") return <AuthenticatedDetail {...currentProps} getAccessToken={getAccessToken} getAccountKey={getAccountKey} refresh={refresh} getSessionEpoch={getSessionEpoch}
    onCommitted={() => setCompleted({ documentId: props.documentId, account: getAccountKey(), epoch: getSessionEpoch() })}
    key={`${state.authentication.account.id}:${getSessionEpoch()}:${state.authentication.companyContext?.companyId ?? "none"}:${props.documentId}:${currentProps.versionId}`} />;
  if (completed?.documentId === props.documentId && completed.epoch === getSessionEpoch() && (getAccountKey() === null || completed.account === getAccountKey())) {
    return <DetailShell listPage={props.listPage}><Card><h1 className="mb-6 type-heading-3 text-grayscale-800">서류 삭제는 완료됐어요</h1>
      <Message title="다시 로그인한 뒤 최신 서류함을 확인해 주세요."><ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(documentListPath(props.listPage))}`}>로그인하기</ButtonLink></Message></Card></DetailShell>;
  }
  return <DetailShell listPage={props.listPage}><h1 className="mb-6 type-heading-3 text-grayscale-800">서류 상세</h1>
    <Message error={state.status === "error"} title={state.status === "anonymous" ? "로그인하면 서류를 확인할 수 있어요." : state.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 상태를 확인하고 있어요."}>
      {state.status === "anonymous" ? <LoginLink {...currentProps} /> : state.status === "error" && <Button variant="outline" onClick={() => void refresh().catch(() => undefined)}>다시 시도하기</Button>}
    </Message></DetailShell>;
}

function AuthenticatedDetail({ documentId, versionId, listPage, onCommitted, getAccessToken, getAccountKey, refresh, getSessionEpoch }: Props & AuthAccess & {
  onCommitted: () => void; getSessionEpoch: () => number;
}) {
  const [result, setResult] = useState<Result>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const cancelOriginalRef = useRef<() => void>(() => undefined);
  const deletedRef = useRef<DocumentDeletion | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const closeDeletion = useCallback((refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh && !deletedRef.current) { setResult({ status: "loading" }); setAttempt(value => value + 1); }
  }, []);
  const [scopeEpoch] = useState(getSessionEpoch);
  const [scopeAccount] = useState(getAccountKey);
  const isCurrent = () => scopeEpoch === getSessionEpoch() && scopeAccount === getAccountKey();

  useEffect(() => {
    if (deletedRef.current) return;
    const controller = new AbortController();
    void loadDocumentDetail({ getAccessToken, getAccountKey, refresh }, documentId, versionId, controller.signal,
      () => scopeEpoch === getSessionEpoch() && scopeAccount === getAccountKey()).then(value => {
      if (!controller.signal.aborted && !deletedRef.current) setResult({ status: "ready", ...value });
    }).catch(error => {
      if (controller.signal.aborted || deletedRef.current || scopeEpoch !== getSessionEpoch() || scopeAccount !== getAccountKey()) return;
      const statusCode = error instanceof ApiError ? error.status : 0;
      setResult({ status: "error", statusCode, message: statusCode === 401 ? "로그인이 필요해요." : statusCode === 403 ? "서류 정보를 볼 권한이 없어요."
        : statusCode === 404 ? "서류 또는 선택한 버전을 찾지 못했거나 볼 권한이 없어요." : statusCode === 400 ? "서류 주소를 확인해 주세요." : "서류 정보를 불러오지 못했어요. 다시 시도해 주세요." });
    });
    return () => controller.abort();
  }, [documentId, versionId, getAccessToken, getAccountKey, refresh, getSessionEpoch, scopeEpoch, scopeAccount, attempt]);

  useEffect(() => { if (result.status !== "loading") heading.current?.focus(); }, [result.status, attempt]);
  function reload() { cancelOriginalRef.current(); setResult({ status: "loading" }); setAttempt(value => value + 1); }
  function select(version: DocumentHistoryVersion) {
    if (result.status !== "ready" || result.selected.versionId === version.versionId) return;
    cancelOriginalRef.current();
    window.history.replaceState(null, "", documentDetailPath(documentId, version.versionId, listPage));
  }
  return <DetailShell listPage={listPage} onLeave={() => cancelOriginalRef.current()}>
    {result.status === "deleted" ? <Card><h1 ref={heading} tabIndex={-1} className="mb-6 type-heading-3 text-grayscale-800 focus:outline-none">서류를 삭제했어요.</h1>
      <Message title="이전 버전을 포함한 서류 전체가 삭제됐어요. 최신 서류함은 다시 확인할 수 있어요.">
        <p>삭제 시각: {documentTimestamp(result.deletion.deletedAt)}<br />파기 대상 예정: {documentTimestamp(result.deletion.purgeAt)}</p>
        <p>실제 파기는 지연될 수 있어요. 사용자 복원은 제공하지 않아요. 이미 저장한 파일이나 발급된 원본 접근의 즉시 회수는 보장하지 않아요.</p>
      </Message></Card> : result.status !== "ready" ? <Card><h1 ref={heading} tabIndex={-1} className="mb-6 type-heading-3 text-grayscale-800 focus:outline-none">서류 상세</h1>
      <Message error={result.status === "error"} title={result.status === "loading" ? "서류 정보를 확인하고 있어요." : result.message}>
        {result.status === "error" && (result.statusCode === 401 ? <LoginLink documentId={documentId} versionId={versionId} listPage={listPage} /> : <Button variant="outline" onClick={reload}>다시 확인하기</Button>)}
      </Message></Card> : <VersionContent key={`${result.selected.versionId}:${attempt}`} version={result.selected} versions={result.versions} documentId={documentId}
        access={{ getAccessToken, getAccountKey, refresh }} isCurrent={isCurrent} onSelect={select} onReload={reload} cancelOriginalRef={cancelOriginalRef} listPage={listPage} onDelete={() => setDeleteOpen(true)}
        onUnauthorized={() => setResult({ status: "error", statusCode: 401, message: "로그인이 필요해요." })} />}
    {deleteOpen && <DocumentDeletionDialog documentId={documentId} listPage={listPage} onClose={closeDeletion}
      onUnauthorized={() => { cancelOriginalRef.current(); if (!deletedRef.current) setResult({ status: "error", statusCode: 401, message: "로그인이 필요해요." }); }}
      onCommitted={deletion => { deletedRef.current = deletion; cancelOriginalRef.current(); setResult({ status: "deleted", deletion }); onCommitted(); }} />}
  </DetailShell>;
}

function VersionContent({ version, versions, documentId, access, isCurrent, onSelect, onReload, onUnauthorized, onDelete, cancelOriginalRef, listPage }: {
  version: DocumentHistoryVersion; versions: DocumentHistoryVersion[]; documentId: string; access: AuthAccess; isCurrent: () => boolean; listPage: number;
  onSelect: (version: DocumentHistoryVersion) => void; onReload: () => void; onUnauthorized: () => void; onDelete: () => void; cancelOriginalRef: React.RefObject<() => void>;
}) {
  const [original, setOriginal] = useState<OriginalState>({ status: "idle" });
  const [now, setNow] = useState(Date.now);
  const title = useRef<HTMLHeadingElement>(null);
  const [controller] = useState(() => createDocumentOriginalController({
    read: async (purpose, signal) => {
      const value = await readCompanyDocumentOriginal(access, documentId, version.versionId, purpose, signal);
      if (value.blob.type !== version.contentType || value.blob.size !== version.sizeBytes) throw new ApiError(0, "DOCUMENT_ORIGINAL_MISMATCH", "원본 정보를 다시 확인해 주세요.");
      return value;
    },
    isCurrent, createUrl: blob => URL.createObjectURL(blob), revokeUrl: url => URL.revokeObjectURL(url),
    download: url => {
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = downloadFilename(version.filename); anchor.rel = "noreferrer";
      document.body.append(anchor); anchor.click(); anchor.remove();
    },
    onChange: value => { if (value.status === "error" && value.statusCode === 401) onUnauthorized(); else setOriginal(value); },
  }));
  useEffect(() => {
    controller.activate();
    title.current?.focus();
    cancelOriginalRef.current = controller.dispose;
    const update = () => { controller.checkExpiry(); setNow(Date.now()); };
    const timer = setInterval(update, 30_000);
    const leave = () => controller.dispose();
    const navigate = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.download) return;
      const target = new URL(anchor.href, window.location.href);
      if (target.origin === window.location.origin && target.pathname !== window.location.pathname) leave();
    };
    const restore = (event: PageTransitionEvent) => { if (event.persisted) { controller.activate(); setOriginal({ status: "idle" }); } };
    document.addEventListener("visibilitychange", update);
    document.addEventListener("click", navigate, true);
    window.addEventListener("pagehide", leave); window.addEventListener("popstate", leave);
    window.addEventListener("pageshow", restore);
    return () => { controller.dispose(); clearInterval(timer); document.removeEventListener("visibilitychange", update); document.removeEventListener("click", navigate, true); window.removeEventListener("pagehide", leave); window.removeEventListener("popstate", leave); window.removeEventListener("pageshow", restore); };
  }, [controller, cancelOriginalRef]);
  const period = documentPeriod(version, now);
  const allowed = canReadDocumentOriginal(version);
  const busy = original.status === "loading";
  return <>
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className={`mb-4 inline-flex rounded-md px-2 py-1 type-body-6 ${version.status === "VERIFIED" ? "bg-success/10 text-success" : "bg-grayscale-100 text-grayscale-700"}`}>{documentStatusLabel(version.status)}{version.status === "REPLACED" ? "" : ` · ${documentVersionLabel(version)}`}</p>
          <h1 ref={title} tabIndex={-1} className="break-all type-heading-3 text-grayscale-800 focus:outline-none">{version.filename}</h1>
          <p className="mt-2 type-body-3 text-grayscale-600">회사 정보와 실적 조회에 필요한 사업자등록증명 서류</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-describedby="document-edit-help">
          <Button variant="tertiary" onClick={() => { controller.dispose(); controller.activate(); setOriginal({ status: "idle" }); onDelete(); }}>지우기</Button>
          <Button variant="secondary" disabled={!allowed || busy} onClick={() => void controller.request("DOWNLOAD")}>다운로드</Button>
          <DocumentReuploadButton documentId={documentId} onOpen={() => { controller.dispose(); controller.activate(); setOriginal({ status: "idle" }); }}
            onChanged={versionId => { window.history.replaceState(null, "", documentDetailPath(documentId, versionId, listPage)); onReload(); }} />
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metadata label="업로드일">{documentTimestamp(version.uploadedAt)}</Metadata>
        <Metadata label="최종수정">{documentTimestamp(version.modifiedAt)}</Metadata>
        <Metadata label="파일크기">{documentFileSize(version.sizeBytes)}</Metadata>
        <Metadata label="업로드한 사람">{version.uploaderDisplayName?.trim() || "미확인"}</Metadata>
      </dl>
      <p id="document-edit-help" className="mt-4 type-body-7 text-grayscale-600">다시 업로드는 최신 현재 문서를 기준으로 진행해요. 지우기는 선택한 버전뿐 아니라 이전 버전을 포함한 서류 전체를 삭제해요. 문서 검증·유효기간과 회사 인증·회사정보 반영은 각각 다른 상태예요.</p>
    </Card>
    <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <Card>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="type-heading-9 text-grayscale-800">미리보기</h2>
          <Button variant="tertiary" size="xs" disabled={!allowed || busy} onClick={() => void controller.request("PREVIEW")}>{original.status === "ready" ? "원본 다시 확인" : "원본 미리보기"}</Button></div>
        {!allowed && <Message title="이 버전은 아직 원본을 확인할 수 없어요. 상태와 파일형식을 확인해 주세요." />}
        {allowed && original.status === "idle" && <Message title="원본 미리보기를 누르면 현재 권한으로 선택한 버전을 확인해요." />}
        {original.status === "loading" && <Message title={original.purpose === "PREVIEW" ? "선택한 버전의 원본을 불러오고 있어요." : "선택한 버전의 다운로드를 준비하고 있어요."} />}
        {original.status === "expired" && <Message title="원본 접근 시간이 지났어요. 다시 요청하면 현재 권한을 확인해요." />}
        {original.status === "downloaded" && <Message title="다운로드를 시작했어요. 브라우저의 다운로드 내역을 확인해 주세요." />}
        {original.status === "error" && <Message error title={original.message}><Button variant="outline" onClick={onReload}>서류 정보 다시 조회</Button></Message>}
        {original.status === "ready" && <DocumentOriginalViewer url={original.url} contentType={version.contentType} filename={version.filename} />}
        <p className="mt-4 type-body-7 text-grayscale-600">원본을 새로 요청할 때마다 권한을 확인해요. 원본 접근 시간이 지나면 다시 요청해 주세요.</p>
      </Card>
      <div className="flex min-w-0 flex-col gap-4">
        <Card><h2 className="mb-6 type-heading-9 text-grayscale-800">서류정보</h2><dl className="flex flex-col gap-4">
          <Info label="파일형식">{version.contentType === "application/pdf" ? "PDF 문서" : version.contentType === "image/jpeg" ? "JPG 이미지" : version.contentType === "image/png" ? "PNG 이미지" : "지원하지 않는 형식"}</Info>
          <Info label="페이지수">{version.pageCount === null ? "미확인" : `${version.pageCount} 페이지`}</Info>
          <Info label="유효기간"><span className={period === "만료" || period === "기간 확인 필요" ? "text-danger" : undefined}>{period}</span><span className="mt-1 block">시작: {version.validFrom ?? "미확인"}<br />종료: {version.validUntil ?? "미확인"}</span></Info>
        </dl></Card>
        <Card><h2 className="mb-6 type-heading-9 text-grayscale-800">버전기록</h2>
          <ol className="flex flex-col gap-3" aria-label="서류 버전 이력">{versions.map(item => <li key={item.versionId}>
            <button type="button" onClick={() => onSelect(item)} aria-current={item.versionId === version.versionId ? "true" : undefined}
              className={`flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary ${item.versionId === version.versionId ? "bg-primary-100" : ""}`}>
              <span aria-hidden className={`mt-2 size-1.5 shrink-0 rounded-full ${item.current ? "bg-primary" : "bg-grayscale-500"}`} />
              <span className="min-w-0"><span className="type-body-2 text-grayscale-800">v{item.versionNumber} ({documentVersionLabel(item)})</span>
                <span className="mt-1 block type-body-7 text-grayscale-600">{documentTimestamp(item.modifiedAt)}</span><span className="block type-body-7 text-grayscale-600">{documentStatusLabel(item.status)}</span></span>
            </button>
          </li>)}</ol>
          <p className="mt-4 type-body-7 text-grayscale-600">버전 기록이에요. 열람·다운로드·삭제 활동 기록은 포함하지 않아요.</p>
        </Card>
        <Card><h2 className="mb-6 type-heading-9 text-grayscale-800">최근활동</h2><p className="type-body-7 text-grayscale-600">최근 활동은 제공 준비 중이에요.</p></Card>
      </div>
    </div>
  </>;
}

function Metadata({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="min-w-0 rounded-xl bg-grayscale-50 p-4"><dt className="mb-5 type-body-7 text-grayscale-600">{label}</dt><dd className="break-words type-body-2 text-grayscale-800">{children}</dd></div>;
}
function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><dt className="mb-1 type-body-7 text-grayscale-600">{label}</dt><dd className="break-words type-body-2 text-grayscale-800">{children}</dd></div>;
}
function Card({ children }: { children: React.ReactNode }) { return <div className="min-w-0 rounded-[20px] bg-white p-6 shadow-[0_0_12px_var(--color-grayscale-100)]">{children}</div>; }
function Message({ title, error = false, children }: { title: string; error?: boolean; children?: React.ReactNode }) {
  return <div role={error ? "alert" : "status"} className="flex flex-col items-start gap-3 rounded-xl bg-grayscale-50 p-6 type-body-3 text-grayscale-600"><p>{title}</p>{children}</div>;
}
function LoginLink({ documentId, versionId, listPage }: Props) {
  const next = versionId === null ? `/my/documents/${encodeURIComponent(documentId)}?page=${listPage}` : documentDetailPath(encodeURIComponent(documentId), versionId, listPage);
  return <ButtonLink href={`/auth?${new URLSearchParams({ mode: "login", next })}`}>로그인하고 돌아오기</ButtonLink>;
}
function DetailShell({ listPage, onLeave, children }: { listPage: number; onLeave?: () => void; children: React.ReactNode }) {
  return <section className="flex-1 bg-grayscale-50 px-4 pb-24 pt-[30px] sm:px-6"><div className="mx-auto w-full max-w-[1100px]">
    <nav aria-label="현재 위치" className="mb-4 flex flex-wrap items-center gap-1 type-body-3 text-grayscale-600"><Link href="/my" onClick={onLeave}>마이페이지</Link><RightArrowIcon aria-hidden className="size-4" />
      <Link href={documentListPath(listPage)} onClick={onLeave}>서류함</Link><RightArrowIcon aria-hidden className="size-4" /><span aria-current="page" className="type-body-1 text-grayscale-700">사업자등록증명서</span></nav>
    {children}<div className="mt-6"><ButtonLink variant="outline" href={documentListPath(listPage)} onClick={onLeave}>서류함으로 돌아가기</ButtonLink></div>
  </div></section>;
}
