"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { CheckIcon, RightArrowIcon, UpArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { Toggle, type ToggleProps } from "@/components/ui/toggle";
import { showToast } from "@/components/ui/toast";
import { errorMessage } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { useAuthSession } from "@/features/auth/session";
import {
  changeNotificationEmailRecipient,
  changeMatchedBidEmailSetting,
  getMatchedBidEmailSetting,
  getNotificationEmailSetting,
  notificationSettingsCapabilities,
  type MatchedBidEmailSetting,
  type NotificationEmailSetting,
  type UnavailableNotificationSetting,
} from "@/data/notification-settings/client";

import { NotificationEmailVerificationDialog } from "./notification-email-verification-dialog";

const unavailableHelp: Record<UnavailableNotificationSetting["reason"], string> = {
  "web-connection-pending": "입찰공고 상세 알림은 웹에서 아직 설정할 수 없어요.",
  "night-delivery-not-supported": "야간 시간에 따른 알림 조정은 아직 지원되지 않아요.",
};

const unavailableSettings = [
  { id: "detail-alerts", title: "입찰공고 상세 알림", capability: notificationSettingsCapabilities.detailAlerts },
  { id: "night-alerts", title: "야간 알림 수신", capability: notificationSettingsCapabilities.nightAlerts, className: "mt-4 border-t border-grayscale-200" },
];

