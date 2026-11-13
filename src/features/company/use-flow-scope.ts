"use client";

import { useEffect, useState } from "react";
import { useAuthSession } from "@/features/auth/session";
import { createCompanyFlowScope } from "./flow-scope";

export function useCompanyFlowScope() {
  const session = useAuthSession();
  const [scope] = useState(() => createCompanyFlowScope(session));
  useEffect(() => {
    scope.activate();
    return () => scope.dispose();
  }, [scope]);
  return scope;
}
