import Link from "next/link";
import Image from "next/image";

import { ClipIcon, ShortcutIcon } from "@/components/icons";
import { bidDetailHref } from "@/lib/bid-detail-url";
import type {
  BidDetail,
  BidDetailPageData,
  BidParticipant,
  BidParticipantPage,
  BidPurchaseSection,
  BidResult,
  DetailSection,
} from "@/types/bid-detail";

import { BidDetailShare } from "./bid-detail-actions";
import { BidDetailAlertCard } from "./bid-detail-alert-card";
import { BidDetailAmounts } from "./bid-detail-amounts";

const numberFormatter = new Intl.NumberFormat("ko-KR");
const decimalFormatter = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 20 });
const bidTypeLabels = { construction: "공사", service: "용역", goods: "물품" } as const;
const statusLabels = { NORMAL: "", MODIFIED: "정정 공고", CANCELLED: "취소 공고", REBID: "재입찰" } as const;
const resultLabels: Record<string, string> = {
  NOT_PUBLISHED: "발표 전", OPENED: "개찰 완료", AWARD_PENDING: "낙찰자 결정 중",
  AWARDED: "낙찰 완료", UNSUCCESSFUL: "유찰", REBID: "재입찰",
};

type BidDetailContentProps = {
  readonly data: BidDetailPageData;
  readonly itemPage: number;
  readonly participantsPage: number;
};

