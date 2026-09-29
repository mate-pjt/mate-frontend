"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RightArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { SideMenu, type SideMenuItem } from "@/components/ui/side-menu";
import { errorMessage } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";

const menuItems: SideMenuItem[] = [
  { value: "company", label: "나의 회사 정보", icon: "company", disabled: true },
  { value: "team", label: "함께하는 팀원", icon: "person", disabled: true },
  { value: "merge", label: "나의 회사 통합", icon: "add", disabled: true },
  { value: "bid-alerts", label: "알림 설정 공고", icon: "calendar", disabled: true },
  { value: "settings", label: "설정 및 관리", icon: "setting" },
  { value: "logout", label: "로그아웃", icon: "out" },
];

const cards = [
  {
    title: "계정 관리",
    description: "계정을 더 안전하게 지킬 수 있어요!",
    icon: "/icon/24dp/setting.svg",
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
  const router = useRouter();
  const { state, refresh, logout } = useAuthSession();
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    if (logoutBusy) return;
    setLogoutBusy(true);
    setLogoutError(null);
    try {
      await logout();
      router.refresh();
    } catch (reason) {
      setLogoutError(errorMessage(reason));
    } finally {
      setLogoutBusy(false);
    }
  }

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
      <div className="w-full shrink-0 lg:w-[220px]">
        <SideMenu
          aria-describedby="my-menu-help"
          ariaLabel="마이페이지 메뉴"
          className="w-full"
          items={menuItems.map((item) => item.value === "logout" ? { ...item, label: logoutBusy ? "로그아웃 중..." : item.label, disabled: logoutBusy } : item)}
          onValueChange={(value) => {
            if (value === "logout") void handleLogout();
          }}
          value="settings"
        />
        <p className="mt-3 px-3 text-xs leading-5 text-grayscale-600" id="my-menu-help">흐리게 표시된 메뉴는 준비 중이에요.</p>
        {logoutError && <p className="mt-2 px-3 type-body-7 text-danger" role="alert">{logoutError}</p>}
      </div>

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

        <aside className="mt-[50px] flex flex-col gap-4 rounded-2xl bg-primary-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Image alt="" className="size-12 shrink-0" height={48} src="/icon/24dp/mate.svg" width={48} />
            <div className="min-w-0">
              <h2 className="type-heading-9 text-grayscale-800">여러분의 의견으로 새로워지는 메이트!</h2>
              <p className="type-body-3 text-grayscale-600">이용 중 불편했던 점이나 바라는 점을 알려주시면 빠르게 반영할게요!</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-grayscale-600">준비 중</span>
            <button className="inline-flex h-12 items-center gap-1 rounded-xl px-[18px] type-body-2 text-primary-700 opacity-60" disabled type="button">
              의견 보내기 <RightArrowIcon aria-hidden className="size-5" />
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
