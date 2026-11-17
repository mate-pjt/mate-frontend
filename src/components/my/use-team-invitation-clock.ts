"use client";

import { useEffect, useState } from "react";

export function useTeamInvitationClock(expiresAt: string[]) {
  const [now, setNow] = useState(Date.now);
  const deadlines = expiresAt.join("|");
  useEffect(() => {
    const update = () => setNow(Date.now());
    const upcoming = deadlines.split("|").map(Date.parse).filter(time => time > now);
    const timer = upcoming.length ? setTimeout(update, Math.min(2_147_483_647, Math.max(1, Math.min(...upcoming) - Date.now() + 1))) : undefined;
    window.addEventListener("focus", update); window.addEventListener("pageshow", update);
    document.addEventListener("visibilitychange", update);
    return () => { clearTimeout(timer); window.removeEventListener("focus", update); window.removeEventListener("pageshow", update); document.removeEventListener("visibilitychange", update); };
  }, [deadlines, now]);
  return now;
}
