"use client";

import { Fragment, useState, type ReactNode } from "react";
import { useAuthSession } from "@/features/auth/session";

export function AccountScope({ children }: { children: ReactNode }) {
  const { state } = useAuthSession();
  const account = state.status === "authenticated" ? String(state.authentication.account.id) : null;
  const [lastAccount, setLastAccount] = useState(account);
  if (account !== null && account !== lastAccount) setLastAccount(account);
  // Preserve a completed result on session expiry; a different account starts fresh.
  return <Fragment key={account ?? lastAccount ?? "anonymous"}>{children}</Fragment>;
}
