import type {
  BidAttachment,
  BidDetail,
  BidParticipantPage,
  BidPurchaseSection,
  BidResult,
  RelatedBid,
} from "@/types/bid-detail";

import type {
  BidNoticeAttachmentListDto,
  BidNoticeDetailDto,
  BidNoticePurchaseItemDto,
  BidNoticeResultsDto,
  BidParticipantPageDto,
  RelatedBidNoticeDto,
} from "./detail-api-types";

const kstDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const contractLabels = {
  GENERAL: "일반경쟁",
  LIMITED: "제한경쟁",
  NOMINATION: "지명경쟁",
  PRIVATE: "수의계약",
} as const;

const bidTypeValues = { CONSTRUCTION: "construction", SERVICE: "service", GOODS: "goods" } as const;

export function mapBidDetail(data: BidNoticeDetailDto): BidDetail {
  if (!validId(data?.id) || !data.sourceKey?.bidNtceNo || !data.header?.noticeName || !data.classificationContext) {
    throw new Error("입찰공고 상세 응답 형식이 올바르지 않습니다.");
  }

  const regionState = mapRestrictionState(data.eligibility.participationRegionStatus);
  const industryState = mapRestrictionState(data.eligibility.licenseLimitStatus);

  return {
    id: String(data.id),
    classificationNo: data.classificationContext.selectedBidClsfcNo,
    classifications: data.classificationContext.classifications.map((item) => item.bidClsfcNo),
    noticeNumber: data.sourceKey.bidNtceOrd
      ? `${data.sourceKey.bidNtceNo}-${data.sourceKey.bidNtceOrd}`
      : data.sourceKey.bidNtceNo,
    title: data.header.noticeName,
    referenceNumber: clean(data.header.referenceNumber),
    bidType: bidTypeValues[data.header.bidType],
    status: data.header.status,
    changedAt: formatKst(data.header.noticeChangedAt),
    changeReason: clean(data.header.changeReason),
    sourceUrl: safeHttpUrl(data.header.noticeUrl),
    amount: {
      basePrice: safeAmount(data.amount.basePrice),
      estimatedPrice: safeAmount(data.amount.estimatedPrice),
      budget: safeAmount(data.amount.budgetAmount),
      projectAmount: safeAmount(data.amount.projectAmount),
      lowerBoundRate: finiteOrNull(data.amount.lowerBoundRate),
      priceDecisionMethod: clean(data.amount.priceDecisionMethod),
      pureConstructionCost: safeAmount(data.amount.pureConstructionCost),
    },
    schedule: {
      publishedAt: formatKst(data.schedule.noticePublishedAt),
      qualificationDeadlineAt: formatKst(data.schedule.bidQualificationRegistrationDeadlineAt),
      bidBeginAt: formatKst(data.schedule.bidBeginAt),
      bidCloseAt: formatKst(data.schedule.bidCloseAt),
      openAt: formatKst(data.schedule.openAt),
    },
    procedure: {
      bidMethod: clean(data.procedure.bidMethod),
      contractMethod: data.procedure.contractMethod ? contractLabels[data.procedure.contractMethod] ?? null : null,
      awardMethod: clean(data.procedure.successfulBidMethodStandard) ?? clean(data.procedure.successfulBidMethod),
      internationalBid: metadataValue(data.procedure.internationalBid),
      rebidAllowed: metadataValue(data.procedure.rebidAllowed),
    },
    agencies: {
      noticeName: clean(data.agencies.noticeAgency.name),
      demandName: clean(data.agencies.demandAgency.name),
      orderingRegionName: clean(data.agencies.orderingRegionName),
      noticeOfficerName: clean(data.agencies.noticeAgency.officerName),
      noticeOfficerPhone: clean(data.agencies.noticeAgency.officerPhone),
      noticeOfficerEmail: clean(data.agencies.noticeAgency.officerEmail),
      demandOfficerEmail: clean(data.agencies.demandAgency.officerEmail),
    },
    eligibility: {
      industries: industryState === "known" ? data.eligibility.industries.map((item) => item.name) : [],
      industryState,
      regions: regionState === "known" ? data.eligibility.participationRegions.map((item) => item.name) : [],
      regionState,
      siteExplanationRequired: data.eligibility.isSiteExplanationRequired,
      pqRequired: data.eligibility.isPqRequired,
      detailedBid: data.eligibility.isDetailedBid,
      performanceCompetition: metadataValue(data.eligibility.performanceCompetition),
      mutualMarketEntry: metadataValue(data.eligibility.mutualMarketEntry),
    },
    jointSupply: {
      method: clean(data.jointSupply.methodName),
      receiptMethod: clean(data.jointSupply.agreementReceiptMethod),
      deadlineAt: formatKst(data.jointSupply.agreementDeadlineAt),
    },
  };
}

export function mapAttachments(data: BidNoticeAttachmentListDto, apiBaseUrl: string): readonly BidAttachment[] {
  if (!Array.isArray(data.attachments)) throw new Error("첨부파일 응답 형식이 올바르지 않습니다.");
  return [...data.attachments]
    .sort((a, b) => a.fileOrder - b.fileOrder)
    .map((item) => {
      if (!validId(item.attachmentId) || !item.fileName) throw new Error("첨부파일 항목이 올바르지 않습니다.");
      const base = `${apiBaseUrl}/api/v1/bid-notices/${data.bidNoticeId}/attachments/${item.attachmentId}/content`;
      const previewable = item.previewType === "PDF" || item.previewType === "IMAGE";
      return {
        id: String(item.attachmentId),
        name: item.fileName,
        previewable,
        previewUrl: previewable ? `${base}?disposition=inline` : null,
        downloadUrl: `${base}?disposition=attachment`,
      };
    });
}

