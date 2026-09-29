"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthBack, AuthCard, AuthError } from "@/components/auth/auth-screen";
import { Button } from "@/components/ui/button";
import { CheckboxSquare } from "@/components/ui/checkbox";
import { TextInput } from "@/components/ui/input";
import { completeSocialSignup, errorMessage, getCurrentSocialSignup } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";
import type { AgreementCode, SocialSignup } from "@/features/auth/types";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";

const agreementCodes: AgreementCode[] = ["PRIVACY_POLICY", "TERMS_OF_SERVICE"];
const agreementHref: Record<AgreementCode, string> = {
  PRIVACY_POLICY: "/auth/legal/privacy",
  TERMS_OF_SERVICE: "/auth/legal/terms",
};

export function SignupForm({ flowId, returnTo }: { flowId: string | null; returnTo?: string }) {
  const router = useRouter();
  const { setAuthentication } = useAuthSession();
  const [signup, setSignup] = useState<SocialSignup | null>(null);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [accepted, setAccepted] = useState<AgreementCode[]>([]);
  const [loading, setLoading] = useState(Boolean(flowId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    flowId ? null : "가입 정보를 확인할 수 없습니다. Google 로그인부터 다시 시도해 주세요.",
  );

  useEffect(() => {
    if (!flowId) return;
    let active = true;
    void getCurrentSocialSignup(flowId)
      .then((value) => {
        if (!active) return;
        setSignup(value);
        setName(value.suggestedName ?? "");
      })
      .catch((reason: unknown) => {
        if (active) setError(errorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [flowId]);

  const agreementsValid = useMemo(() =>
    signup?.requiredAgreements.length === agreementCodes.length &&
    agreementCodes.every((code) => signup.requiredAgreements.some((item) => item.code === code)),
  [signup]);
  const allAccepted = agreementsValid && agreementCodes.every((code) => accepted.includes(code));

  function toggleAgreement(code: AgreementCode, checked: boolean) {
    setAccepted((current) => checked ? [...current.filter((item) => item !== code), code] : current.filter((item) => item !== code));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!flowId || !signup || !allAccepted || submitting) return;
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > 50) {
      setError("이름은 1자 이상 50자 이하로 입력해 주세요.");
      return;
    }
    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (birthDate && (birthDate < "1900-01-01" || birthDate > localToday)) {
      setError("생년월일을 다시 확인해 주세요.");
      return;
    }
    const phone = mobilePhone.replace(/[\s-]/g, "");
    if (phone && !/^(010\d{8}|02\d{7,8}|0[3-6]\d{8,9})$/.test(phone)) {
      setError("휴대폰번호 형식을 다시 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const authentication = await completeSocialSignup(flowId, {
        name: trimmedName,
        birthDate: birthDate || null,
        mobilePhone: phone || null,
        agreementAcceptances: signup.requiredAgreements.map(({ code, version }) => ({ code, version })),
      });
      setAuthentication(authentication);
      const nextPath = sanitizeLocalNextPath(returnTo ?? "/");
      router.replace(nextPath === "/auth/company/invitations" ? nextPath : `/auth/start?next=${encodeURIComponent(nextPath)}`);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <AuthBack href="/auth" />
      <h1 className="mb-6 text-grayscale-800 type-heading-7">소셜 계정으로<br />메이트를 시작해볼까요?</h1>
      {loading ? <p className="text-grayscale-600 type-body-3">가입 정보를 확인하고 있어요.</p> : null}
      {!loading && !signup ? (
        <div className="space-y-4">
          <AuthError message={error ?? "가입 정보를 찾지 못했습니다. Google 로그인부터 다시 시작해 주세요."} />
          <Link className="text-primary underline" href="/auth">Google 로그인으로 돌아가기</Link>
        </div>
      ) : null}
      {signup ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-grayscale-700 type-body-3">
              가입 이메일
              <TextInput className="mt-2 w-full" disabled readOnly value={signup.verifiedEmail} />
            </label>
            <label className="block text-grayscale-700 type-body-3">
              이름<span className="text-primary">*</span>
              <TextInput className="mt-2 w-full" maxLength={50} onValueChange={setName} placeholder="이름을 입력해 주세요." required value={name} />
            </label>
            <label className="block text-grayscale-700 type-body-3">
              생년월일(선택)
              <input className="mt-2 h-12 w-full rounded-lg border border-grayscale-200 bg-white px-3 text-grayscale-700 outline-none focus:border-primary" max="9999-12-31" min="1900-01-01" onChange={(event) => setBirthDate(event.target.value)} type="date" value={birthDate} />
            </label>
            <label className="block text-grayscale-700 type-body-3">
              휴대폰번호(선택)
              <TextInput className="mt-2 w-full" inputMode="tel" onValueChange={setMobilePhone} placeholder="휴대폰번호를 입력해 주세요." value={mobilePhone} />
              <span className="mt-2 block text-grayscale-600 type-body-7">본인 확인용이 아니니 편하게 적어주세요!</span>
            </label>
          </div>

          <div className="rounded-lg bg-grayscale-50 p-6">
            <p className="mb-4 text-warning type-body-7">개발·테스트용 임시 약관입니다. 정식 본문은 추후 게시됩니다.</p>
            <div className="flex items-center gap-2">
              <CheckboxSquare ariaLabel="필수 약관에 모두 동의" checked={Boolean(allAccepted)} onCheckedChange={(checked) => setAccepted(checked ? [...agreementCodes] : [])} />
              <span className="text-grayscale-800 type-body-1">필수 약관에 모두 동의</span>
            </div>
            <div className="mt-4 space-y-3 border-t border-grayscale-200 pt-4">
              {agreementCodes.map((code) => {
                const agreement = signup.requiredAgreements.find((item) => item.code === code);
                return agreement ? (
                  <div className="flex items-center gap-2" key={code}>
                    <CheckboxSquare ariaLabel={`${agreement.title} 동의`} checked={accepted.includes(code)} onCheckedChange={(checked) => toggleAgreement(code, checked)} />
                    <Link className="text-grayscale-700 underline type-body-7" href={agreementHref[code]} target="_blank" rel="noopener noreferrer">
                      [필수] {agreement.title}
                    </Link>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          {!agreementsValid ? <AuthError message="필수 약관 정보를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요." /> : null}
          <AuthError message={error} />
          <Button className="h-16 w-full" disabled={!name.trim() || !allAccepted || submitting} type="submit">
            {submitting ? "가입하고 있어요..." : "메이트 시작하기"}
          </Button>
        </form>
      ) : null}
    </AuthCard>
  );
}
