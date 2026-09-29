"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import type { BidAmountRange, SignupCompanyProfile } from "@/features/auth/types";

export const amountChoices: Array<{ value: BidAmountRange; label: string }> = [
  { value: "BELOW_100_MILLION", label: "~ 1억 원 미만" },
  { value: "FROM_100_MILLION_TO_500_MILLION", label: "1억 원 ~ 5억 원" },
  { value: "FROM_500_MILLION_TO_1_BILLION", label: "5억 원 ~ 10억 원" },
  { value: "FROM_1_BILLION_TO_5_BILLION", label: "10억 원 ~ 50억 원" },
  { value: "AT_LEAST_5_BILLION", label: "50억 원 이상" },
  { value: "ANY", label: "상관없어요!" },
];

function ProfileField({ label, value }: { label: string; value: string | null | undefined }) {
  return <div><dt className="text-grayscale-600 type-body-7">{label}</dt><dd className="mt-1 text-grayscale-800 type-body-7">{value || "정보 없음"}</dd></div>;
}

function formatBusinessNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}` : value;
}

function formatOpeningDate(value: string | null): string | null {
  const match = value?.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}년 ${Number(match[2])}월 설립` : value;
}

export function CompanyIdentityPanel({ profile }: { profile: SignupCompanyProfile }) {
  return (
    <div className="rounded-xl bg-grayscale-50 p-5">
      <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-grayscale-800 px-2 py-1 text-white">
        <Image className="brightness-0 invert" src="/icon/24dp/company.svg" alt="" width={16} height={16} />
        <strong className="type-body-7">{profile.companyName ?? "회사명 정보 없음"}</strong>
      </div>
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <ProfileField label="대표자명" value={profile.representativeName} />
        <ProfileField label="사업자등록번호" value={formatBusinessNumber(profile.businessNumber)} />
        <ProfileField label="주력업종" value={profile.primaryIndustry?.name} />
        <ProfileField label="주소" value={[profile.baseAddress, profile.detailAddress].filter(Boolean).join(" ")} />
        <ProfileField label="전화번호" value={profile.telephoneNumber} />
        <ProfileField label="설립일" value={formatOpeningDate(profile.openingDate)} />
      </dl>
    </div>
  );
}

function evidenceStatus(value: string | undefined): string {
  if (value === "YES") return "Y";
  if (value === "NO") return "N";
  return "정보 없음";
}

function EvidenceTile({ label, value, icon, sourceDate }: { label: string; value: string | undefined; icon: string; sourceDate?: string | null }) {
  return (
    <div className="flex min-h-28 flex-col justify-between rounded-xl bg-grayscale-50 p-5">
      <p className="flex items-center gap-2 text-grayscale-800 type-body-7"><Image src={icon} alt="" width={24} height={24} />{label}</p>
      <p className="text-right font-bold text-grayscale-800 type-body-1">{evidenceStatus(value)}</p>
      <p className="text-right text-grayscale-600 type-body-7">{sourceDate ? `${sourceDate} 자료 기준` : value === "UNKNOWN" || !value ? "확인된 자료 없음" : "공개 자료 기준"}</p>
    </div>
  );
}

