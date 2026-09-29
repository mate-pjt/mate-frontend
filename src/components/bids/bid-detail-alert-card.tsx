"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CheckIcon } from "@/components/icons";
import { AlarmPopup } from "@/components/ui/popup";
import { showToast } from "@/components/ui/toast";
import { ApiError, errorMessage, type AuthAccess } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";
import {
  activateBidNoticeAlert,
  deactivateBidNoticeAlert,
  getBidNoticeAlert,
  type BidNoticeAlertStatus,
} from "@/features/bid-notice-alerts/api";

type AlertCardProps = { readonly bidId: string; readonly closeAt: string | null };
type LoadedAlert =
  | { phase: "ready"; value: BidNoticeAlertStatus }
  | { phase: "error"; message: string };

export function BidDetailAlertCard({ bidId, closeAt }: AlertCardProps) {
  const router = useRouter();
  const { state, getAccessToken, refresh } = useAuthSession();

  if (state.status === "authenticated") {
    return (
      <AuthenticatedAlertCard
        bidId={bidId}
        closeAt={closeAt}
        getAccessToken={getAccessToken}
        key={`${state.authentication.account.id}:${bidId}`}
        refresh={refresh}
      />
    );
  }

  const anonymous = state.status === "anonymous";
  return (
    <AlertCardShell
      closeAt={closeAt}
      icon={anonymous ? "/icon/24dp/lock.svg" : "/icon/24dp/alarm_color.svg"}
      title={anonymous ? "로그인하고 입찰공고 알림을 받아보세요." : "로그인 상태를 확인하고 있어요."}
    >
      {state.status === "error" ? (
        <p className="mt-3 text-center text-danger type-body-7" role="alert">로그인 상태를 확인하지 못했어요.</p>
      ) : null}
      {anonymous ? (
        <button
          className="mt-3 w-full rounded-2xl bg-primary-400 px-4 py-4 text-white hover:bg-primary-500 type-heading-9"
          onClick={() => router.push(`/auth?mode=login&next=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
          type="button"
        >
          로그인하고 알림 받기
        </button>
      ) : state.status === "error" ? (
        <button className="mt-3 w-full rounded-2xl bg-grayscale-50 px-4 py-4 text-primary-400 type-heading-9" onClick={() => void refresh().catch(() => undefined)} type="button">
          다시 시도하기
        </button>
      ) : (
        <button className="mt-3 w-full rounded-2xl bg-grayscale-100 px-4 py-4 text-grayscale-600 type-heading-9" disabled type="button">
          로그인 상태 확인 중
        </button>
      )}
    </AlertCardShell>
  );
}

function AuthenticatedAlertCard({
  bidId,
  closeAt,
  getAccessToken,
  refresh,
}: AlertCardProps & AuthAccess) {
  const [loaded, setLoaded] = useState<LoadedAlert | null>(null);
  const [retry, setRetry] = useState(0);
  const [open, setOpen] = useState(false);
  const [draftEnabled, setDraftEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const access = { getAccessToken, refresh };

    void getBidNoticeAlert(access, bidId, controller.signal).then(
      (value) => {
        if (!controller.signal.aborted) setLoaded({ phase: "ready", value });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) setLoaded({ phase: "error", message: errorMessage(error) });
      },
    );

    return () => controller.abort();
  }, [bidId, getAccessToken, refresh, retry]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [open]);

  const status = loaded?.phase === "ready" ? loaded.value : null;

  function closeModal() {
    if (savingRef.current) return;
    setOpen(false);
    setMutationError(null);
  }

  function openModal() {
    if (!status) return;
    setDraftEnabled(status.active);
    setMutationError(null);
    setOpen(true);
  }

  function retryStatus() {
    setLoaded(null);
    setRetry((value) => value + 1);
  }

  async function saveAlert() {
    if (!status || draftEnabled === status.active || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setMutationError(null);

    try {
      const access = { getAccessToken, refresh };
      const next = draftEnabled
        ? await activateBidNoticeAlert(access, bidId)
        : await deactivateBidNoticeAlert(access, bidId);
      if (next.active !== draftEnabled) {
        throw new ApiError(200, "ALERT_STATUS_MISMATCH", "서버의 알림 상태를 확인하지 못했습니다. 다시 시도해 주세요.");
      }
      setLoaded({ phase: "ready", value: next });
      setOpen(false);
      showToast(draftEnabled ? "공고 알림을 설정했어요!" : "공고 알림을 해제했어요!");
    } catch (error) {
      setMutationError(errorMessage(error));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  const title = status?.active
    ? "이 입찰공고의 알림을 받고 있어요!"
    : loaded?.phase === "error"
      ? "알림 상태를 확인하지 못했어요."
      : !status
        ? "입찰공고 알림 상태를 확인하고 있어요."
        : "현재 보는 입찰공고를 놓치지 않도록 알림을 켜둘까요?";

  return (
    <AlertCardShell closeAt={closeAt} icon={status?.active ? "/icon/24dp/calendar_alarm.svg" : "/icon/24dp/alarm_color.svg"} title={title}>
      {loaded?.phase === "error" ? (
        <p className="mt-3 text-center text-danger type-body-7" role="alert">{loaded.message}</p>
      ) : null}
      {loaded?.phase === "error" ? (
        <button className="mt-3 w-full rounded-2xl bg-grayscale-50 px-4 py-4 text-primary-400 type-heading-9" onClick={retryStatus} type="button">
          알림 상태 다시 확인하기
        </button>
      ) : status ? (
        <button
          className={`mt-3 inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl px-4 type-heading-9 ${status.active ? "bg-grayscale-100 text-primary-400 hover:bg-grayscale-200" : "bg-primary-400 text-white hover:bg-primary-500"}`}
          onClick={openModal}
          type="button"
        >
          {status.active ? <><CheckIcon aria-hidden className="size-5" focusable="false" /> 알림 받는 중</> : "입찰공고 알림 받기"}
        </button>
      ) : (
        <button className="mt-3 w-full rounded-2xl bg-grayscale-100 px-4 py-4 text-grayscale-600 type-heading-9" disabled type="button">
          알림 상태 확인 중
        </button>
      )}

      {open && status ? (
        <dialog
          aria-label="입찰공고 알림 설정"
          className="m-auto max-h-[calc(100dvh-32px)] max-w-[calc(100vw-32px)] overflow-y-auto rounded-[20px] bg-transparent p-0 text-inherit backdrop:bg-black/40"
          onCancel={(event) => {
            event.preventDefault();
            closeModal();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          ref={dialogRef}
        >
          <AlarmPopup
            enabled={draftEnabled}
            onClose={closeModal}
            onEnabledChange={(enabled) => {
              if (!savingRef.current) setDraftEnabled(enabled);
            }}
            onIgnore={closeModal}
            onSetAlarm={() => void saveAlert()}
            primaryDisabled={saving || draftEnabled === status.active}
            style={{ width: "min(458px, calc(100vw - 32px))" }}
          />
          {mutationError ? (
            <p className="mt-2 rounded-lg bg-white px-4 py-3 text-center text-danger type-body-7" role="alert">{mutationError}</p>
          ) : null}
        </dialog>
      ) : null}
    </AlertCardShell>
  );
}

function AlertCardShell({
  children,
  closeAt,
  icon,
  title,
}: {
  children: React.ReactNode;
  closeAt: string | null;
  icon: string;
  title: string;
}) {
  return (
    <aside className="rounded-[20px] bg-white p-6 shadow-[0_0_12px_var(--grayscale-100)] lg:sticky lg:top-6 lg:self-start">
      <div className="flex flex-col items-center gap-4 text-center">
        <Image alt="" aria-hidden height={80} src={icon} width={80} />
        <p className="max-w-[250px] text-grayscale-800 type-heading-9">{title}</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-grayscale-50 px-4 py-3 text-grayscale-800 type-body-7">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Image alt="" aria-hidden height={24} src="/icon/24dp/clock_pri.svg" width={24} />
          입찰마감
        </span>
        <span className="font-semibold">{closeAt ?? "일정 미제공"}</span>
      </div>
      {children}
    </aside>
  );
}
