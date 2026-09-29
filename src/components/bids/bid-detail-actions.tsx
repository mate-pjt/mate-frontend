"use client";

import { ShareIcon } from "@/components/icons";
import { showToast } from "@/components/ui/toast";

export function BidDetailShare() {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("공고 링크를 복사했어요.");
    } catch {
      showToast("링크를 복사하지 못했어요.");
    }
  }

  return (
    <button aria-label="공고 링크 복사" className="rounded-md p-2 text-grayscale-600 hover:bg-grayscale-100 hover:text-primary-400" onClick={copyLink} type="button">
      <ShareIcon aria-hidden className="size-5" focusable="false" />
    </button>
  );
}
