"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BasicPopup } from "@/components/ui/popup";
import { showToast } from "@/components/ui/toast";
import type { DocumentDeletion } from "@/data/company/contracts";
import { useAuthSession } from "@/features/auth/session";
import { createDocumentDeletionController, type DeletionView } from "@/features/company/document-deletion";
import { documentListPath, documentTimestamp } from "@/features/company/document-detail";

export function DocumentDeletionDialog({ documentId, listPage, onCommitted, onUnauthorized, onClose }: {
  documentId: string; listPage: number;
  onCommitted: (result: DocumentDeletion) => void; onUnauthorized: () => void; onClose: (refresh: boolean) => void;
}) {
  const session = useAuthSession();
  const router = useRouter();
  const [epoch] = useState(session.getSessionEpoch);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [completedPage, setCompletedPage] = useState<number | null>(null);
  const [view, setView] = useState<DeletionView>({ phase: "loading", message: "삭제할 서류를 확인하고 있어요.", deletion: null });
  const [controller] = useState(() => createDocumentDeletionController({ documentId, listPage, access: session,
    isCurrent: () => epoch === session.getSessionEpoch(), onChange: value => { setView(value); if (value.statusCode === 401) onUnauthorized(); },
    onCommitted: result => { onCommitted(result); showToast("서류를 삭제했어요."); },
    onComplete: setCompletedPage,
  }));
  useEffect(() => {
    if (completedPage === null) return;
    dialogRef.current?.close(); onClose(false); router.replace(documentListPath(completedPage));
  }, [completedPage, onClose, router]);
  useEffect(() => {
    controller.activate(); const dialog = dialogRef.current; dialog?.showModal(); void controller.load();
    const leave = () => { controller.dispose(); dialog?.close(); onClose(controller.hasSubmitted()); };
    const restore = (event: PageTransitionEvent) => { if (event.persisted) leave(); };
    const navigate = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (anchor instanceof HTMLAnchorElement && !anchor.download) leave();
    };
    window.addEventListener("pagehide", leave); window.addEventListener("popstate", leave); window.addEventListener("pageshow", restore);
    document.addEventListener("click", navigate, true);
    return () => { controller.dispose(); dialog?.close(); window.removeEventListener("pagehide", leave); window.removeEventListener("popstate", leave);
      window.removeEventListener("pageshow", restore); document.removeEventListener("click", navigate, true); };
  }, [controller, onClose]);
  function close() { controller.dispose(); dialogRef.current?.close(); onClose(controller.hasSubmitted()); }
  const busy = ["loading", "deleting", "refreshing"].includes(view.phase);
  const login = view.statusCode === 401;
  const description = view.deletion
    ? `${view.message} 삭제 시각: ${documentTimestamp(view.deletion.deletedAt)}. 파기 대상 예정: ${documentTimestamp(view.deletion.purgeAt)}. 실제 파기는 지연될 수 있어요.`
    : `${view.message} 삭제한 서류는 즉시 목록과 새 원본 접근에서 제외되고, 30일이 지난 뒤 파기 대상이 돼요. 기존에 발급된 원본 접근은 남은 시간 동안 가능할 수 있어요.${view.phase === "deleting" ? " 창을 닫아도 서버의 삭제가 취소되지는 않을 수 있어요." : ""}`;
  return <dialog ref={dialogRef} aria-label="보관 서류 전체 삭제 확인" aria-busy={busy} aria-describedby="document-deletion-description"
    onCancel={event => { event.preventDefault(); close(); }}
    className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[420px] overflow-y-auto border-0 bg-transparent p-0 text-grayscale-800 backdrop:bg-grayscale-900/50">
    <p id="document-deletion-description" className="sr-only" role={view.phase === "error" || view.phase === "uncertain" || view.phase === "refresh-error" ? "alert" : "status"}>{description}</p>
    <BasicPopup className="max-w-full" title={view.deletion ? "서류 삭제는 완료됐어요" : "서류 전체를 삭제할까요?"} description={description} onClose={close}
      secondaryAction={{ label: view.deletion ? "닫기" : "돌아가기", onClick: close }}
      primaryAction={{ label: busy ? "확인 중…" : login ? "로그인하기" : view.phase === "confirm" ? "전체 서류 삭제" : view.deletion ? "목록 다시 확인" : "현재 상태 확인",
        tone: view.phase === "confirm" ? "danger" : "primary", disabled: busy,
        onClick: () => { if (login) { close(); router.push(`/auth?mode=login&next=${encodeURIComponent(documentListPath(listPage))}`); }
          else if (view.phase === "confirm") void controller.submit(); else void controller.load(); } }} />
  </dialog>;
}
