import Image from "next/image";
import { useId, type FormEventHandler } from "react";
import { CompanyIdentityPanel } from "@/components/auth/company-registration";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import type { BusinessConnection, SignupCompanyProfile } from "@/data/company/contracts";

export type SettingsLookupResult =
  | { status: "input" }
  | { status: "enriching"; progress: Pick<BusinessConnection["enrichmentRun"], "completedSteps" | "totalSteps">; onStatusCheck: () => void }
  | { status: "identity"; profile: SignupCompanyProfile; onNext: () => void }
  | { status: "verified"; searchHref: string };

export function SettingsBusinessNumberLookup({
  result,
  value,
  busy,
  error,
  replacing,
  onValueChange,
  onBlur,
  onSubmit,
}: {
  result: SettingsLookupResult;
  value: string;
  busy: boolean;
  error: string | null;
  replacing: boolean;
  onValueChange: (value: string) => void;
  onBlur: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const errorId = useId();
  const collecting = result.status === "enriching";
  const locked = busy || collecting;
  const querying = locked && result.status !== "identity";
  const showExample = result.status === "input" || collecting;

  return (
    <div className={showExample ? undefined : "flex flex-col gap-8 md:min-h-[min(685px,calc(100dvh-340px))]"}>
      <div className="space-y-6">
        <h1 className="wrap-anywhere text-grayscale-800 type-heading-5">
          {result.status === "identity" ? <>사장님!<br />{result.profile.companyName} 회사가 맞으신가요?</>
            : result.status === "verified" ? <>사장님!<br />이미 인증된 회사 정보가 있어요!</>
            : <>반가워요 사장님!<br />사업자등록번호로 우리 회사를 찾아보세요.</>}
        </h1>
        <div className="space-y-4">
          <form aria-busy={querying} className="space-y-2" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start">
              <TextInput
                aria-describedby={error ? errorId : undefined}
                aria-label="사업자등록번호"
                className="w-full! min-w-0 flex-1"
                fieldClassName="focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
                inputMode="numeric"
                maxLength={12}
                onBlur={onBlur}
                onValueChange={onValueChange}
                placeholder="사업자등록번호 10자리를 입력해주세요."
                readOnly={locked}
                status={error ? "error" : "default"}
                value={value}
              />
              <Button className="h-12 shrink-0 rounded-xl! min-[420px]:min-w-[106px]" disabled={locked || !value.trim()} type="submit">
                {querying ? "조회 중" : replacing ? "이전 조회 종료 후 조회" : "조회하기"}
              </Button>
            </div>
            {error && (
              <p className="px-2 text-danger type-body-8" id={errorId} role="alert">
                {error}
              </p>
            )}
          </form>
          {querying && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary-100 px-4 py-3">
              <p className="text-primary-700 type-body-7" role="status">
                {collecting
                  ? `${result.progress.completedSteps} / ${result.progress.totalSteps} 단계 완료`
                  : "회사 정보를 조회하고 있어요."}
              </p>
              {collecting && <Button disabled={busy} onClick={result.onStatusCheck} size="xs" variant="secondary">지금 상태 확인</Button>}
            </div>
          )}
          {showExample && (
            <div className="space-y-2 rounded-2xl bg-grayscale-50 p-6 type-body-7">
              <p className="text-grayscale-600">예시 사업자등록번호</p>
              <span className="inline-block rounded-md border border-grayscale-200 bg-white px-2 py-1 text-grayscale-700">123-45-67890</span>
            </div>
          )}
          {result.status === "identity" && <CompanyIdentityPanel profile={result.profile} settings />}
          {result.status === "verified" && (
            <p className="flex items-start gap-1 rounded-xl bg-primary-100 p-6 text-primary-700 type-body-2">
              <Image alt="" className="shrink-0" height={20} src="/icon/24dp/check_circle.svg" width={20} />
              서류 검증이 완료된 회사로 소속 신청이 필요해요.
            </p>
          )}
        </div>
      </div>
      {result.status === "identity" && <Button className="mt-auto w-full! max-w-full" onClick={result.onNext} size="xxl">다음</Button>}
      {result.status === "verified" && <ButtonLink className="mt-auto w-full! max-w-full" href={result.searchHref} size="xxl">기존 회사 찾기</ButtonLink>}
    </div>
  );
}
