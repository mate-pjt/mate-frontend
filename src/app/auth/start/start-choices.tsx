"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { useAuthSession } from "@/features/auth/session";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";

const choices = [
  { label: "우리 회사 등록하기", description: "우리 회사를 등록하고 메이트 서비스를 사용해요!", href: "/auth/company/register", icon: "/icon/24dp/company.svg", recommended: true },
  { label: "기존 회사 찾기", description: "이미 메이트에 등록된 회사를 찾고 통합 요청해요!", href: "/auth/company/search", icon: "/icon/24dp/search_color.svg", recommended: false },
  { label: "메이트 시작하기", description: "회사 정보 입력 없이 바로 입찰공고를 둘러볼 수 있어요!", href: "/bids", icon: "/icon/24dp/mate.svg", recommended: false },
] as const;

export function StartChoices({ next }: { next?: string }) {
  const router = useRouter();
  const { state, refresh } = useAuthSession();
  const destination = sanitizeLocalNextPath(next ?? "/bids");

  if (state.status === "loading") return <AuthCard>로그인 상태를 확인하고 있어요.</AuthCard>;
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

  return (
    <AuthCard>
      <AuthBack href="/auth" />
      <h1 className="mb-6 text-grayscale-800 type-heading-7">반가워요!<br />메이트를 어떻게 시작할까요?</h1>
      <div className="grid gap-[10px] sm:grid-cols-3">
        {choices.map((choice) => (
          <button
            className="group flex min-h-[234px] flex-col items-center justify-center gap-4 rounded-3xl bg-grayscale-50 p-6 text-center transition-colors hover:bg-grayscale-800 hover:text-white"
            key={choice.href}
            onClick={() => router.push(choice.href === "/bids" ? destination : choice.href)}
            type="button"
          >
            <span className={`rounded-md px-2 py-1 text-primary type-body-7 ${choice.recommended ? "bg-primary-100" : "invisible"}`}>메이트 추천</span>
            <Image src={choice.icon} alt="" width={64} height={64} />
            <span className="font-bold type-body-3">{choice.label}</span>
            <span className="text-grayscale-600 type-body-7 group-hover:text-grayscale-200">{choice.description}</span>
          </button>
        ))}
      </div>
    </AuthCard>
  );
}
