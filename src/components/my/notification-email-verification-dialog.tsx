"use client";

import { useEffect, useRef, useState } from "react";

import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { ApiError, errorMessage, type AuthAccess } from "@/features/auth/api";
import {
  confirmNotificationEmailVerification,
  resendNotificationEmailVerification,
  startNotificationEmailVerification,
  type NotificationEmailSetting,
  type NotificationEmailVerification,
} from "@/features/notification-settings/api";

type Props = AuthAccess & {
  open: boolean;
  signupEmail: string;
  onClose: () => void;
  onVerified: (setting: NotificationEmailSetting) => void;
};

function remainingSeconds(timestamp: string | null, now: number): number {
  return timestamp ? Math.max(0, Math.ceil((Date.parse(timestamp) - now) / 1000)) : 0;
}

function formatRemaining(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function NotificationEmailVerificationDialog({
  getAccessToken,
  refresh,
  open,
  signupEmail,
  onClose,
  onVerified,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pendingRef = useRef(false);
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState<NotificationEmailVerification | null>(null);
  const [lastSendAvailableAt, setLastSendAvailableAt] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setNow(Date.now());
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open || (!verification && !lastSendAvailableAt)) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [open, verification, lastSendAvailableAt]);

  const access = { getAccessToken, refresh };
  const resendWait = remainingSeconds(verification?.resendAvailableAt ?? null, now);
  const startWait = remainingSeconds(lastSendAvailableAt, now);
  const validity = remainingSeconds(verification?.expiresAt ?? null, now);
  const expired = verification !== null && validity === 0;

  async function start(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current || startWait > 0) return;
    const target = email.trim().toLowerCase();
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(target) || target.length > 254) {
      setError("올바른 이메일 주소를 입력해 주세요.");
      return;
    }
    if (target === signupEmail.toLowerCase()) {
      setError("가입 이메일과 다른 주소를 입력해 주세요.");
      return;
    }

    pendingRef.current = true;
    setPending(true);
    setError(null);
    try {
      const started = await startNotificationEmailVerification(access, target);
      setEmail(target);
      setVerification(started);
      setLastSendAvailableAt(started.resendAvailableAt);
      setCode("");
      setBlocked(false);
      setNow(Date.now());
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  async function resend() {
    if (!verification || pendingRef.current || resendWait > 0) return;
    pendingRef.current = true;
    setPending(true);
    setError(null);
    try {
      const sent = await resendNotificationEmailVerification(access, verification.verificationId);
      setVerification(sent);
      setLastSendAvailableAt(sent.resendAvailableAt);
      setCode("");
      setBlocked(false);
      setNow(Date.now());
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  async function confirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verification || pendingRef.current || blocked || expired || !/^[0-9]{4}$/.test(code)) return;
    pendingRef.current = true;
    setPending(true);
    setError(null);
    try {
      const setting = await confirmNotificationEmailVerification(access, verification.verificationId, code);
      onVerified(setting);
      setVerification(null);
      setLastSendAvailableAt(null);
      setEmail("");
      setCode("");
      onClose();
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "NE005") {
        setVerification(null);
        setCode("");
        setError("인증번호가 만료됐어요. 새 인증번호를 요청해 주세요.");
        return;
      }
      if (caught instanceof ApiError && caught.code === "NE006") setBlocked(true);
      setError(errorMessage(caught));
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return (
    <dialog
      aria-labelledby="email-verification-title"
      className="m-auto w-[calc(100vw-2rem)] max-w-[640px] rounded-[20px] border border-grayscale-200 bg-basic-white p-0 text-grayscale-800 shadow-xl backdrop:bg-grayscale-900/50"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      ref={dialogRef}
    >
      <div className="flex justify-end px-6 pt-6">
        <button aria-label="닫기" className="inline-flex size-6 items-center justify-center" onClick={onClose} type="button">
          <CloseIcon aria-hidden className="size-6" />
        </button>
      </div>

      {verification ? (
        <form onSubmit={(event) => void confirm(event)}>
          <div className="flex flex-col gap-6 px-6 pb-6">
            <h2 className="whitespace-pre-line type-heading-7" id="email-verification-title">메일로 보낸 인증번호{"\n"}4자리를 입력해 주세요!</h2>
            <p className="break-all type-body-3 text-grayscale-600">{email} 주소로 인증번호를 보냈어요.</p>
            <div className="flex flex-col gap-2">
              <label className="relative block cursor-text rounded-[16px] focus-within:outline-2 focus-within:outline-primary-400">
                <span className="sr-only">인증번호 4자리</span>
                <span aria-hidden className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <span className="flex h-24 items-center justify-center rounded-[16px] border border-grayscale-200 type-heading-3" key={index}>
                      {code[index] ?? ""}
                    </span>
                  ))}
                </span>
                <input
                  autoComplete="one-time-code"
                  autoFocus
                  className="absolute inset-0 h-full w-full cursor-text opacity-0"
                  inputMode="numeric"
                  maxLength={4}
                  onChange={(event) => {
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 4));
                    setError(null);
                  }}
                  pattern="[0-9]{4}"
                  type="text"
                  value={code}
                />
              </label>
              <div className="flex items-start justify-between gap-3 type-body-7">
                <p className="text-danger" role={error || expired ? "alert" : undefined}>
                  {error ?? (expired ? "인증번호가 만료됐어요. 재전송해 주세요." : "")}
                </p>
                <span className="shrink-0 text-primary-400">{formatRemaining(validity)}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 text-center type-body-7 text-grayscale-600">
              <span>인증번호가 안 오나요?</span>
              <button className="underline disabled:opacity-40" disabled={pending || resendWait > 0} onClick={() => void resend()} type="button">
                {resendWait > 0 ? `${resendWait}초 뒤 재전송` : "재전송"}
              </button>
              <button className="underline" disabled={pending} onClick={() => { setVerification(null); setCode(""); setError(null); }} type="button">
                이메일 수정
              </button>
            </div>
          </div>
          <div className="border-t border-grayscale-200 p-6">
            <Button className="h-16 w-full rounded-[16px]" disabled={pending || blocked || expired || code.length !== 4} type="submit">
              {pending ? "확인 중..." : "인증하기"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={(event) => void start(event)}>
          <div className="flex flex-col gap-6 px-6 pb-6">
            <h2 className="whitespace-pre-line type-heading-7" id="email-verification-title">알림 받을 사장님의{"\n"}이메일을 적어주세요!</h2>
            <label className="flex flex-col gap-2 type-body-3 text-grayscale-700" htmlFor="alternate-notification-email">
              이메일
            </label>
            <TextInput
              autoComplete="email"
              autoFocus
              className="-mt-4 w-full"
              id="alternate-notification-email"
              maxLength={254}
              onValueChange={(value) => { setEmail(value); setError(null); }}
              placeholder="알림 받을 이메일 주소를 입력해 주세요."
              type="email"
              value={email}
            />
            {error && <p className="-mt-4 type-body-7 text-danger" role="alert">{error}</p>}
            {startWait > 0 && <p className="-mt-4 type-body-7 text-grayscale-600" role="status">{startWait}초 뒤에 새 인증번호를 요청할 수 있어요.</p>}
          </div>
          <div className="border-t border-grayscale-200 p-6">
            <Button className="h-16 w-full rounded-[16px]" disabled={pending || startWait > 0 || !email.trim()} type="submit">
              {pending ? "보내는 중..." : "인증번호 보내기"}
            </Button>
          </div>
        </form>
      )}
    </dialog>
  );
}