export function BidDetailContent({ data, itemPage, participantsPage }: BidDetailContentProps) {
  const { bid } = data;
  const selectedResult = data.results.status === "ready"
    ? data.results.data.find((item) => item.id === data.selectedResultId) ?? null
    : null;

  return (
    <main className="min-h-screen bg-grayscale-50 pb-20" id="top">
      <div className="mx-auto max-w-[1112px] px-5 pb-12 pt-7 sm:px-7">
        <nav aria-label="현재 위치" className="mb-5 text-grayscale-600 type-body-7">
          <Link className="hover:text-primary-400" href="/bids">입찰공고</Link>
          <span aria-hidden className="mx-2">›</span>
          <span className="font-semibold text-grayscale-800">입찰공고 상세</span>
        </nav>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-4">
            <section className="rounded-xl bg-white p-5 shadow-[0_0_12px_var(--grayscale-100)] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-primary-400 type-body-7">{bid.noticeNumber}{bid.classificationNo ? ` · 분류 ${bid.classificationNo}` : ""}</p>
                  <h1 className="mt-1 break-keep font-bold text-grayscale-900 type-heading-9">{bid.title}</h1>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {bid.sourceUrl ? (
                    <a aria-label="나라장터 공고 열기" className="rounded-md p-2 text-grayscale-600 hover:bg-grayscale-100 hover:text-primary-400" href={bid.sourceUrl} rel="noopener noreferrer" target="_blank">
                      <ShortcutIcon aria-hidden className="size-5" focusable="false" />
                    </a>
                  ) : null}
                  <BidDetailShare />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded bg-primary-100 px-2 py-1 font-semibold text-primary-500 type-body-7">{bidTypeLabels[bid.bidType]}</span>
                {bid.status !== "NORMAL" ? (
                  <span className={`rounded bg-grayscale-100 px-2 py-1 font-semibold type-body-7 ${bid.status === "CANCELLED" ? "text-grayscale-700" : "text-warning"}`}>
                    {statusLabels[bid.status]}
                  </span>
                ) : null}
              </div>
            </section>

            {bid.classifications.length > 1 ? (
              <section aria-label="입찰분류 선택" className="rounded-xl bg-white p-4 shadow-[0_0_12px_var(--grayscale-100)]">
                <h2 className="font-semibold text-grayscale-800 type-body-6">입찰분류</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ClassLink active={bid.classificationNo === null} href={bidDetailHref(bid.id, null)} label="공고 전체" />
                  {bid.classifications.map((classificationNo) => (
                    <ClassLink active={bid.classificationNo === classificationNo} href={bidDetailHref(bid.id, classificationNo)} key={classificationNo} label={`분류 ${classificationNo}`} />
                  ))}
                </div>
              </section>
            ) : null}

            {bid.status === "MODIFIED" || bid.status === "CANCELLED" || bid.status === "REBID" ? (
              <section className="rounded-xl bg-white p-5 shadow-[0_0_12px_var(--grayscale-100)]">
                <h2 className="font-bold text-grayscale-800 type-body-6">{statusLabels[bid.status]}</h2>
                {bid.changedAt || bid.changeReason ? (
                  <p className="mt-2 text-grayscale-700 type-body-7">
                    {[bid.changedAt, bid.changeReason].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </section>
            ) : null}

            {data.results.status === "ready" && data.results.data.length > 0 ? (
              <ResultCard bid={bid} itemPage={itemPage} participants={data.participants} participantsPage={participantsPage} podium={data.podium} results={data.results.data} selectedResult={selectedResult} />
            ) : data.results.status === "error" ? (
              <SectionCard title="개찰결과"><SectionError /></SectionCard>
            ) : null}

            <SectionCard title="기본정보">
              <InfoGrid>
                <InfoItem label="공고일" value={bid.schedule.publishedAt} />
                <InfoItem label="입찰마감" value={bid.schedule.bidCloseAt} />
                <InfoItem label="참가자격 등록마감" value={bid.schedule.qualificationDeadlineAt} />
                <InfoItem label="개찰일시" value={bid.schedule.openAt} />
                <InfoItem label="입찰개시" value={bid.schedule.bidBeginAt} />
              </InfoGrid>
              <div className="mt-5 rounded-md bg-grayscale-50 px-4 py-3 text-grayscale-700 type-body-7">
                <Image alt="" className="mr-1 inline-block align-middle" height={16} src="/icon/24dp/company.svg" width={16} /> {bid.agencies.demandName ? `수요기관 · ${bid.agencies.demandName}` : bid.agencies.noticeName ? `공고기관 · ${bid.agencies.noticeName}` : "기관 정보 없음"}
              </div>
            </SectionCard>

            <BidDetailAmounts amount={bid.amount} />

            <SectionCard title="예가정보">
              <InfoGrid>
                <InfoItem label="낙찰하한율" value={formatPercent(bid.amount.lowerBoundRate)} />
                <InfoItem label="예정가격 결정방법" value={bid.amount.priceDecisionMethod} />
                {bid.bidType === "construction" ? <InfoItem label="순공사비" value={formatWon(bid.amount.pureConstructionCost)} /> : null}
                <InfoItem label="사업금액" value={formatWon(bid.amount.projectAmount)} />
              </InfoGrid>
            </SectionCard>

            {data.purchases ? (
              <PurchaseCard bid={bid} itemPage={itemPage} participantsPage={participantsPage} resultId={data.selectedResultId} section={data.purchases} />
            ) : null}

            <SectionCard title="입찰조건 및 자격">
              <InfoGrid>
                <InfoItem label="업종제한" value={restrictionStatusLabel(bid.eligibility.industryState)} />
                <InfoItem label="업종" value={restrictionText(bid.eligibility.industries, bid.eligibility.industryState)} />
                <InfoItem label="지역제한" value={restrictionStatusLabel(bid.eligibility.regionState)} />
                <InfoItem label="지역" value={restrictionText(bid.eligibility.regions, bid.eligibility.regionState)} />
                <InfoItem label="입찰방식" value={bid.procedure.bidMethod} />
                <InfoItem label="계약방법" value={bid.procedure.contractMethod} />
                <InfoItem label="낙찰방법" value={bid.procedure.awardMethod} />
                <InfoItem label="공동수급" value={bid.jointSupply.method} />
                <InfoItem label="공동수급 협정 마감" value={bid.jointSupply.deadlineAt} />
                <InfoItem label="PQ 심사" value={bid.eligibility.pqRequired ? "필요" : "해당 없음"} />
                <InfoItem label="현장설명" value={bid.eligibility.siteExplanationRequired ? "필요" : "해당 없음"} />
                <InfoItem label="내역입찰" value={bid.eligibility.detailedBid ? "해당" : "해당 없음"} />
                <InfoItem label="실적경쟁" value={booleanLabel(bid.eligibility.performanceCompetition)} />
                <InfoItem label="상호시장진출" value={booleanLabel(bid.eligibility.mutualMarketEntry)} />
              </InfoGrid>
            </SectionCard>

            <SectionCard title="기관 정보">
              <InfoGrid>
                <InfoItem label="수요기관" value={bid.agencies.demandName} />
                <InfoItem label="수요기관 담당자 이메일" value={bid.agencies.demandOfficerEmail} />
                <InfoItem label="공고기관" value={bid.agencies.noticeName} />
                <InfoItem label="공고기관 담당자" value={bid.agencies.noticeOfficerName} />
                <InfoItem label="공고기관 연락처" value={bid.agencies.noticeOfficerPhone} />
                <InfoItem label="공고기관 담당자 이메일" value={bid.agencies.noticeOfficerEmail} />
                <InfoItem label="발주기관 소재지" value={bid.agencies.orderingRegionName} />
              </InfoGrid>
            </SectionCard>

            <SectionCard title={`첨부파일${data.attachments.status === "ready" ? ` ${data.attachments.data.length}` : ""}`}>
              {data.attachments.status === "error" ? <SectionError /> : data.attachments.data.length === 0 ? (
                <EmptySection>첨부파일이 없습니다.</EmptySection>
              ) : (
                <ul className="divide-y divide-grayscale-100">
                  {data.attachments.data.map((file) => (
                    <li className="flex flex-wrap items-center gap-3 py-3" key={file.id}>
                      <ClipIcon aria-hidden className="size-4 shrink-0 text-grayscale-500" focusable="false" />
                      <span className="min-w-0 flex-1 break-all text-grayscale-700 type-body-7">{file.name}</span>
                      {file.previewUrl ? <a className="rounded border border-grayscale-200 px-2 py-1 text-grayscale-700 type-body-7 hover:text-primary-400" href={file.previewUrl} rel="noopener noreferrer" target="_blank">미리보기</a> : null}
                      <a className="rounded border border-grayscale-200 px-2 py-1 text-grayscale-700 type-body-7 hover:text-primary-400" href={file.downloadUrl} rel="noopener noreferrer" target="_blank">다운로드</a>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard title={bid.bidType === "goods" ? "같은 품목 최근공고" : "같은 업종 최근공고"}>
              {data.related.status === "error" ? <SectionError /> : data.related.data.length === 0 ? (
                <EmptySection>표시할 관련 공고가 없습니다.</EmptySection>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {data.related.data.map((item) => (
                    <Link className="rounded-lg bg-grayscale-50 p-4 hover:bg-primary-100" href={bidDetailHref(item.id, item.classificationNo)} key={`${item.id}:${item.classificationNo ?? ""}`}>
                      <span className="text-primary-400 type-body-7">{bidTypeLabels[item.bidType]}</span>
                      <p className="mt-2 line-clamp-2 font-semibold text-grayscale-800 type-body-7">{item.title}</p>
                      <p className="mt-3 text-grayscale-600 type-caption">{item.region ?? "지역 정보 없음"}</p>
                      <p className="mt-1 text-grayscale-600 type-caption">{item.publishedAt ?? "공고일 미제공"}</p>
                      <p className="mt-2 font-semibold text-grayscale-800 type-body-7">{formatWon(item.projectAmount) ?? "금액 미제공"}</p>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="데이터 수집안내">
              <p className="text-grayscale-600 type-body-7">공고 정보는 나라장터에서 제공한 자료를 기준으로 표시합니다. 제공되지 않았거나 수집 중인 항목은 정보 없음 또는 확인 중으로 표시됩니다.</p>
              {bid.referenceNumber ? <p className="mt-3 text-grayscale-700 type-body-7">참조번호 {bid.referenceNumber}</p> : null}
              {bid.sourceUrl ? <a className="mt-3 inline-block font-semibold text-primary-400 type-body-7 hover:underline" href={bid.sourceUrl} rel="noopener noreferrer" target="_blank">나라장터 원문 보기 ↗</a> : null}
            </SectionCard>
          </div>

          <BidDetailAlertCard bidId={bid.id} closeAt={bid.schedule.bidCloseAt} />
        </div>
      </div>
      <a className="fixed bottom-5 right-5 flex size-12 items-center justify-center rounded-full bg-grayscale-800 text-white shadow-lg hover:bg-grayscale-700" href="#top" aria-label="맨 위로">↑</a>
    </main>
  );
}

function ClassLink({ active, href, label }: { readonly active: boolean; readonly href: string; readonly label: string }) {
  return <Link aria-current={active ? "page" : undefined} className={`rounded-md px-3 py-2 type-body-7 ${active ? "bg-primary-400 font-semibold text-white" : "bg-grayscale-50 text-grayscale-700 hover:bg-primary-100"}`} href={href}>{label}</Link>;
}

function SectionCard({ children, title }: { readonly children: React.ReactNode; readonly title: string }) {
  return <section className="rounded-xl bg-white p-5 shadow-[0_0_12px_var(--grayscale-100)] sm:p-6"><h2 className="mb-6 font-bold text-grayscale-800 type-heading-9">{title}</h2>{children}</section>;
}

function InfoGrid({ children }: { readonly children: React.ReactNode }) {
  return <dl className="grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">{children}</dl>;
}

function InfoItem({ label, value }: { readonly label: string; readonly value: string | null }) {
  return <div className="min-w-0"><dt className="text-grayscale-600 type-body-7">{label}</dt><dd className="mt-1 break-words font-semibold text-grayscale-800 type-body-7">{value ?? "—"}</dd></div>;
}

function EmptySection({ children }: { readonly children: React.ReactNode }) {
  return <p className="rounded-md bg-grayscale-50 p-4 text-grayscale-600 type-body-7">{children}</p>;
}

function SectionError() {
  return <EmptySection>정보를 불러오지 못했습니다. 페이지를 새로고침해 다시 시도해 주세요.</EmptySection>;
}

function PurchaseCard({ bid, itemPage, participantsPage, resultId, section }: {
  readonly bid: BidDetail;
  readonly itemPage: number;
  readonly participantsPage: number;
  readonly resultId: string | null;
  readonly section: DetailSection<BidPurchaseSection>;
}) {
  if (section.status === "error") return <SectionCard title="품목정보"><SectionError /></SectionCard>;
  const purchase = section.data;
  return (
    <SectionCard title="품목정보">
      <div className="grid gap-3 rounded-md bg-grayscale-50 p-4 sm:grid-cols-2">
        <InfoItem label="품목합계(수량×단가)" value={formatWon(purchase.totalAmount)} />
        <InfoItem label="품목수" value={`${numberFormatter.format(purchase.itemCount)}건`} />
        <InfoItem label="수량합계" value={purchase.totalQuantity == null ? null : decimalFormatter.format(purchase.totalQuantity)} />
        <InfoItem label="단가(최소~최대)" value={purchase.minUnitPrice == null && purchase.maxUnitPrice == null ? null : `${formatWon(purchase.minUnitPrice) ?? "—"} ~ ${formatWon(purchase.maxUnitPrice) ?? "—"}`} />
      </div>
      {purchase.items.length === 0 ? <EmptySection>{purchase.itemCount > 0 ? "요청한 페이지에 품목이 없습니다." : "등록된 품목 정보가 없습니다."}</EmptySection> : (
        <ul className="mt-4 divide-y divide-grayscale-100">
          {purchase.items.map((item) => (
            <li className="grid gap-2 py-3 text-grayscale-700 type-body-7 sm:grid-cols-[minmax(0,1fr)_auto]" key={item.key}>
              <div><p className="font-semibold text-grayscale-800">{item.name ?? "품목명 미제공"}</p><p className="mt-1">{item.specification ?? "규격 미제공"}</p></div>
              <div className="sm:text-right"><p>수량 {item.quantity == null ? "—" : `${decimalFormatter.format(item.quantity)}${item.unit ?? ""}`}</p><p>단가 {formatWon(item.unitPrice) ?? "—"}</p></div>
            </li>
          ))}
        </ul>
      )}
      {purchase.totalPages > 1 || itemPage > 1 ? <PageLinks bid={bid} current={itemPage} itemPage={itemPage} keyName="itemPage" participantsPage={participantsPage} resultId={resultId} total={purchase.totalPages} /> : null}
    </SectionCard>
  );
}

function ResultCard({ bid, itemPage, participants, participantsPage, podium: podiumSection, results, selectedResult }: {
  readonly bid: BidDetail;
  readonly itemPage: number;
  readonly participants: DetailSection<BidParticipantPage> | null;
  readonly participantsPage: number;
  readonly podium: DetailSection<readonly BidParticipant[]> | null;
  readonly results: readonly BidResult[];
  readonly selectedResult: BidResult | null;
}) {
  const podium = podiumSection?.status === "ready"
    ? ["2", "1", "3"].map((rank) => podiumSection.data.find((item) => item.rank === rank)).filter((item) => item !== undefined)
    : [];
  return (
    <SectionCard title="낙찰결과">
      <div className="mb-5 flex flex-wrap gap-2">
        {results.map((result) => (
          <Link
            aria-current={result.id === selectedResult?.id ? "page" : undefined}
            className={`rounded-md px-3 py-2 type-body-7 ${result.id === selectedResult?.id ? "bg-primary-400 font-semibold text-white" : "bg-grayscale-50 text-grayscale-700"}`}
            href={detailQueryHref(bid, { itemPage, resultId: result.id })}
            key={result.id}
          >
            {bid.bidType !== "construction" && result.classificationNo ? `분류 ${result.classificationNo} · ` : ""}회차 {result.round}
          </Link>
        ))}
      </div>
      {selectedResult ? (
        <>
          {podium.length > 0 ? (
            <div className="mb-5 grid gap-2 sm:grid-cols-3">
              {podium.map((item) => (
                <div className="rounded-lg bg-grayscale-50 p-4 text-center" key={item.rank}>
                  <Image alt="" className="mx-auto" height={24} src={`/icon/24dp/${item.rank === "1" ? "gold" : item.rank === "2" ? "silver" : "bronze"}_trophy.svg`} width={24} />
                  <p className="mt-2 font-bold text-grayscale-800 type-body-6">{item.rank}위</p>
                  <p className="mt-1 break-keep text-grayscale-700 type-body-7">{item.companyName ?? "업체명 미제공"}</p>
                  <p className="mt-2 font-semibold text-primary-400 type-body-7">{formatWon(item.bidAmount) ?? "금액 미제공"}</p>
                </div>
              ))}
            </div>
          ) : null}
          <InfoGrid>
            <InfoItem label="결과" value={resultLabels[selectedResult.status] ?? "결과 확인 중"} />
            <InfoItem label="개찰일" value={selectedResult.openedAt ?? selectedResult.plannedOpenAt} />
            <InfoItem label="낙찰업체" value={selectedResult.winnerName} />
            <InfoItem label="낙찰금액" value={formatWon(selectedResult.winningAmount)} />
            <InfoItem label="낙찰률" value={formatPercent(selectedResult.winningRate)} />
            <InfoItem label="개찰 1순위" value={selectedResult.openingFirstPlaceName} />
            <InfoItem label="1순위 투찰금액" value={formatWon(selectedResult.openingFirstPlaceAmount)} />
            <InfoItem label="1순위 투찰률" value={formatPercent(selectedResult.openingFirstPlaceRate)} />
            <InfoItem label="참여업체" value={selectedResult.participantCount == null ? null : `${numberFormatter.format(selectedResult.participantCount)}개`} />
          </InfoGrid>
          {selectedResult.failingReason || selectedResult.rebidReason || selectedResult.openingMessage ? (
            <p className="mt-5 rounded-md bg-grayscale-50 p-4 text-grayscale-700 type-body-7">{selectedResult.failingReason ?? selectedResult.rebidReason ?? selectedResult.openingMessage}</p>
          ) : null}
          <div className="mt-6 border-t border-grayscale-100 pt-5">
            <h3 className="font-semibold text-grayscale-800 type-body-6">참여업체</h3>
            {participants?.status === "error" ? <div className="mt-3"><SectionError /></div> : participants?.status === "ready" ? (
              <>
                {participants.data.items.length > 0 ? <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left type-body-7">
                    <thead className="border-b border-grayscale-200 text-grayscale-600"><tr><th className="py-2">순위</th><th>업체</th><th>투찰금액</th><th>투찰률</th><th>투찰일</th></tr></thead>
                    <tbody className="text-grayscale-800">{participants.data.items.map((item, index) => <tr className="border-b border-grayscale-100" key={`${item.rank ?? index}:${item.companyName ?? ""}`}><td className="py-3">{item.rank ?? "—"}</td><td>{item.companyName ?? "—"}</td><td>{formatWon(item.bidAmount) ?? "—"}</td><td>{formatPercent(item.bidRate) ?? "—"}</td><td>{item.bidAt ?? "—"}</td></tr>)}</tbody>
                  </table>
                </div> : <div className="mt-3"><EmptySection>{participants.data.totalCount > 0 ? "요청한 페이지에 참여업체가 없습니다." : "공개된 참여업체 정보가 없습니다."}</EmptySection></div>}
                {participants.data.totalPages > 1 || participantsPage > 1 ? <PageLinks bid={bid} current={participantsPage} itemPage={itemPage} keyName="participantsPage" participantsPage={participantsPage} resultId={selectedResult.id} total={participants.data.totalPages} /> : null}
              </>
            ) : <div className="mt-3"><EmptySection>공개된 참여업체 정보가 없습니다.</EmptySection></div>}
          </div>
        </>
      ) : null}
    </SectionCard>
  );
}

function PageLinks({ bid, current, itemPage, keyName, participantsPage, resultId, total }: {
  readonly bid: BidDetail;
  readonly current: number;
  readonly itemPage: number;
  readonly keyName: "itemPage" | "participantsPage";
  readonly participantsPage: number;
  readonly resultId: string | null;
  readonly total: number;
}) {
  if (current > total) {
    return <nav aria-label="섹션 페이지" className="mt-5 flex items-center justify-center gap-3 text-grayscale-700 type-body-7">
      <span>요청한 페이지가 없습니다.</span>
      <Link className="rounded border border-grayscale-200 px-3 py-1 hover:text-primary-400" href={detailQueryHref(bid, { itemPage, participantsPage, [keyName]: 1, resultId: resultId ?? undefined })}>첫 페이지</Link>
    </nav>;
  }
  return <nav aria-label="섹션 페이지" className="mt-5 flex items-center justify-center gap-3 text-grayscale-700 type-body-7">
    {current > 1 ? <Link className="rounded border border-grayscale-200 px-3 py-1 hover:text-primary-400" href={detailQueryHref(bid, { itemPage, participantsPage, [keyName]: current - 1, resultId: resultId ?? undefined })}>이전</Link> : null}
    <span>{current} / {total}</span>
    {current < total ? <Link className="rounded border border-grayscale-200 px-3 py-1 hover:text-primary-400" href={detailQueryHref(bid, { itemPage, participantsPage, [keyName]: current + 1, resultId: resultId ?? undefined })}>다음</Link> : null}
  </nav>;
}

function detailQueryHref(bid: BidDetail, options: { itemPage?: number; participantsPage?: number; resultId?: string }): string {
  const params = new URLSearchParams();
  if (bid.classificationNo) params.set("bidClsfcNo", bid.classificationNo);
  if (options.itemPage && options.itemPage > 1) params.set("itemPage", String(options.itemPage));
  if (options.resultId) params.set("resultId", options.resultId);
  if (options.participantsPage && options.participantsPage > 1) params.set("participantsPage", String(options.participantsPage));
  const query = params.toString();
  return `/bids/${bid.id}${query ? `?${query}` : ""}`;
}

function restrictionText(values: readonly string[], state: BidDetail["eligibility"]["industryState"]): string {
  if (state === "known") return values.length ? values.join(", ") : "정보 확인 중";
  if (state === "unrestricted") return "제한 없음";
  if (state === "failed") return "정보를 확인하지 못했습니다";
  return "확인 중";
}

function restrictionStatusLabel(state: BidDetail["eligibility"]["industryState"]): string {
  if (state === "known") return "제한 있음";
  if (state === "unrestricted") return "제한 없음";
  if (state === "failed") return "정보를 확인하지 못했습니다";
  return "확인 중";
}

function formatWon(value: number | null): string | null {
  return value == null ? null : `${decimalFormatter.format(value)}원`;
}

function formatPercent(value: number | null): string | null {
  return value == null ? null : `${decimalFormatter.format(value)}%`;
}

function booleanLabel(value: boolean | null): string | null {
  return value == null ? null : value ? "해당" : "해당 없음";
}
