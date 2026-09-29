"use client";

import { useState } from "react";

import type { BidDetail } from "@/types/bid-detail";

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function BidDetailAmounts({ amount }: { readonly amount: BidDetail["amount"] }) {
  const [mode, setMode] = useState<"number" | "unit">("number");
  const values = [
    { label: "기초금액", value: amount.basePrice, emphasized: true },
    { label: "추정가격", value: amount.estimatedPrice, emphasized: false },
    { label: "배정예산", value: amount.budget, emphasized: false },
  ];

  return (
    <div>
      <div aria-label="금액 표시 방식" className="mb-3 flex justify-end gap-1 type-body-7">
        <button aria-pressed={mode === "number"} className={`rounded px-3 py-1 ${mode === "number" ? "bg-white text-grayscale-800 shadow-sm" : "text-grayscale-600"}`} onClick={() => setMode("number")} type="button">숫자</button>
        <button aria-pressed={mode === "unit"} className={`rounded px-3 py-1 ${mode === "unit" ? "bg-white text-grayscale-800 shadow-sm" : "text-grayscale-600"}`} onClick={() => setMode("unit")} type="button">원</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {values.map((item) => (
          <div className="min-w-0 rounded-xl bg-white p-5 shadow-[0_0_12px_var(--grayscale-100)]" key={item.label}>
            <p className="font-semibold text-grayscale-800 type-body-6">{item.label}</p>
            <p className={`mt-6 break-words font-bold type-body-5 ${item.emphasized ? "text-primary-400" : "text-grayscale-800"}`}>
              {item.value == null ? "정보 없음" : mode === "number" ? `${numberFormatter.format(item.value)}원` : formatKoreanWon(item.value)}
            </p>
          </div>
        ))}
      </div>
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
