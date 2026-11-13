"use client";

import { Fragment, useState, type ReactNode } from "react";
import { useAuthSession } from "@/features/auth/session";

export function AccountScope({ children }: { children: ReactNode }) {
  const { state, getSessionEpoch } = useAuthSession();
  const account = state.status === "authenticated" ? String(state.authentication.account.id) : null;
  const [lastAccount, setLastAccount] = useState(account);
  if (account !== null && account !== lastAccount) setLastAccount(account);
  // Refresh expiry preserves completion; explicit login/logout starts a new lifetime.
  return <Fragment key={`${account ?? lastAccount ?? "anonymous"}:${getSessionEpoch()}`}>{children}</Fragment>;
}
