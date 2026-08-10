'use client';

import { useEffect, useRef, useState } from "react";

import { DownArrowIcon } from "@/components/icons";

import { bidViewOptions, type BidView } from "./bid-list-model";

type BidViewSelectorProps = {
  readonly value: BidView;
  readonly onValueChange: (view: BidView) => void;
};

export function BidViewSelector({ onValueChange, value }: BidViewSelectorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = bidViewOptions.find((option) => option.value === value) ?? bidViewOptions[0];

  useEffect(() => {
    if (!open) return;
    function close(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        aria-expanded={open}
        className="flex items-center gap-2 text-left text-grayscale-800 type-heading-1"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {selected.label}
        <DownArrowIcon aria-hidden className="size-8 shrink-0" focusable="false" />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+12px)] z-30 min-w-[320px] overflow-hidden rounded-[12px] border border-grayscale-200 bg-white py-2 shadow-[var(--shadow-floating)]">
          {bidViewOptions.map((option) => (
            <button
              aria-current={option.value === value ? "true" : undefined}
              className={`flex w-full px-4 py-3 text-left type-body-3 ${option.value === value ? "bg-primary-100 text-primary-400" : "text-grayscale-700 hover:bg-grayscale-50"}`}
              key={option.value}
              onClick={() => {
                setOpen(false);
                onValueChange(option.value);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