function NotificationSettingRow({
  id,
  title,
  description,
  toggle,
  className = "",
  children,
}: {
  id: string;
  title: string;
  description: string;
  toggle: ToggleProps;
  className?: string;
  children?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const descriptionId = `${id}-description`;

  return (
    <section aria-labelledby={`${id}-title`} className={`space-y-2 py-4 ${className}`}>
      <div className="flex items-center justify-between gap-2 sm:pr-5">
        <h2 className="min-w-0 type-body-1 text-grayscale-800" id={`${id}-title`}>
          <button
            aria-controls={descriptionId}
            aria-describedby={descriptionId}
            aria-expanded={expanded}
            className="flex min-h-9 cursor-pointer items-center gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            onClick={() => setExpanded((current) => !current)}
            title={expanded ? undefined : description}
            type="button"
          >
            {title}
            <UpArrowIcon aria-hidden className={`size-5 shrink-0 ${expanded ? "" : "rotate-180"}`} />
          </button>
        </h2>
        <Toggle {...toggle} aria-describedby={descriptionId} />
      </div>
      <p className="rounded-lg bg-grayscale-50 p-4 type-body-7 text-grayscale-700" hidden={!expanded} id={descriptionId}>
        {description}
      </p>
      {children}
    </section>
  );
}

export function NotificationSettingsPageClient() {
  const { state, getAccessToken, refresh, getAccountKey } = useAuthSession();

  if (state.status === "authenticated") {
    return (
      <AuthenticatedNotificationSettings
        getAccessToken={getAccessToken}
        getAccountKey={getAccountKey}
        key={state.authentication.account.id}
        refresh={refresh}
      />
    );
  }

  if (state.status === "anonymous") {
    return (
      <section className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex max-w-[420px] flex-col items-center gap-5">
          <h1 className="type-heading-7 text-grayscale-800">이메일 알림을 설정해 보세요</h1>
          <p className="type-body-3 text-grayscale-600">로그인하면 맞춤 공고 이메일 수신 여부를 변경할 수 있어요.</p>
          <ButtonLink href="/auth?mode=login&next=%2Fmy%2Fsettings%2Fnotifications">로그인하고 설정하기</ButtonLink>
        </div>
      </section>
    );
  }

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

function AuthenticatedNotificationSettings({ getAccessToken, refresh, getAccountKey }: AuthAccess) {
  const [emailSetting, setEmailSetting] = useState<NotificationEmailSetting | null>(null);
  const [matchedSetting, setMatchedSetting] = useState<MatchedBidEmailSetting | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [recipientSaving, setRecipientSaving] = useState(false);
  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const savingRef = useRef(false);
  const recipientSavingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const access = { getAccessToken, refresh, getAccountKey };

    void Promise.all([
      getNotificationEmailSetting(access, controller.signal),
      getMatchedBidEmailSetting(access, controller.signal),
    ]).then(
      ([email, matched]) => {
        if (controller.signal.aborted) return;
        setEmailSetting(email);
        setMatchedSetting(matched);
      },
      (error: unknown) => {
        if (!controller.signal.aborted) setLoadError(errorMessage(error));
      },
    );

    return () => controller.abort();
  }, [getAccessToken, refresh, getAccountKey, retry]);

  function retryLoad() {
    setLoadError(null);
    setEmailSetting(null);
    setMatchedSetting(null);
    setRetry((current) => current + 1);
  }

  async function changeSetting(enabled: boolean) {
    if (!matchedSetting || savingRef.current || enabled === matchedSetting.enabled) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await changeMatchedBidEmailSetting({ getAccessToken, refresh, getAccountKey }, enabled);
      setMatchedSetting(updated);
      showToast(enabled ? "맞춤 공고 이메일을 켰어요." : "맞춤 공고 이메일을 껐어요.");
    } catch (error) {
      setSaveError(errorMessage(error));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  async function selectRecipient(recipientType: NotificationEmailSetting["recipientType"]) {
    if (!emailSetting || recipientSavingRef.current || recipientType === emailSetting.recipientType) return;
    if (recipientType === "ALTERNATE_EMAIL" && !emailSetting.alternateEmail) {
      setVerificationOpen(true);
      return;
    }

    recipientSavingRef.current = true;
    setRecipientSaving(true);
    setRecipientError(null);
    try {
      const updated = await changeNotificationEmailRecipient({ getAccessToken, refresh, getAccountKey }, recipientType);
      setEmailSetting(updated);
      showToast("알림 수신 이메일을 변경했어요.");
    } catch (error) {
      setRecipientError(errorMessage(error));
    } finally {
      recipientSavingRef.current = false;
      setRecipientSaving(false);
    }
  }

  if (!emailSetting || !matchedSetting) {
    return (
      <section aria-live="polite" className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="type-body-3 text-grayscale-600" role={loadError ? "alert" : "status"}>
            {loadError ?? "이메일 알림 설정을 확인하고 있어요."}
          </p>
          {loadError && <Button onClick={retryLoad} variant="outline">다시 시도하기</Button>}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="notification-settings-title" className="flex-1 bg-grayscale-50 px-4 pb-24 pt-[30px] sm:px-6">
      <div className="mx-auto w-full max-w-[1180px]">
        <nav aria-label="현재 위치" className="mb-4 flex items-center gap-1 type-body-3">
          <Link className="text-grayscale-600 hover:text-grayscale-800" href="/my">마이페이지</Link>
          <RightArrowIcon aria-hidden className="size-4 text-grayscale-600" />
          <span aria-current="page" className="font-bold text-grayscale-800">알림 설정</span>
        </nav>

        <div className="flex flex-col gap-6 rounded-[20px] bg-basic-white p-4 shadow-[0_0_20px_rgba(0,0,0,0.04)] sm:p-6">
          <h1 className="type-heading-9 text-grayscale-800" id="notification-settings-title">알림 설정</h1>

          <fieldset className="flex min-w-0 flex-col gap-4">
            <legend className="mb-4 type-body-1 text-grayscale-800">알림 수신 이메일</legend>
            <div className="flex flex-col gap-4 rounded-2xl bg-grayscale-50 p-4 sm:p-6">
              {([
                { type: "SIGNUP_EMAIL", label: "가입한 이메일로 받기", address: emailSetting.signupEmail },
                { type: "ALTERNATE_EMAIL", label: "다른 이메일로 받기", address: emailSetting.alternateEmail },
              ] as const).map((option) => (
                <label className="flex min-w-0 cursor-pointer flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-md focus-within:outline-2 focus-within:outline-primary-400" key={option.type}>
                  <span className="flex items-center gap-2 type-body-2 text-grayscale-800">
                    <input
                      checked={emailSetting.recipientType === option.type}
                      className="sr-only"
                      disabled={recipientSaving}
                      name="notification-recipient"
                      onChange={() => void selectRecipient(option.type)}
                      type="radio"
                      value={option.type}
                    />
                    <span aria-hidden className={`inline-flex size-5 shrink-0 items-center justify-center rounded-[6px] border ${emailSetting.recipientType === option.type ? "border-primary-400 bg-primary-400 text-white" : "border-grayscale-200 bg-white"}`}>
                      {emailSetting.recipientType === option.type && <CheckIcon className="size-4" />}
                    </span>
                    {option.label}
                  </span>
                  {option.address && <span className="min-w-0 break-all type-body-2 text-grayscale-800">{option.address}</span>}
                </label>
              ))}
              {emailSetting.alternateEmail && (
                <div className="flex justify-end">
                  <Button disabled={recipientSaving} onClick={() => setVerificationOpen(true)} variant="text_darkblue">다른 이메일 변경</Button>
                </div>
              )}
            </div>
            {recipientSaving && <p className="type-body-7 text-grayscale-600" role="status">수신 주소를 저장하고 있어요.</p>}
            {recipientError && <p className="type-body-7 text-danger" role="alert">{recipientError}</p>}
          </fieldset>

          <NotificationEmailVerificationDialog
            getAccessToken={getAccessToken}
            getAccountKey={getAccountKey}
            onClose={() => setVerificationOpen(false)}
            onVerified={(updated) => {
              setEmailSetting(updated);
              setRecipientError(null);
              showToast("새 이메일 인증을 완료했어요. 이 주소로 알림을 받을게요.");
            }}
            open={verificationOpen}
            refresh={refresh}
            signupEmail={emailSetting.signupEmail}
          />

          <div>
            <NotificationSettingRow
              description="매일 오전 8시 30분, 개인 공고 필터에 맞는 새 공고가 있을 때만 이메일로 보내드려요. 맞춤 공고 이메일을 꺼도 공고별 서비스 내부 알림 설정은 유지돼요."
              id="matched-email"
              title="나에게 맞는 입찰공고 이메일"
              toggle={{
                ariaLabel: "맞춤 공고 이메일 수신",
                checked: matchedSetting.enabled,
                disabled: saving,
                onCheckedChange: (enabled) => void changeSetting(enabled),
              }}
            >
              {saving && <p className="type-body-7 text-grayscale-600" role="status">설정을 저장하고 있어요.</p>}
              {saveError && <p className="type-body-7 text-danger" role="alert">{saveError}</p>}
            </NotificationSettingRow>
            {unavailableSettings.map(({ id, title, capability, className }) => (
              <NotificationSettingRow
                className={className}
                description={unavailableHelp[capability.reason]}
                id={id}
                key={id}
                title={title}
                toggle={{ ariaLabel: title, unavailable: capability.status === "unavailable" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
