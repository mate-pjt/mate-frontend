import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeAuthCta } from "@/components/home/home-auth-cta";
import { RightArrowIcon, UpArrowIcon } from "@/components/icons";
import { BidCard, type BidCardCategoryTone } from "@/components/ui/card";
import { getHomeBids } from "@/data/bids/server";
import { bidDetailHref } from "@/lib/bid-detail-url";
import { createPublicPageMetadata } from "@/lib/metadata";
import type { BidKind } from "@/types/bid";

export const metadata: Metadata = createPublicPageMetadata({
  title: "새로운 입찰의 시작",
  description:
    "Mate가 회사에 맞는 입찰공고를 찾아 분석하고 실시간 알림으로 알려드립니다.",
  path: "/",
});

export const dynamic = "force-dynamic";

const categoryLabels: Record<BidKind, string> = {
  construction: "공사",
  service: "용역",
  purchase: "물품",
};

const categoryTones: Record<BidKind, BidCardCategoryTone> = {
  construction: "primary",
  service: "success",
  purchase: "warning",
};

export default async function HomePage() {
  const homeBids = await getHomeBids().catch(() => null);

  return (
    <div id="home-top">
      <section className="relative flex min-h-[1024px] flex-col items-center overflow-hidden px-4 pt-24 text-center sm:px-6">
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="type-heading-0 max-w-[520px] text-grayscale-900">
            새로운 입찰의 시작,
            <br />
            메이트와 함께 나에게 딱 맞는
            <br />
            공고를 찾아볼까요?
          </h1>
          <p className="type-heading-6 mt-4 text-grayscale-600">
            나에게 딱 맞는 공고들만 골라서 가장 먼저 보여드릴게요.
          </p>
          <div className="mt-12">
            <HomeAuthCta />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto h-[760px] max-w-[1180px] rounded-t-full [background:radial-gradient(circle_at_center,var(--primary-200)_0%,var(--primary-100)_42%,transparent_72%)]" />
        <Image
          alt="입찰공고를 탐색하는 메이트 사용자 일러스트"
          className="relative z-10 mt-auto h-auto w-full max-w-[830px]"
          height={539}
          priority
          src="/images/home/hero-illustration.svg"
          width={830}
        />
      </section>

      <section className="flex min-h-[335px] items-center justify-center bg-grayscale-900 px-6 py-20 text-center">
        <h2 className="type-heading-1 text-basic-white">
          새로운 입찰의 시작!
          <br />
          가장 쉽고 복잡한 탐색없이,
          <br />
          나에게 딱 맞는 입찰공고를 찾아드릴게요!
        </h2>
      </section>

      <section className="bg-grayscale-50 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="type-body-7 text-primary-400">실시간 나라장터</p>
              <h2 className="type-heading-7 mt-1 text-grayscale-800">
                전체 입찰공고
              </h2>
            </div>
            <Link
              className="type-body-7 inline-flex items-center gap-1 text-grayscale-600 hover:text-grayscale-800"
              href="/bids"
            >
              전체 입찰공고 보러가기
              <RightArrowIcon aria-hidden className="size-4" />
            </Link>
          </div>

          {homeBids === null ? (
            <div className="rounded-[20px] bg-basic-white px-6 py-14 text-center" role="alert">
              <p className="type-body-1 text-grayscale-800">입찰공고를 불러오지 못했어요.</p>
              <p className="type-body-7 mt-2 text-grayscale-600">잠시 후 다시 시도해 주세요.</p>
              <form action="/" className="mt-6" method="get">
                <button className="type-body-7 rounded-lg bg-primary-400 px-5 py-3 text-basic-white hover:bg-primary-500" type="submit">
                  다시 시도
                </button>
              </form>
            </div>
          ) : homeBids.length === 0 ? (
            <div className="rounded-[20px] bg-basic-white px-6 py-14 text-center" role="status">
              <p className="type-body-1 text-grayscale-800">현재 표시할 입찰공고가 없어요.</p>
              <p className="type-body-7 mt-2 text-grayscale-600">새 공고가 등록되면 이곳에서 확인할 수 있어요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {homeBids.map((bid) => (
                <Link href={bidDetailHref(bid.id, bid.classificationNo)} key={`${bid.id}:${bid.classificationNo ?? ""}`}>
                  <BidCard
                    category={categoryLabels[bid.kind]}
                    categoryTone={categoryTones[bid.kind]}
                    className="h-full max-w-none"
                    closesAt={bid.closesAt ?? "—"}
                    contractMethod={bid.contractMethod ?? "—"}
                    estimatedPrice={bid.estimatedPrice == null ? "—" : bid.estimatedPrice.toLocaleString("ko-KR")}
                    estimatedPriceUnit={bid.estimatedPrice == null ? "" : "원"}
                    noticeNumber={
                      <span className="inline-flex flex-col items-end">
                        {bid.noticeNumber}
                        {bid.classificationNo ? (
                          <span className="mt-1 rounded bg-primary-100 px-1.5 py-0.5 type-body-7 no-underline">
                            분류 {bid.classificationNo}
                          </span>
                        ) : null}
                      </span>
                    }
                    organization={bid.demandAgencyName ? `수요기관 · ${bid.demandAgencyName}` : bid.noticeAgencyName ? `공고기관 · ${bid.noticeAgencyName}` : "—"}
                    publishedAt={bid.publishedAt ?? "—"}
                    title={bid.title}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-24">
          <div className="flex flex-col items-center justify-center gap-12 lg:flex-row">
            <Image
              alt="회사 정보와 입찰공고를 연결하는 매칭 과정"
              className="h-auto w-full max-w-[340px]"
              height={280}
              src="/images/home/matching-illustration.svg"
              width={340}
            />
            <ServiceDescription
              description={
                <>
                  회사 정보를 메이트에게 알려주세요!
                  <br />
                  사장님에게 딱 맞는 공고만 먼저 보여드려요.
                </>
              }
              number="1"
              title={
                <>
                  메이트가 나와 딱 맞는
                  <br />
                  공고를 매칭해드릴게요!
                </>
              }
            />
          </div>

          <div className="flex flex-col-reverse items-center justify-center gap-12 lg:flex-row">
            <ServiceDescription
              description={
                <>
                  아차 하는 순간 마감되는 입찰공고,
                  <br />
                  이제 걱정 마세요. 메이트가 알려드릴게요!
                </>
              }
              number="2"
              title={
                <>
                  입찰공고 놓치지 않게
                  <br />
                  메이트가 알려드릴게요!
                </>
              }
            />
            <Image
              alt="입찰공고 마감 알림 일러스트"
              className="h-auto w-full max-w-[340px]"
              height={280}
              src="/images/home/alarm-illustration.svg"
              width={340}
            />
          </div>
        </div>
      </section>

      <section className="flex min-h-[704px] items-center justify-center bg-primary-100 px-6 py-24 text-center [background:radial-gradient(circle_at_top,var(--primary-200),var(--primary-100)_45%,var(--basic-white)_100%)]">
        <div className="flex flex-col items-center">
          <Image
            alt="빛나는 메이트 심볼"
            height={180}
            src="/images/home/cta-crystal.png"
            width={224}
            unoptimized={true}
          />
          <h2 className="type-heading-0 mt-8 text-grayscale-900">
            이제 혼자 고민하지 마세요.
            <br />
            입찰, 메이트가 함께할게요!
          </h2>
          <p className="type-heading-6 mt-4 text-grayscale-600">
            나에게 딱 맞는 공고 분석부터
            <br />
            실시간 알림까지 다 챙겨드릴게요.
          </p>
          <div className="mt-12">
            <HomeAuthCta />
          </div>
        </div>
      </section>

      <footer className="h-[500px] bg-grayscale-900" />

      <a
        aria-label="페이지 상단으로 이동"
        className="fixed bottom-12 right-6 z-20 inline-flex size-16 items-center justify-center rounded-full bg-grayscale-800 text-basic-white hover:bg-grayscale-700 sm:right-12"
        href="#home-top"
      >
        <UpArrowIcon className="size-6" />
      </a>
    </div>
  );
}

type ServiceDescriptionProps = {
  readonly description: React.ReactNode;
  readonly number: string;
  readonly title: React.ReactNode;
};

function ServiceDescription({
  description,
  number,
  title,
}: ServiceDescriptionProps) {
  return (
    <div className="w-full max-w-[360px]">
      <span className="type-heading-10 inline-flex size-9 items-center justify-center rounded-lg bg-primary-400 text-basic-white">
        {number}
      </span>
      <h3 className="type-heading-1 mt-6 text-grayscale-800">{title}</h3>
      <p className="type-heading-8 mt-4 text-grayscale-600">{description}</p>
    </div>
  );
}
