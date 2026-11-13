"use client";

import { useEffect, useRef } from "react";

import { BasicPopup } from "@/components/ui/popup";

export function MembershipCancellationDialog({ open, pending, onClose, onConfirm }: {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-label="통합 요청 취소 확인"
      aria-busy={pending}
      className="m-auto w-[calc(100vw-2rem)] max-w-[420px] border-0 bg-transparent p-0 text-grayscale-800 backdrop:bg-grayscale-900/50"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      ref={dialogRef}
    >
      <BasicPopup
        className="max-w-full"
        description="취소한 뒤에도 회사 등록이나 통합 요청을 다시 시작할 수 있어요."
        onClose={onClose}
        primaryAction={{ label: pending ? "취소 중…" : "요청 취소하기", disabled: pending, onClick: onConfirm }}
        secondaryAction={{ label: "돌아가기", onClick: onClose }}
        title="통합 요청을 취소할까요?"
      />
    </dialog>
  );
}