export function CompanyEvidencePanel({ profile, onNext }: { profile: SignupCompanyProfile; onNext: () => void }) {
  const amount = profile.capability.amountKrw;
  return (
    <div className="space-y-3">
      <div className="flex min-h-28 flex-col justify-between rounded-xl bg-grayscale-50 p-5">
        <p className="flex items-center gap-2 text-grayscale-800 type-body-7"><Image src="/icon/24dp/crane.svg" alt="" width={24} height={24} />{profile.capability.assessmentYear ? `${profile.capability.assessmentYear}년` : "최근"} 시공능력평가액</p>
        <p className="text-right text-grayscale-800 type-heading-7">
          {amount === null ? "정보 없음" : `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 }).format(amount / 100_000_000)}억 원`}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <EvidenceTile icon="/images/auth/license.png" label="대표면허 여부" sourceDate={profile.capability.sourceSnapshotDate} value={profile.capability.representativeLicenseStatus} />
        <EvidenceTile icon="/images/auth/women.png" label="여성기업 인증여부" sourceDate={profile.certifications.WOMEN_OWNED?.sourceSnapshotDate} value={profile.certifications.WOMEN_OWNED?.status} />
        <EvidenceTile icon="/images/auth/obstacle.png" label="장애인기업 인증여부" sourceDate={profile.certifications.DISABLED_OWNED?.sourceSnapshotDate} value={profile.certifications.DISABLED_OWNED?.status} />
        <EvidenceTile icon="/images/auth/society.png" label="사회적기업 인증여부" sourceDate={profile.certifications.SOCIAL_ENTERPRISE?.sourceSnapshotDate} value={profile.certifications.SOCIAL_ENTERPRISE?.status} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button className="h-14 w-full" disabled title="가입 중 직접 수정 API 준비 중" variant="secondary">직접 수정하기 (준비 중)</Button>
        <Button className="h-14 w-full" onClick={onNext}>다음</Button>
      </div>
      <p className="text-grayscale-600 type-body-7">조회된 정보는 회사 등록 후 다시 확인할 수 있습니다. 직접 수정 기능은 준비 중입니다.</p>
    </div>
  );
}

export function RegistrationPreferences({
  representative,
  onRepresentativeChange,
  positionName,
  onPositionNameChange,
  amountRange,
  onAmountRangeChange,
}: {
  representative: boolean | null;
  onRepresentativeChange: (value: boolean) => void;
  positionName: string;
  onPositionNameChange: (value: string) => void;
  amountRange: BidAmountRange | null;
  onAmountRangeChange: (value: BidAmountRange) => void;
}) {
  return (
    <div className="space-y-6">
      <p className="rounded-lg bg-grayscale-50 p-4 text-grayscale-600 type-body-7">주로 참여하시는 입찰공고 금액을 알려주세요!</p>
      <fieldset>
        <legend className="mb-3 text-grayscale-800 type-body-1">대표자이신가요?</legend>
        <div className="grid grid-cols-2 gap-2">
          {([{ value: true, label: "네, 대표자예요" }, { value: false, label: "아니요" }] as const).map((option) => (
            <button
              aria-pressed={representative === option.value}
              className={`h-12 rounded-lg border type-body-7 ${representative === option.value ? "border-primary text-primary" : "border-grayscale-200 text-grayscale-700"}`}
              key={option.label}
              onClick={() => onRepresentativeChange(option.value)}
              type="button"
            >{option.label}</button>
          ))}
        </div>
      </fieldset>
      {representative === false ? (
        <label className="block text-grayscale-800 type-body-1">
          직급
          <TextInput className="mt-2 w-full" maxLength={30} onValueChange={onPositionNameChange} placeholder="직급을 입력해 주세요." value={positionName} />
        </label>
      ) : null}
      <fieldset>
        <legend className="mb-3 text-grayscale-800 type-body-1">희망하는 입찰공고 금액대가 있나요?</legend>
        <div className="grid grid-cols-2 gap-2">
          {amountChoices.map((option) => (
            <button
              aria-pressed={amountRange === option.value}
              className={`min-h-12 rounded-lg border px-2 type-body-7 ${amountRange === option.value ? "border-primary text-primary" : "border-grayscale-200 text-grayscale-700"}`}
              key={option.value}
              onClick={() => onAmountRangeChange(option.value)}
              type="button"
            >{option.label}</button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function RegistrationFinished({ verified, warning }: { verified: boolean; warning?: string | null }) {
  return (
    <div className="space-y-5 text-center">
      <h1 className="text-grayscale-800 type-heading-7">우리 회사 등록을 마쳤어요!</h1>
      <p className="text-grayscale-600 type-body-3">{verified ? "사업자등록증명서 확인을 완료했어요." : "미인증 회사로 등록했어요. 인증은 나중에 진행할 수 있어요."}</p>
      {warning ? <p className="rounded-lg bg-grayscale-50 p-3 text-warning type-body-7">{warning}</p> : null}
      <Link className="block rounded-lg bg-primary px-5 py-4 text-white" href="/bids">메이트 시작하기</Link>
    </div>
  );
}
