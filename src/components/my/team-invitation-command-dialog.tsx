"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { TeamInvitation, TeamInvitationCommand } from "@/data/company/contracts";
import { ApiError, errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { canManageTeamInvitation, createTeamInvitationCommandScope, planTeamInvitationCommand, type TeamInvitationSnapshot } from "@/features/company/team-invitations";
import { useTeamInvitationClock } from "./use-team-invitation-clock";

export function TeamInvitationCommandDialog({ snapshot, action, access, getSessionEpoch, onClose, onCommitted, onRecheck, onAccessError }: {
  snapshot: TeamInvitationSnapshot; action: "cancel"; access: AuthAccess; getSessionEpoch: () => number;
  onClose: () => void; onCommitted: (value: TeamInvitation, action: TeamInvitationCommand) => void; onRecheck: () => void; onAccessError: (error: ApiError) => void;
}) {
  const value = snapshot.detail!;
  const dialog = useRef<HTMLDialogElement>(null), active = useRef<ReturnType<typeof createTeamInvitationCommandScope> | null>(null);
  const live = useRef(false), epoch = useRef(getSessionEpoch());
  const [pending, setPending] = useState(false), [submitted, setSubmitted] = useState(false), [error, setError] = useState("");
  const now = useTeamInvitationClock([value.expiresAt]);
  let unavailable = "";
  try { planTeamInvitationCommand(snapshot, value, action, now); } catch (reason) { unavailable = errorMessage(reason); }
  useEffect(() => {
    live.current = true; const element = dialog.current; element?.showModal();
    return () => { live.current = false; active.current?.dispose(); element?.close(); };
  }, []);
  function close() { if (pending) return; dialog.current?.close(); onClose(); }
  async function submit() {
    if (pending || submitted || active.current) return;
    const scope = createTeamInvitationCommandScope(access, () => live.current && epoch.current === getSessionEpoch());
    active.current = scope; setPending(true); setSubmitted(true); setError("");
    try {
      const result = await scope.submit(snapshot, value, action);
      if (!live.current || epoch.current !== getSessionEpoch()) return;
      dialog.current?.close(); onCommitted(result, action);
    } catch (reason) {
      if (!live.current || epoch.current !== getSessionEpoch() || reason instanceof DOMException && reason.name === "AbortError") return;
      if (reason instanceof ApiError && [401, 403].includes(reason.status)) { dialog.current?.close(); onAccessError(reason); return; }
      setError(`${errorMessage(reason)} 완료로 확인된 것은 아니에요. 현재 초대 상태를 다시 조회해 주세요.`);
    } finally { if (live.current && epoch.current === getSessionEpoch()) setPending(false); }
  }
  const title = "보낸 초대를 취소할까요?";
  return <dialog ref={dialog} aria-label={title} aria-busy={pending} onCancel={event => { event.preventDefault(); close(); }}
    className="m-auto max-h-[90dvh] w-[calc(100vw-2rem)] max-w-[420px] overflow-y-auto rounded-[24px] border border-grayscale-200 bg-white p-6 text-grayscale-800 shadow-(--shadow-floating) backdrop:bg-grayscale-900/30">
    <div className="flex justify-end"><button type="button" aria-label="초대 관리 창 닫기" disabled={pending} onClick={close} className="inline-flex size-6 items-center justify-center disabled:opacity-40"><CloseIcon className="size-6" /></button></div>
    <div className="mt-2.5 text-center"><div className="mx-auto mb-4 flex size-20 items-center justify-center"><Image src="/images/team/invitation-cancel.svg" alt="" width={80} height={80} /></div>
      <h2 className="type-heading-7">{title}</h2><p className="mt-2 type-body-3 text-grayscale-600">취소하면 상대방이 초대를 수락할 수 없게 돼요.</p></div>
    {!canManageTeamInvitation(value, now) && <p className="mt-4 type-body-7 text-grayscale-600" role="status">현재 초대는 재발송·취소할 수 없어요. 만료된 경우 목록에서 새 초대를 작성해 주세요.</p>}
    {unavailable && <p className="mt-4 type-body-7 text-grayscale-600" role="status">{unavailable}</p>}
    {error && <p className="mt-4 break-words type-body-7 text-danger-emphasis" role="alert">{error}</p>}
    <div className="sticky bottom-0 mt-[30px] flex gap-2.5 bg-white pt-1">
      {submitted && !pending ? <><Button variant="outline" size="xxl" className="min-w-0 flex-1" onClick={close}>닫기</Button><Button size="xxl" className="min-w-0 flex-1" onClick={() => { dialog.current?.close(); onRecheck(); }}>초대 상태 다시 조회</Button></>
        : <><Button variant="gray" size="xxl" className="min-w-0 flex-1" disabled={pending || !!unavailable} onClick={() => void submit()}>{pending ? "취소 요청 중…" : "초대 취소하기"}</Button><Button size="xxl" className="min-w-0 flex-1" disabled={pending} onClick={close}>돌아가기</Button></>}
    </div>
  </dialog>;
}
