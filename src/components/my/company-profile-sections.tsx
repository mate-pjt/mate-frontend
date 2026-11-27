"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { CompanyConstructionCapabilities, CompanyProfileSource, CompanyPublicCertification } from "@/data/company/client";
import type { AuthAccess } from "@/data/shared/http";
import { loadCompanyProfileSections, type ProfileSection } from "@/features/company/company-profile";

type Section = "capabilities" | "certifications";
type ProfileLifetime = { controller: AbortController; membershipId?: number };
type SectionsProps = AuthAccess & {
  companyId: number;
  scope: string;
  readScope: () => string | null;
  onAccessLost: (status: "unauthorized" | "denied") => void;
  onReturn: () => void;
};

const won = new Intl.NumberFormat("ko-KR");
const confirmedTime = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short" });
const sourceText: Record<CompanyProfileSource, string> = {
  AUTO_INITIAL: "자동 반영",
  ADMIN_ACCEPTED_EXTERNAL: "관리자가 외부 자료 승인",
  ADMIN_MANUAL: "관리자가 직접 입력",
};
const representativeText = { SELECTED: "대표 평가 선택됨", NONE: "대표 평가 없음", UNDETERMINED: "대표 평가 판단 불가" };
const certificationText = { YES: "해당", NO: "미해당", UNKNOWN: "확인 불가" };
const certificationLabels = {
  WOMEN_OWNED: { label: "여성기업 인증여부", icon: "/images/auth/women.png" },
  DISABLED_OWNED: { label: "장애인기업 인증여부", icon: "/images/auth/obstacle.png" },
  SOCIAL_ENTERPRISE: { label: "사회적기업 인증여부", icon: "/images/auth/society.png" },
};

export function CompanyProfileSections({ companyId, scope, readScope, getAccessToken, refresh, getAccountKey, onAccessLost, onReturn }: SectionsProps) {
  const [capabilities, setCapabilities] = useState<ProfileSection<CompanyConstructionCapabilities>>({ status: "loading" });
  const [certifications, setCertifications] = useState<ProfileSection<CompanyPublicCertification[]>>({ status: "loading" });
  const lifetime = useRef<ProfileLifetime | null>(null);
  const load = useCallback((cycle: ProfileLifetime, section?: Section) => {
    void loadCompanyProfileSections({
      access: { getAccessToken, refresh, getAccountKey }, companyId, signal: cycle.controller.signal,
      isCurrent: () => readScope() === scope,
      previousMembershipId: cycle.membershipId,
      onMembershipConfirmed: (id) => { cycle.membershipId = id; },
      onAccessLost: (status) => {
        cycle.controller.abort();
        onAccessLost(status);
      },
      onCapabilities: section === "certifications" ? undefined : setCapabilities,
      onCertifications: section === "capabilities" ? undefined : setCertifications,
    });
  }, [companyId, getAccessToken, refresh, getAccountKey, readScope, scope, onAccessLost]);

  useEffect(() => {
    const controller = new AbortController();
    const cycle = { controller };
    lifetime.current = cycle;
    load(cycle);
    function onVisibility() {
      if (document.visibilityState === "visible") onReturn();
    }
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) onReturn();
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      controller.abort();
      lifetime.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [load, onReturn]);

  function retry(section: Section) {
    const cycle = lifetime.current;
    if (!cycle || cycle.controller.signal.aborted) return;
    if (section === "capabilities") setCapabilities({ status: "loading" });
    else setCertifications({ status: "loading" });
    load(cycle, section);
  }

  return (
    <div className="mt-6 space-y-4 border-t border-grayscale-200 pt-6">
      <ProfilePanel id="construction-capability" title="시공능력평가액" icon="/icon/24dp/crane.svg"
        result={capabilities} onRetry={() => retry("capabilities")}>
        {capabilities.status === "ready" && <CapabilityResults result={capabilities.value} />}
      </ProfilePanel>
      <ProfilePanel id="public-certifications" title="기업 인증" result={certifications} onRetry={() => retry("certifications")}>
        {certifications.status === "ready" && <CertificationCards items={certifications.value} />}
      </ProfilePanel>
    </div>
  );
}

