"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { SideMenu, type SideMenuItem } from "@/components/ui/side-menu";
import { errorMessage } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";

const menuItems: SideMenuItem[] = [
  { value: "company", label: "나의 회사 정보", icon: "company" },
  { value: "team", label: "함께하는 팀원", icon: "person", disabled: true },
  { value: "merge", label: "나의 회사 통합", icon: "add", disabled: true },
  { value: "bid-alerts", label: "알림 설정 공고", icon: "calendar", disabled: true },
  { value: "settings", label: "설정 및 관리", icon: "setting" },
  { value: "logout", label: "로그아웃", icon: "out" },
];

export function MySideMenu({ value }: { value: "company" | "settings" }) {
  const router = useRouter();
  const { logout } = useAuthSession();
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

  return (
    <div className="w-full shrink-0 lg:w-[220px]">
      <SideMenu
        aria-describedby="my-menu-help"
        ariaLabel="마이페이지 메뉴"
        className="w-full"
        items={menuItems.map((item) => item.value === "logout" ? { ...item, label: logoutBusy ? "로그아웃 중..." : item.label, disabled: logoutBusy } : item)}
        onValueChange={(next) => {
          if (next === "company") router.push("/my/company");
          if (next === "settings") router.push("/my");
          if (next === "logout") void handleLogout();
        }}
        value={value}
      />
      <p className="mt-3 px-3 text-xs leading-5 text-grayscale-600" id="my-menu-help">흐리게 표시된 메뉴는 준비 중이에요.</p>
      {logoutError && <p className="mt-2 px-3 type-body-7 text-danger" role="alert">{logoutError}</p>}
    </div>
  );
}
