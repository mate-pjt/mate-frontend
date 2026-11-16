"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { InfoIcon } from "@/components/icons";
import { UploadPopup } from "@/components/ui/popup";
import { showToast } from "@/components/ui/toast";
import { useAuthSession } from "@/features/auth/session";
import { documentFileSize } from "@/features/company/document-detail";
import { createDocumentReuploadController, type ReuploadView } from "@/features/company/document-reupload";

export function DocumentReuploadButton({ documentId, onChanged, onOpen }: { documentId: string; onChanged: (versionId: string) => void; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const closeDialog = useCallback(() => setOpen(false), []);
  return <><Button onClick={() => { onOpen?.(); setOpen(true); }}>다시 업로드</Button>
    {open && <DocumentReuploadDialog documentId={documentId} onClose={closeDialog} onChanged={versionId => { setOpen(false); onChanged(versionId); }} />}</>;
}

function DocumentReuploadDialog({ documentId, onClose, onChanged }: { documentId: string; onClose: () => void; onChanged: (versionId: string) => void }) {
  const session = useAuthSession();
  const [epoch] = useState(session.getSessionEpoch);
  const [account] = useState(session.getAccountKey);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [polls, setPolls] = useState(0);
  const [view, setView] = useState<ReuploadView>({ phase: "loading", message: "현재 문서를 확인하고 있어요.", file: null, canSelect: false, canSubmit: false, canRetry: false, snapshot: null });
  const [controller] = useState(() => createDocumentReuploadController({ documentId, access: session,
    isCurrent: () => epoch === session.getSessionEpoch() && account === session.getAccountKey(), onChange: setView,
    onComplete: versionId => { showToast("새 서류가 현재 버전으로 교체됐어요."); onChanged(versionId); },
  }));

  useEffect(() => {
    controller.activate();
    const dialog = dialogRef.current;
    dialog?.showModal();
    void controller.load();
    const leave = () => { controller.dispose(); dialog?.close(); onClose(); };
    const restore = (event: PageTransitionEvent) => { if (event.persisted) leave(); };
    const navigate = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (anchor instanceof HTMLAnchorElement && !anchor.download) leave();
    };
    window.addEventListener("pagehide", leave); window.addEventListener("popstate", leave);
    window.addEventListener("pageshow", restore);
    document.addEventListener("click", navigate, true);
    return () => { controller.dispose(); dialog?.close(); window.removeEventListener("pagehide", leave); window.removeEventListener("popstate", leave); window.removeEventListener("pageshow", restore); document.removeEventListener("click", navigate, true); };
  }, [controller, onClose]);

  useEffect(() => {
    if (view.phase !== "processing" || polls >= 60) return;
    const timer = setTimeout(() => { setPolls(value => value + 1); void controller.check(); }, 3000);
    return () => clearTimeout(timer);
  }, [controller, view.phase, polls]);

  function choose(files: FileList | null) {
    if (!files?.length) return;
    if (files.length !== 1) { setInputError("한 번에 파일 하나만 선택해 주세요."); return; }
    setInputError(null); controller.choose(files[0]);
  }
  function close() { controller.dispose(); dialogRef.current?.close(); onClose(); }
  const busy = view.phase === "working" || view.phase === "loading";
  return <dialog ref={dialogRef} aria-label="사업자등록증명서 다시 업로드" aria-busy={busy} onCancel={event => { event.preventDefault(); close(); }}
    className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[640px] overflow-y-auto border-0 bg-transparent p-0 text-grayscale-800 backdrop:bg-grayscale-900/50">
    <input ref={inputRef} type="file" hidden aria-label="재업로드할 파일" tabIndex={-1} accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
      onChange={event => { choose(event.target.files); event.target.value = ""; }} />
    <UploadPopup className="max-w-full" file={view.file ? { name: view.file.name, size: documentFileSize(view.file.size) } : undefined}
      notice={<span className="flex items-start gap-1"><InfoIcon aria-hidden className="mt-0.5 size-5 shrink-0" />최근 30일 이내에 정부24에서 발급받은 사업자등록증명서를 올려주세요!</span>}
      selectedMessage="파일을 선택했어요. 업로드 후 OCR·진위 확인을 진행해요."
      statusMessage={<div className="flex flex-col gap-2 type-body-7 text-grayscale-600">
        <p role={view.phase === "error" || view.statusCode || inputError ? "alert" : "status"} className={view.phase === "error" || view.statusCode || inputError ? "text-danger" : undefined}>{inputError ?? view.message}</p>
        <p>기존 현재 문서는 새 서류의 검증이 끝날 때까지 유지돼요. 회사명·주소 등 회사정보는 변경하지 않아요.</p>
        {view.phase === "processing" && polls >= 60 && <p>확인이 오래 걸리고 있어요. 잠시 뒤 현재 상태를 다시 확인해 주세요.</p>}
        {view.statusCode === 401 ? <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(`/my/documents/${documentId}`)}`}>로그인하고 돌아오기</ButtonLink>
          : <div className="flex flex-wrap gap-2"><Button size="xs" variant="outline" disabled={busy} onClick={() => void controller.check()}>현재 상태 확인</Button>
            {view.canRetry && <Button size="xs" variant="outline" onClick={() => void controller.retry()}>실패한 처리 다시 시도</Button>}</div>}
      </div>}
      confirmLabel={busy ? "처리 중…" : view.phase === "error" && view.canSubmit ? "같은 요청 다시 시도" : "업로드하기"}
      confirmDisabled={!view.canSubmit || busy || Boolean(inputError)} onConfirm={() => void controller.submit()} onCancel={close} onClose={close}
      onSelectFile={view.canSelect ? () => inputRef.current?.click() : undefined} onRemoveFile={view.canSelect && view.file ? () => controller.choose(null) : undefined}
      onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (view.canSelect) choose(event.dataTransfer.files); }} />
  </dialog>;
}
