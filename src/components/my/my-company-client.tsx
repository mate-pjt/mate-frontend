"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StrokeLeftArrowIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { ApiError, errorMessage, type AuthAccess } from "@/features/auth/api";
import { useAuthSession } from "@/features/auth/session";
import {
  getCompanyBasicProfile,
  getMyMembershipRequest,
  type CompanyBasicProfile,
  type MembershipRequest,
} from "@/features/my-company/api";

import { MySideMenu } from "./my-side-menu";

type CompanyView = "overview" | "start";
type LoadState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "pending" | "terminated" | "approved-stale"; request: MembershipRequest }
  | { status: "connected"; profile: CompanyBasicProfile }
  | { status: "denied" }
  | { status: "error"; message: string };

export function MyCompanyClient({ view }: { view: CompanyView }) {
  const { state, getAccessToken, refresh } = useAuthSession();

  if (state.status === "authenticated") {
    return (
      <AuthenticatedMyCompany
        getAccessToken={getAccessToken}
        key={`${state.authentication.account.id}:${view}`}
        refresh={refresh}
        view={view}
      />
    );
  }

  if (state.status === "anonymous") {
    const next = view === "start" ? "/my/company/start" : "/my/company";
    return (
      <section className="grid flex-1 place-items-center px-4 py-20 text-center">
        <div className="flex max-w-[420px] flex-col items-center gap-5">
          <h1 className="type-heading-7 text-grayscale-800">나의 회사 정보를 확인해 보세요</h1>
          <p className="type-body-3 text-grayscale-600">로그인하면 연결된 회사와 소속 신청 상태를 확인할 수 있어요.</p>
          <ButtonLink href={`/auth?mode=login&next=${encodeURIComponent(next)}`}>로그인하고 돌아오기</ButtonLink>
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
        {state.status === "error" && <Button onClick={() => void refresh().catch(() => undefined)} variant="outline">다시 시도하기</Button>}
      </div>
    </section>
  );
}

function AuthenticatedMyCompany({ getAccessToken, refresh, view }: AuthAccess & { view: CompanyView }) {
  const [result, setResult] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const access = { getAccessToken, refresh };

    async function loadCompany(companyId: number) {
      const profile = await getCompanyBasicProfile(access, companyId, controller.signal);
      if (!controller.signal.aborted) {
        if (profile.companyId !== companyId) throw new ApiError(0, "COMPANY_MISMATCH", "회사 정보를 확인하지 못했어요. 다시 시도해 주세요.");
        setResult({ status: "connected", profile });
      }
    }

    async function load() {
      try {
        const session = await refresh();
        if (controller.signal.aborted || !session) return;
        if (session.companyContext) {
          await loadCompany(session.companyContext.companyId);
          return;
        }

        let request: MembershipRequest;
        try {
          request = await getMyMembershipRequest(access, controller.signal);
        } catch (error) {
          if (error instanceof ApiError && error.status === 404 && error.code === "CR001") {
            if (!controller.signal.aborted) setResult({ status: "empty" });
            return;
          }
          throw error;
        }
        if (controller.signal.aborted) return;
        if (request.status === "APPROVED") {
          const updated = await refresh();
          if (controller.signal.aborted || !updated) return;
          if (updated.companyContext) {
            await loadCompany(updated.companyContext.companyId);
          } else {
            setResult({ status: "approved-stale", request });
          }
          return;
        }
        setResult({ status: request.status === "PENDING" ? "pending" : "terminated", request });
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof ApiError && error.status === 403) {
          setResult({ status: "denied" });
        } else {
          setResult({ status: "error", message: errorMessage(error) });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [attempt, getAccessToken, refresh]);

  function retry() {
    setResult({ status: "loading" });
    setAttempt((current) => current + 1);
  }

  if (view === "start" && (result.status === "empty" || result.status === "terminated")) {
    return <StartChoices previousRequest={result.status === "terminated" ? result.request : null} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1668px] flex-1 flex-col gap-6 px-4 pb-24 pt-[30px] sm:px-6 lg:flex-row xl:px-0">
      <MySideMenu value="company" />
      <section className="min-w-0 w-full max-w-[1180px]" id="my-company-content">
        {result.status === "loading" && <StatusMessage message="회사 정보를 확인하고 있어요." />}
        {result.status === "error" && <StatusMessage message={result.message} onRetry={retry} />}
        {result.status === "denied" && <StatusMessage message="회사 정보를 볼 권한이 없어요. 회사 관리자에게 권한을 확인해 주세요." onRetry={retry} />}
        {result.status === "empty" && <EmptyCompany />}
        {result.status === "pending" && <PendingRequest request={result.request} />}
        {result.status === "terminated" && <TerminatedRequest request={result.request} />}
        {result.status === "approved-stale" && (
          <StatusMessage message="소속 신청은 승인됐지만 회사 연결이 아직 반영되지 않았어요. 잠시 후 다시 확인해 주세요." onRetry={retry} />
        )}
        {result.status === "connected" && <ConnectedCompany profile={result.profile} />}
      </section>
    </div>
  );
}

function StatusMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <section aria-live="polite" className="grid min-h-[520px] place-items-center text-center">
      <div className="flex max-w-[420px] flex-col items-center gap-5">
        <p className="type-body-3 text-grayscale-600" role={onRetry ? "alert" : "status"}>{message}</p>
        {onRetry && <Button onClick={onRetry} variant="outline">다시 시도하기</Button>}
      </div>
    </section>
  );
}

