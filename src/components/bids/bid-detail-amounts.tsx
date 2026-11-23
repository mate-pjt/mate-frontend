"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { BidDetail } from "@/types/bid-detail";

const numberFormatter = new Intl.NumberFormat("ko-KR");

type AmountMode = "number" | "unit";
const AmountModeContext = createContext<{
  mode: AmountMode;
  setMode: (mode: AmountMode) => void;
} | null>(null);

const amountModes = [
  { mode: "number", label: "숫자", accessibleLabel: "숫자" },
  { mode: "unit", label: "원", accessibleLabel: "원 (억·만 단위)" },
] as const;

export function BidDetailAmountProvider({ children }: { readonly children: ReactNode }) {
  const [mode, setMode] = useState<AmountMode>("number");

  return <AmountModeContext.Provider value={{ mode, setMode }}>{children}</AmountModeContext.Provider>;
}

function useAmountMode() {
  const context = useContext(AmountModeContext);
  if (!context) throw new Error("금액 표시에는 BidDetailAmountProvider가 필요합니다.");
  return context;
}

export function BidDetailAmountToggle() {
  const { mode, setMode } = useAmountMode();

  return (
    <div aria-label="금액 표시 방식" className="ml-auto inline-flex shrink-0 rounded bg-grayscale-100 p-0.5 type-body-7" role="group">
      {amountModes.map((option) => (
        <button
          aria-label={option.accessibleLabel}
          aria-pressed={mode === option.mode}
          className={`h-8 w-[57px] cursor-pointer rounded focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-primary-700 sm:h-5 ${mode === option.mode ? "bg-white text-grayscale-800 shadow-sm" : "text-grayscale-700"}`}
          key={option.mode}
          onClick={() => setMode(option.mode)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function BidDetailAmounts({ amount }: { readonly amount: BidDetail["amount"] }) {
  const { mode } = useAmountMode();
  const values = [
    { label: "기초금액", value: amount.basePrice, emphasized: true },
    { label: "추정가격", value: amount.estimatedPrice, emphasized: false },
    { label: "배정예산", value: amount.budget, emphasized: false },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {values.map((item) => (
        <div className="min-w-0 rounded-xl bg-white p-5 shadow-[0_0_12px_var(--grayscale-100)]" key={item.label}>
          <p className="font-semibold text-grayscale-800 type-body-6">{item.label}</p>
          <p className={`mt-6 break-words font-bold type-body-5 ${item.emphasized ? "text-primary-400" : "text-grayscale-800"}`}>
            {item.value == null ? "정보 없음" : mode === "number" ? `${numberFormatter.format(item.value)}원` : formatKoreanWon(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}

function formatKoreanWon(value: number): string {
  if (value < 10_000) return `${numberFormatter.format(value)}원`;
  const eok = Math.floor(value / 100_000_000);
  const man = Math.floor((value % 100_000_000) / 10_000);
  const remainder = value % 10_000;
  return `${[eok ? `${numberFormatter.format(eok)}억` : "", man ? `${numberFormatter.format(man)}만` : "", remainder ? `${numberFormatter.format(remainder)}` : ""]
    .filter(Boolean).join(" ")} 원`;
}
