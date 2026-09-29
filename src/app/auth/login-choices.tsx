"use client";

import Image from "next/image";
import { googleAuthorizationUrl } from "@/features/auth/api";

export function LoginChoices({ nextPath }: { nextPath: string }) {
  return (
    <div className="space-y-[10px]">
      <button
        className="flex h-14 w-full items-center justify-center gap-[10px] rounded-xl border border-grayscale-200 bg-white text-grayscale-800 type-body-1 hover:bg-grayscale-50"
        onClick={() => window.location.assign(googleAuthorizationUrl(nextPath))}
        type="button"
      >
        <Image src="/images/auth/google-logo.png" alt="" width={20} height={20} />
        Google로 로그인
      </button>
      <button
        aria-label="네이버 로그인 준비 중"
        className="flex h-14 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#03c75a] text-white opacity-55 type-body-1"
        disabled
        type="button"
      >
        <Image src="/images/auth/naver-logo.svg" alt="" width={18} height={18} />
        네이버 로그인 · 준비 중
      </button>
      <p className="pt-5 text-center text-grayscale-600 type-body-7">
        간편하게 로그인하고 바로 시작해보세요!
      </p>
    </div>
  );
}
