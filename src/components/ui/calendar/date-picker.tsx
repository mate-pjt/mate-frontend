"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarIcon, CloseIcon } from "@/components/icons";
import { Calendar } from "./calendar";

export type DatePickerProps = {
  id?: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  minDate: string;
  maxDate: string;
  placeholder?: string;
  disabled?: boolean;
};

export function DatePicker({ id, label, value, onValueChange, minDate, maxDate, placeholder = "날짜를 선택해주세요.", disabled = false }: DatePickerProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const dialogId = `${triggerId}-calendar`;
  const trigger = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number; width: number } | null>(null);

  const close = useCallback(() => {
    setPosition(null);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!position) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", close);
    };
  }, [position, close]);

  function open() {
    if (disabled || !trigger.current) return;
    const rect = trigger.current.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    setPosition({
      left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)),
      top: Math.max(16, Math.min(rect.bottom + 8, window.innerHeight - 410)),
      width,
    });
  }

  function handleDialogKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled):not([tabindex="-1"]), select:not(:disabled)'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }

  return (
    <div className="mt-2 flex h-12 w-full items-center rounded-lg border border-grayscale-200 bg-white px-3 focus-within:border-primary">
      <button
        aria-controls={position ? dialogId : undefined}
        aria-expanded={Boolean(position)}
        aria-haspopup="dialog"
        aria-label={`${label}, ${value ? value.replaceAll("-", ".") : "선택 안 됨"}`}
        className="flex h-full min-w-0 flex-1 items-center justify-between gap-2 text-left outline-none type-body-3 disabled:opacity-40"
        disabled={disabled}
        id={triggerId}
        onClick={open}
        onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); open(); } }}
        ref={trigger}
        type="button"
      >
        <span className={value ? "text-grayscale-700" : "text-grayscale-500"}>{value ? value.replaceAll("-", ".") : placeholder}</span>
        <CalendarIcon aria-hidden className="size-5 shrink-0 text-grayscale-600" />
      </button>
      {value ? <button aria-label={`${label} 지우기`} className="ml-2 flex size-5 shrink-0 items-center justify-center rounded text-grayscale-600 focus-visible:outline-2 focus-visible:outline-primary" disabled={disabled} onClick={() => { onValueChange(""); trigger.current?.focus(); }} type="button"><CloseIcon aria-hidden className="size-4" /></button> : null}
      {position ? createPortal(
        <div className="fixed inset-0 z-50" onPointerDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div aria-label={`${label} 선택`} aria-modal="true" className="absolute max-h-[calc(100dvh-2rem)] overflow-auto rounded-lg shadow-lg" id={dialogId} onKeyDown={handleDialogKey} role="dialog" style={position}>
            <Calendar autoFocus maxDate={maxDate} minDate={minDate} onValueChange={(date) => { onValueChange(date); close(); }} value={value} />
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}
