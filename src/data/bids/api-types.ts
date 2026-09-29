export type CommonResponse<T> = {
  readonly isSuccess: boolean;
  readonly data: T | null;
  readonly code: string | null;
  readonly message: string | null;
  readonly traceId: string | null;
  readonly retryAfterSeconds: number | null;
};

export type BidNoticeListViewDto = "ALL" | "CLOSING_SOON" | "RESULT";
export type BidTypeDto = "CONSTRUCTION" | "SERVICE" | "GOODS";
export type ContractMethodDto = "GENERAL" | "LIMITED" | "NOMINATION" | "PRIVATE";

export type RegionMetadataListDto = {
  readonly items: readonly RegionMetadataDto[];
};

export type RegionMetadataDto = {
  readonly code: string;
  readonly name: string;
  readonly fullName: string;
  readonly parentCode: string | null;
  readonly depth: number;
};

export type IndustrySearchDto = {
  readonly items: readonly IndustryDto[];
  readonly totalCount: number;
};

export type IndustryDto = {
  readonly code: string;
  readonly name: string;
  readonly classificationCode: string | null;
  readonly classificationName: string | null;
  readonly categoryCodes: readonly string[];
};

export type BidNoticeListDto = {
  readonly items: readonly BidNoticeSummaryDto[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
};

export type BidNoticeSummaryDto = {
  readonly id: number;
  readonly bidNtceNo: string;
  readonly bidNtceOrd: string;
  readonly noticeName: string;
  readonly bidType: BidTypeDto;
  readonly status: "NORMAL" | "MODIFIED" | "CANCELLED" | "REBID";
  readonly progressState: "UPCOMING" | "OPEN" | "CLOSED" | "RESULT_AVAILABLE" | "CANCELLED";
  readonly noticePublishedAt: string | null;
  readonly bidQualificationRegistrationDeadlineAt: string | null;
  readonly contractMethod: ContractMethodDto | null;
  readonly noticeAgencyName: string | null;
  readonly demandAgencyName: string | null;
  readonly bidBeginAt: string | null;
  readonly bidCloseAt: string | null;
  readonly openAt: string | null;
  readonly budgetAmount: number | null;
  readonly estimatedPrice: number | null;
  readonly basePrice: number | null;
  readonly baseAmountPublicationStatus: "UNCHECKED" | "PUBLISHED" | "RECHECK_EXHAUSTED";
  readonly baseAmountCollectionState: BidNoticeSectionCollectionStateDto | null;
  readonly lowerBoundRate: number | null;
  readonly lowerBoundRateStatus: "PROVIDED" | "NOT_PROVIDED";
  readonly participationRegionStatus: "UNKNOWN" | "HAS_ROWS" | "NO_ROWS" | "FETCH_FAILED";
  readonly participationRegionCount: number;
  readonly participationRegionCollectionState: BidNoticeSectionCollectionStateDto | null;
  readonly participationRegionDisplayName: string | null;
  readonly participationRegions: readonly ParticipationRegionSummaryDto[];
  readonly representativeIndustry: IndustrySummaryDto | null;
  readonly industryCount: number;
  readonly licenseLimitStatus: "UNKNOWN" | "HAS_ROWS" | "NO_ROWS" | "FETCH_FAILED" | null;
  readonly licenseLimitCollectionState: BidNoticeSectionCollectionStateDto | null;
  readonly resultSummary: BidNoticeResultSummaryDto | null;
  readonly row: BidNoticeListRowDto | null;
  readonly aValueAcquisitionStatus: "WAITING_BASE_AMOUNT" | "APPLICABILITY_UNKNOWN" | "NOT_APPLICABLE" | "PUBLISHED" | "RECONCILIATION_REQUIRED" | "RECHECK_EXHAUSTED";
};

export type BidNoticeSectionCollectionStateDto = {
  readonly status: "NOT_REQUESTED" | "PENDING" | "PROCESSING" | "SUCCEEDED" | "PARTIALLY_FAILED" | "FAILED";
  readonly reasonCode: "NO_COLLECTION_REQUEST" | "WAITING_FOR_SOURCE" | "WAITING_FOR_RETRY" | "SOURCE_PROCESSING" | "COLLECTION_COMPLETED" | "CURRENT_RESULT_NOT_CONFIRMED" | "ITEM_PROCESSING_PARTIALLY_FAILED" | "EXTERNAL_COLLECTION_FAILED" | "SOURCE_PROCESSING_FAILED" | "UPSTREAM_SKIPPED" | "COLLECTION_ABORTED";
  readonly freshness: "NO_SUCCESS" | "CURRENT" | "STALE";
  readonly lastAttemptedAt: string | null;
  readonly lastSuccessfulAt: string | null;
  readonly sourceVersionAt: string | null;
};

export type IndustrySummaryDto = {
  readonly code: string | null;
  readonly name: string;
  readonly mappedToMaster: boolean;
  readonly referenceStatus: "ACTIVE" | "LEGACY_COMPATIBLE" | "UNMAPPED";
  readonly sources: readonly ("NOTICE_API" | "INDUSTRY_MASTER")[];
};

export type ParticipationRegionSummaryDto = {
  readonly name: string;
  readonly rawRegionName: string;
  readonly mappingStatus: "MATCHED_EXACT" | "MATCHED_BY_NORMALIZATION" | "MATCHED_BY_ALIAS" | "NEEDS_REVIEW" | "UNMATCHED";
};

export type BidNoticeListRowDto = {
  readonly kind: "NOTICE" | "CLASSIFICATION";
  readonly bidClsfcNo: string | null;
  readonly knownClassificationCount: number;
  readonly baseAmount: number | null;
};

export type BidNoticeResultSummaryDto = {
  readonly bidResultId: number;
  readonly rebidNo: string;
  readonly status: "NOT_PUBLISHED" | "OPENED" | "AWARD_PENDING" | "AWARDED" | "UNSUCCESSFUL" | "REBID";
  readonly plannedOpenAt: string | null;
  readonly actualOpenAt: string | null;
  readonly winnerName: string | null;
  readonly successfulBidAmount: number | null;
  readonly successfulBidRate: number | null;
  readonly participantCount: number | null;
};
