"use client";

import { useEffect, useRef } from "react";
import { BasicPopup } from "@/components/ui/popup";

export function TeamConfirmDialog({ open, title, description, pending, onClose, onConfirm, dialogRef }: {
  open: boolean; title: string; description: string; pending: boolean; onClose: () => void; onConfirm: () => void; dialogRef?: React.RefObject<HTMLDialogElement | null>;
}) {
  const localRef = useRef<HTMLDialogElement>(null), ref = dialogRef ?? localRef;
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open, ref]);
  return <dialog ref={ref} aria-label={title} aria-busy={pending} onCancel={event => { event.preventDefault(); if (!pending) onClose(); }}
    className="m-auto max-h-[90dvh] w-[calc(100vw-2rem)] max-w-[520px] overflow-y-auto border-0 bg-transparent p-0 text-grayscale-800 backdrop:bg-grayscale-900/50">
    <BasicPopup className="max-w-full" title={title} description={description} onClose={() => { if (!pending) onClose(); }}
      primaryAction={{ label: pending ? "확인 중…" : "확인하고 진행하기", disabled: pending, onClick: onConfirm }}
      secondaryAction={{ label: "돌아가기", disabled: pending, onClick: onClose }} />
  </dialog>;
}
