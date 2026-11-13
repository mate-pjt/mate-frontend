"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { useAuthSession } from "@/features/auth/session";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";

const choices = [
  { label: "우리 회사 등록하기", description: ["우리 회사를 등록하고", "메이트 서비스를 사용해요!"], href: "/auth/company/register", icon: "/icon/24dp/company.svg", recommended: true },
  { label: "기존 회사 찾기", description: ["이미 메이트에 등록된 회사를", "찾고 통합 요청해요!"], href: "/auth/company/search", icon: "/icon/24dp/search_color.svg", recommended: false },
  { label: "메이트 시작하기", description: ["회사 정보 입력 없이 바로", "입찰공고를 둘러볼 수 있어요!"], href: "/bids", icon: "/icon/24dp/mate.svg", recommended: false },
] as const;

export function StartChoices({ next }: { next?: string }) {
  const router = useRouter();
  const { state, refresh } = useAuthSession();
  const destination = sanitizeLocalNextPath(next ?? "/bids");

  if (state.status === "loading") return <AuthCard><p role="status">로그인 상태를 확인하고 있어요.</p></AuthCard>;
  if (state.status === "error") return (
    <AuthCard className="space-y-4">
      <AuthError message="로그인 상태를 확인하지 못했습니다." />
      <button className="text-primary underline" onClick={() => void refresh().catch(() => undefined)} type="button">다시 시도하기</button>
    </AuthCard>
  );
  if (state.status === "anonymous") return (
    <AuthCard className="space-y-4">
      <AuthError message="로그인이 필요합니다." />
      <button className="text-primary underline" onClick={() => router.replace("/auth?next=%2Fauth%2Fstart")} type="button">로그인하기</button>
    </AuthCard>
  );

  const nickname = state.authentication?.account.nickname?.trim();

  return (
    <AuthCard>
      <AuthBack href="/auth" />
      <h1 className="mb-6 break-words text-grayscale-800 type-heading-7">{nickname ? `반가워요, ${nickname}님!` : "반가워요!"}<br />메이트를 어떻게 시작할까요?</h1>
      <div className="grid gap-[10px] min-[740px]:grid-cols-3">
        {choices.map((choice) => (
          <button
            className="group flex min-w-0 flex-col items-center justify-center gap-2 rounded-3xl bg-grayscale-50 p-6 text-center text-grayscale-800 transition-colors hover:bg-grayscale-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            key={choice.href}
            onClick={() => router.push(choice.href === "/bids" ? destination : choice.href)}
            type="button"
          >
            <span aria-hidden={!choice.recommended} className={`rounded-md bg-primary-100 px-2 py-1 text-primary type-body-6 ${choice.recommended ? "" : "invisible"}`}>메이트 추천</span>
            <span className="flex flex-col items-center gap-4">
            <Image src={choice.icon} alt="" width={64} height={64} />
            <span className="flex flex-col items-center gap-2">
              <span className="type-body-1">{choice.label}</span>
              <span className="text-grayscale-600 type-body-7">{choice.description[0]}<br />{choice.description[1]}</span>
            </span>
            </span>
          </button>
        ))}
      </div>
    </AuthCard>
  );
}