function ProfilePanel({ id, title, icon, result, onRetry, children }: {
  id: string;
  title: string;
  icon?: string;
  result: ProfileSection<unknown>;
  onRetry: () => void;
  children: ReactNode;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <section aria-labelledby={id} className="min-w-0 rounded-2xl bg-grayscale-50 p-4 sm:p-6">
      <h2 className="flex items-center gap-1 type-body-3 text-grayscale-700" id={id} ref={heading} tabIndex={-1}>
        {icon && <Image alt="" className="shrink-0" src={icon} width={24} height={24} loading="eager" />}
        {title}
      </h2>
      <div className="mt-4" aria-live="polite">
        {result.status === "loading" && <p className="type-body-7 text-grayscale-700" role="status">조회하고 있어요.</p>}
        {result.status === "ready" && children}
        {(result.status === "denied" || result.status === "error") && (
          <div>
            <p className="type-body-7 text-grayscale-700">
              {result.status === "denied" ? "조회할 권한이 없어요." : "자료를 조회하지 못했어요."}
            </p>
            <Button className="mt-3" variant="outline" aria-label={`${title} 다시 시도하기`} onClick={() => {
              heading.current?.focus();
              onRetry();
            }}>다시 시도하기</Button>
          </div>
        )}
      </div>
    </section>
  );
}

function SnapshotDate({ value }: { value: string | null }) {
  return value === null ? <span>자료 기준일 정보 없음</span> : <span>자료 기준일 <time dateTime={value}>{value}</time></span>;
}

function CapabilityResults({ result }: { result: CompanyConstructionCapabilities }) {
  return (
    <div className="space-y-4">
      <p className="flex items-center gap-1 type-body-7 text-grayscale-700">
        <Image alt="" className="shrink-0" src="/images/auth/license.png" width={24} height={24} loading="eager" unoptimized />
        {representativeText[result.representativeStatus]}
      </p>
      {result.industries.length === 0 && <p className="type-body-3 text-grayscale-700">확인된 평가 자료가 없어요.</p>}
      {result.industries.map(industry => (
        <div className="space-y-3 rounded-xl bg-basic-white p-4" key={industry.industryCode}>
          <h3 className="break-words type-body-2 text-grayscale-800">{industry.industryName} <span className="type-body-7 text-grayscale-700">({industry.industryCode})</span></h3>
          {industry.assessments.length === 0 ? <p className="type-body-7 text-grayscale-700">확인된 평가 자료가 없어요.</p> : (
            <ul className="divide-y divide-grayscale-200">
              {industry.assessments.map(assessment => (
                <li className="grid min-w-0 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start" key={assessment.assessmentId}>
                  <div className="min-w-0 space-y-1">
                    <p className="break-words type-body-6 text-grayscale-800">
                      {assessment.assessmentSubjectName}
                      {result.representativeAssessmentId === assessment.assessmentId && <span className="ml-2 rounded-md bg-primary-100 px-2 py-1 text-primary">대표 평가</span>}
                    </p>
                    <p className="flex flex-wrap gap-x-3 gap-y-1 type-body-7 text-grayscale-700">
                      <span>{assessment.assessmentYear === null ? "평가연도 정보 없음" : `평가연도 ${assessment.assessmentYear}년`}</span>
                      <SnapshotDate value={assessment.snapshotDate} />
                      <span>{sourceText[assessment.provenanceType]}</span>
                      <span>대표면허 {assessment.representativeLicense === null ? "확인 불가" : assessment.representativeLicense ? "해당" : "미해당"}</span>
                    </p>
                  </div>
                  <p className="min-w-0 break-words text-right type-heading-5 text-grayscale-800">{won.format(BigInt(assessment.amountKrw))}원</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {result.unmappedObservationCount > 0 && <p className="type-body-7 text-grayscale-700">업종과 연결하지 못한 자료가 {won.format(result.unmappedObservationCount)}건 있어요.</p>}
    </div>
  );
}

function CertificationCards({ items }: { items: CompanyPublicCertification[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {items.map(item => {
        const { label, icon } = certificationLabels[item.type];
        return (
          <li className="min-w-0 space-y-3 rounded-xl bg-basic-white p-4" key={item.type}>
            <h3 className="flex items-center gap-1 type-body-3 text-grayscale-700">
              <Image alt="" className="shrink-0" src={icon} width={24} height={24} loading="eager" unoptimized />
              {label}
            </h3>
            <p className="text-right type-heading-5 text-grayscale-800">{certificationText[item.status]}</p>
            {item.source === null ? (
              <p className="type-body-7 text-grayscale-700">저장된 확인 자료 없음</p>
            ) : (
              <div className="space-y-1 type-body-7 text-grayscale-700">
                <p>{sourceText[item.source]}</p>
                <p><SnapshotDate value={item.snapshotDate} /></p>
                {item.confirmedAt && <p>관리자 확정 <time dateTime={item.confirmedAt}>{confirmedTime.format(new Date(item.confirmedAt))}</time></p>}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