function EmptyCompany() {
  return (
    <section className="grid min-h-[640px] place-items-center text-center" aria-labelledby="empty-company-title">
      <div className="flex max-w-[369px] flex-col items-center gap-4">
        <div aria-hidden className="relative size-20">
          <Image className="absolute left-1 top-1" height={64} src="/icon/24dp/company.svg" width={64} alt="" />
          <Image className="absolute bottom-1 right-0" height={40} src="/icon/24dp/search_color.svg" width={40} alt="" />
        </div>
        <div className="mt-1 flex flex-col gap-2">
          <h1 className="type-heading-7 text-grayscale-800" id="empty-company-title">우리 회사에 딱 맞는 입찰공고,<br />놓치지 않도록 챙겨드릴게요!</h1>
          <p className="type-body-3 text-grayscale-600">회사 등록부터 통합까지<br />바로 시작해보세요.</p>
        </div>
        <ButtonLink className="mt-8" href="/my/company/start" size="lg">우리 회사 등록 · 통합하기</ButtonLink>
      </div>
    </section>
  );
}

function StartChoices({ previousRequest }: { previousRequest: MembershipRequest | null }) {
  const statusText = previousRequest?.status === "REJECTED"
    ? "이전 소속 신청이 거절됐어요. 다른 회사를 선택할 수 있어요."
    : previousRequest?.status === "CANCELED"
      ? "이전 소속 신청이 취소됐어요. 다시 시작할 수 있어요."
      : null;

  return (
    <section className="mx-auto w-full max-w-[626px] flex-1 px-4 pb-24 pt-24 sm:pt-36">
      <Link className="mb-8 inline-flex items-center gap-2 type-body-3 text-grayscale-600 hover:text-grayscale-800 focus-visible:outline-2 focus-visible:outline-primary-400" href="/my/company">
        <StrokeLeftArrowIcon aria-hidden className="size-4" /> 뒤로가기
      </Link>
      <h1 className="type-heading-5 text-grayscale-800">반가워요!<br />메이트를 어떻게 시작할까요?</h1>
      {statusText && <p className="mt-4 rounded-xl bg-grayscale-50 p-4 type-body-3 text-grayscale-700" role="status">{statusText}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link className="flex min-h-[272px] flex-col items-center justify-center gap-4 rounded-3xl bg-grayscale-50 p-6 text-center transition-colors hover:bg-grayscale-100 focus-visible:outline-2 focus-visible:outline-primary-400 sm:p-8" href="/auth/company/register">
          <span className="rounded-md bg-primary-100 px-2 py-1 type-body-7 text-primary">메이트 추천</span>
          <Image alt="" height={80} src="/icon/24dp/company.svg" width={80} />
          <span className="flex flex-col gap-2">
            <strong className="type-heading-9 text-grayscale-800">우리 회사 등록하기</strong>
            <span className="type-body-3 text-grayscale-600">우리 회사를 등록하고<br />메이트 서비스를 사용해요!</span>
          </span>
        </Link>
        <Link className="flex min-h-[272px] flex-col items-center justify-center gap-4 rounded-3xl bg-grayscale-50 p-6 text-center transition-colors hover:bg-grayscale-100 focus-visible:outline-2 focus-visible:outline-primary-400 sm:p-8" href="/auth/company/search">
          <span aria-hidden className="invisible rounded-md px-2 py-1 type-body-7">메이트 추천</span>
          <Image alt="" height={80} src="/icon/24dp/search_color.svg" width={80} />
          <span className="flex flex-col gap-2">
            <strong className="type-heading-9 text-grayscale-800">기존 회사 찾기</strong>
            <span className="type-body-3 text-grayscale-600">이미 메이트에 등록된 회사를<br />찾고 통합 요청해요!</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

function VerificationBadge({ status }: { status: "LEGACY" | "UNVERIFIED" | "VERIFIED" }) {
  const label = status === "VERIFIED" ? "인증" : status === "UNVERIFIED" ? "미인증" : "기존 등록";
  return <span className={`rounded-md px-2 py-1 type-body-7 ${status === "VERIFIED" ? "bg-[#eeffeb] text-success" : "bg-grayscale-100 text-grayscale-700"}`}>{label}</span>;
}

function InfoField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="min-w-0">
      <dt className="type-body-7 text-grayscale-600">{label}</dt>
      <dd className="mt-1 break-words type-body-2 text-grayscale-800">{value === null || value === undefined || value === "" ? "정보 없음" : value}</dd>
    </div>
  );
}

function formatDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function RequestCompanyCard({ request, statusLabel }: { request: MembershipRequest; statusLabel: string }) {
  const position = request.requestedRepresentative ? "대표자로 신청" : request.requestedPositionName || request.proposedPositionName;
  return (
    <div className="rounded-2xl border border-grayscale-200 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <Image alt="" className="shrink-0" height={48} src="/icon/24dp/company.svg" width={48} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words type-heading-9 text-grayscale-800">{request.company.companyName || "회사명 정보 없음"}</h2>
              <VerificationBadge status={request.company.verificationStatus} />
            </div>
            <p className="mt-1 break-words type-body-7 text-grayscale-600">{[request.company.businessNumber, request.company.baseAddress].filter(Boolean).join(" · ") || "회사 기본 정보 없음"}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-[#fff9ef] px-2 py-1 type-body-7 text-warning">{statusLabel}</span>
      </div>
      <dl className="mt-6 grid gap-4 rounded-2xl bg-grayscale-50 p-4 sm:grid-cols-2">
        <InfoField label="신청일" value={formatDate(request.createdAt)} />
        <InfoField label="신청 직급" value={position} />
      </dl>
    </div>
  );
}

function PendingRequest({ request }: { request: MembershipRequest }) {
  return (
    <section className="mx-auto max-w-[592px] py-16 sm:py-24" aria-labelledby="pending-request-title">
      <h1 className="mb-6 type-heading-7 text-grayscale-800" id="pending-request-title">관리자가 통합 요청을<br />확인하고 있어요!</h1>
      <RequestCompanyCard request={request} statusLabel="검토 중" />
      <p className="mt-5 type-body-7 text-grayscale-600">신청 결과가 반영되면 이 화면에서 확인할 수 있어요.</p>
    </section>
  );
}

function TerminatedRequest({ request }: { request: MembershipRequest }) {
  const rejected = request.status === "REJECTED";
  return (
    <section className="mx-auto max-w-[592px] py-16 sm:py-24" aria-labelledby="terminated-request-title">
      <h1 className="mb-6 type-heading-7 text-grayscale-800" id="terminated-request-title">{rejected ? "소속 신청이 거절됐어요." : "소속 신청이 취소됐어요."}</h1>
      <RequestCompanyCard request={request} statusLabel={rejected ? "거절" : "취소"} />
      {rejected && request.rejectionReason && <p className="mt-4 rounded-2xl bg-grayscale-50 p-4 type-body-3 text-grayscale-700">거절 사유: {request.rejectionReason}</p>}
      <ButtonLink className="mt-6" href="/my/company/start" size="lg">다른 회사 선택하기</ButtonLink>
    </section>
  );
}

function ConnectedCompany({ profile }: { profile: CompanyBasicProfile }) {
  const address = [profile.address?.baseAddress, profile.address?.detailAddress].filter(Boolean).join(" ");
  return (
    <section aria-labelledby="connected-company-title" className="pt-2">
      <div className="p-2">
        <h1 className="type-heading-1 text-grayscale-900" id="connected-company-title">우리 회사 정보를 확인해 보세요!</h1>
        <p className="mt-2.5 type-heading-10 text-grayscale-600">연결된 회사의 기본 정보를 확인할 수 있어요.</p>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-5 px-2">
        <Image alt="" className="rounded-full bg-grayscale-50 p-2" height={80} src="/icon/24dp/ceo.svg" width={80} />
        <div className="min-w-0">
          <h2 className="break-words type-heading-5 text-grayscale-800">{profile.companyName || "회사명 정보 없음"}</h2>
          <div className="mt-2"><VerificationBadge status={profile.verificationStatus} /></div>
        </div>
      </div>
      <dl className="mt-6 grid gap-x-6 gap-y-6 rounded-2xl bg-basic-white p-6 sm:grid-cols-2 lg:grid-cols-3">
        <InfoField label="대표자명" value={profile.representativeName} />
        <InfoField label="사업자등록번호" value={profile.businessNumber} />
        <InfoField label="주력업종" value={profile.primaryIndustry?.name} />
        <InfoField label="주소" value={address} />
        <InfoField label="전화번호" value={profile.telephoneNumber} />
        <InfoField label="설립 연도" value={profile.establishedYear == null ? null : `${profile.establishedYear}년`} />
      </dl>
    </section>
  );
}
