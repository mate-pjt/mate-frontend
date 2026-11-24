"use client";

import Image from "next/image";
import Link from "next/link";

import { FeedbackBanner } from "@/components/feedback-banner";
import { Button, ButtonLink } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/session";

import { MySideMenu } from "./my-side-menu";

const cards = [
  {
    title: "계정 관리",
    description: "계정을 더 안전하게 지킬 수 있어요!",
    icon: "/icon/24dp/setting.svg",
    href: "/my/settings/account",
  },
  {
    title: "알림 설정",
    description: "중요한 소식을 놓치지 설정할까요?",
    icon: "/icon/24dp/alarm_color.svg",
    href: "/my/settings/notifications",
  },
  {
    title: "서비스 이용안내",
    description: "서비스 이용안내를 확인해요!",
    icon: "/icon/24dp/question_mark.svg",
  },
] as const;

export function MySettingsHomeClient() {
  const { state, refresh } = useAuthSession();

  if (state.status === "anonymous") {
    return (
      <section className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex max-w-[420px] flex-col items-center gap-5">
          <h1 className="type-heading-7 text-grayscale-800">설정을 관리해볼까요?</h1>
          <p className="type-body-3 text-grayscale-600">로그인하면 계정과 서비스 설정을 확인할 수 있어요.</p>
          <ButtonLink href="/auth?mode=login&next=%2Fmy">로그인하고 돌아오기</ButtonLink>
        </div>
      </section>
    );
  }

  if (state.status !== "authenticated") {
    return (
      <section aria-live="polite" className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="type-body-3 text-grayscale-600" role={state.status === "error" ? "alert" : "status"}>
            {state.status === "error" ? "로그인 상태를 확인하지 못했어요." : "로그인 상태를 확인하고 있어요."}
          </p>
          {state.status === "error" && (
            <Button onClick={() => void refresh().catch(() => undefined)} variant="outline">다시 시도하기</Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1668px] flex-1 flex-col gap-6 px-4 pb-24 pt-[30px] sm:px-6 lg:flex-row xl:px-0">
      <MySideMenu value="settings" />

      <section aria-labelledby="my-settings-title" className="min-w-0 w-full max-w-[1180px]">
        <div className="p-2">
          <h1 className="type-heading-1 text-grayscale-900" id="my-settings-title">설정을 관리해볼까요?</h1>
          <p className="mt-2.5 type-heading-10 text-grayscale-600">서비스 이용에 필요한 모든 설정을 한곳에서 관리할 수 있어요.</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const content = (
              <>
                {!("href" in card) && <span className="absolute right-4 top-4 rounded-full bg-grayscale-100 px-2 py-1 text-xs text-grayscale-600">준비 중</span>}
                <Image alt="" className="size-14" height={56} src={card.icon} width={56} />
                <span className="flex flex-col items-center gap-1 text-center">
                  <span className="type-heading-7 text-grayscale-800">{card.title}</span>
                  <span className="type-body-3 text-grayscale-600">{card.description}</span>
                </span>
              </>
            );

            return "href" in card ? (
              <Link
                className="relative flex min-h-[174px] flex-col items-center justify-center gap-4 rounded-[20px] bg-grayscale-50 p-6 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-400"
                href={card.href}
                key={card.title}
              >
                {content}
              </Link>
            ) : (
              <section className="relative flex min-h-[174px] flex-col items-center justify-center gap-4 rounded-[20px] bg-grayscale-50 p-6" key={card.title}>
                {content}
              </section>
            );
          })}
        </div>

        <FeedbackBanner />
      </section>
    </div>
  );
}