export function mapRelated(data: RelatedBidNoticeDto): readonly RelatedBid[] {
  if (!Array.isArray(data.items)) throw new Error("관련 공고 응답 형식이 올바르지 않습니다.");
  return data.items.map((item: RelatedBidNoticeDto["items"][number]) => {
    if (!validId(item.bidNoticeId) || !item.noticeName) throw new Error("관련 공고 항목이 올바르지 않습니다.");
    return {
      id: String(item.bidNoticeId),
      classificationNo: item.bidClsfcNo,
      title: item.noticeName,
      bidType: bidTypeValues[item.bidType],
      region: clean(item.participationRegionDisplayName),
      publishedAt: formatKst(item.noticePublishedAt, false),
      projectAmount: safeAmount(item.projectAmount),
    };
  });
}

export function mapPurchases(data: BidNoticePurchaseItemDto): BidPurchaseSection {
  if (!Array.isArray(data.items) || !Number.isSafeInteger(data.summary?.itemCount)) {
    throw new Error("등록 품목 응답 형식이 올바르지 않습니다.");
  }
  return {
    itemCount: data.summary.itemCount,
    totalQuantity: safeDecimal(data.summary.totalQuantity),
    totalAmount: safeDecimal(data.summary.totalAmount),
    minUnitPrice: safeDecimal(data.summary.minUnitPrice),
    maxUnitPrice: safeDecimal(data.summary.maxUnitPrice),
    items: data.items.map((item) => ({
      key: `${item.bidClsfcNo}:${item.productSequenceNo}`,
      name: clean(item.detailedItemName) ?? clean(item.itemClassificationName),
      specification: clean(item.specification),
      quantity: safeDecimal(item.quantity),
      unit: clean(item.unit),
      unitPrice: safeDecimal(item.unitPrice),
      deliveryDeadline: clean(item.deliveryDeadline),
      deliveryPlace: clean(item.deliveryPlace),
    })),
    page: data.page + 1,
    totalPages: data.totalPages,
  };
}

export function mapResults(data: BidNoticeResultsDto): readonly BidResult[] {
  if (!Array.isArray(data.results)) throw new Error("개찰결과 응답 형식이 올바르지 않습니다.");
  return data.results.map((item) => {
    if (!validId(item.bidResultId)) throw new Error("개찰결과 항목이 올바르지 않습니다.");
    return {
      id: String(item.bidResultId),
      classificationNo: item.bidClsfcNo,
      round: item.rbidNo,
      status: item.resultStatus,
      openedAt: formatKst(item.actualOpenAt),
      plannedOpenAt: formatKst(item.plannedOpenAt),
      participantCount: item.participantCount,
      openingMessage: clean(item.openingResultMessage),
      openingFirstPlaceName: clean(item.openingFirstPlace?.companyName),
      openingFirstPlaceAmount: safeDecimal(item.openingFirstPlace?.bidAmount),
      openingFirstPlaceRate: finiteOrNull(item.openingFirstPlace?.bidRate),
      winnerName: clean(item.winner?.companyName),
      winningAmount: safeDecimal(item.winner?.successfulBidAmount),
      winningRate: finiteOrNull(item.winner?.successfulBidRate),
      failingReason: clean(item.failing?.reason),
      rebidReason: clean(item.rebid?.reason),
    };
  });
}

export function mapParticipantPage(data: BidParticipantPageDto): BidParticipantPage {
  if (!Array.isArray(data.participants) || !Number.isSafeInteger(data.page) || data.page < 0) {
    throw new Error("참여업체 응답 형식이 올바르지 않습니다.");
  }
  return {
    items: data.participants.map((item) => ({
      rank: clean(item.rank),
      companyName: clean(item.companyName),
      bidAt: formatKst(item.bidAt),
      bidRate: finiteOrNull(item.bidRate),
      bidAmount: safeDecimal(item.bidAmount),
      remark: clean(item.resultRemark),
    })),
    page: data.page + 1,
    totalPages: data.totalPages,
    totalCount: data.totalElements,
  };
}

function mapRestrictionState(status: BidNoticeDetailDto["eligibility"]["licenseLimitStatus"]): BidDetail["eligibility"]["industryState"] {
  if (status === "HAS_ROWS") return "known";
  if (status === "NO_ROWS") return "unrestricted";
  if (status === "FETCH_FAILED") return "failed";
  return "pending";
}

function metadataValue(value: { value: boolean | null; availability: string }): boolean | null {
  return value.availability === "PROVIDED" ? value.value : null;
}

function validId(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function finiteOrNull(value: number | null | undefined): number | null {
  if (value == null) return null;
  if (!Number.isFinite(value)) throw new Error("입찰공고 숫자 응답 형식이 올바르지 않습니다.");
  return value;
}

function safeAmount(value: number | null | undefined): number | null {
  const amount = finiteOrNull(value);
  if (amount != null && !Number.isSafeInteger(amount)) throw new Error("입찰공고 금액 응답 형식이 올바르지 않습니다.");
  return amount;
}

function safeDecimal(value: number | null | undefined): number | null {
  const amount = finiteOrNull(value);
  if (amount != null && Math.abs(amount) > Number.MAX_SAFE_INTEGER) throw new Error("입찰공고 금액 응답 형식이 올바르지 않습니다.");
  return amount;
}

function clean(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function formatKst(value: string | null | undefined, includeTime = true): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("입찰공고 날짜 응답 형식이 올바르지 않습니다.");
  const parts = Object.fromEntries(kstDate.formatToParts(date).map((part) => [part.type, part.value]));
  const datePart = `${parts.year}.${parts.month}.${parts.day}`;
  return includeTime ? `${datePart} ${parts.hour}:${parts.minute}` : datePart;
}

function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}
