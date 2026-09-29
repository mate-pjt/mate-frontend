"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/session";

const RECOMMENDED_BIDS_PATH = "/bids?view=recommended";

export function HomeAuthCta() {
  const router = useRouter();
  const { state } = useAuthSession();

  function handleClick(): void {
    const destination = state.status === "authenticated"
      ? RECOMMENDED_BIDS_PATH
      : `/auth?mode=login&next=${encodeURIComponent(RECOMMENDED_BIDS_PATH)}`;

    router.push(destination);
  }

  return (
    <Button
      className="h-12 min-w-[184px]"
      disabled={state.status === "loading"}
      onClick={handleClick}
      size="sm"
    >
      맞춤 공고 확인하기
    </Button>
  );
}
