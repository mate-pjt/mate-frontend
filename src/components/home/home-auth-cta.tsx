"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isMockAuthenticated } from "@/lib/mock-auth";

const RECOMMENDED_BIDS_PATH = "/bids?view=recommended";

export function HomeAuthCta() {
  const router = useRouter();

  function handleClick(): void {
    const destination = isMockAuthenticated()
      ? RECOMMENDED_BIDS_PATH
      : `/auth?mode=login&next=${encodeURIComponent(RECOMMENDED_BIDS_PATH)}`;

    router.push(destination);
  }

  return (
    <Button
      className="h-12 min-w-[184px]"
      onClick={handleClick}
      size="sm"
    >
      맞춤 공고 확인하기
    </Button>
  );
}
