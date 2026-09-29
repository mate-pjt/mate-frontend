import type { BidTypeDto, ContractMethodDto } from "./api-types";

type CollectionStateDto = {
  readonly status: "NOT_REQUESTED" | "PENDING" | "PROCESSING" | "SUCCEEDED" | "PARTIALLY_FAILED" | "FAILED";
  readonly freshness: "NO_SUCCESS" | "CURRENT" | "STALE";
  readonly lastSuccessfulAt: string | null;
};

type AvailabilityDto = "PROVIDED" | "NOT_EVALUATED" | "SOURCE_NOT_PROVIDED" | "NOT_APPLICABLE" | "INCOMPLETE_INPUT" | "INVALID_SOURCE";

type BooleanMetadataDto = {
  readonly value: boolean | null;
  readonly availability: "PROVIDED" | "NOT_PROVIDED" | "NOT_APPLICABLE";
};

export type BidNoticeDetailDto = {
  readonly id: number;
  readonly classificationContext: {
    readonly scope: "NOTICE" | "CLASSIFICATION";
    readonly selectedBidClsfcNo: string | null;
    readonly knownClassificationCount: number;
    readonly classifications: readonly { readonly bidClsfcNo: string }[];
  };
  readonly sourceKey: { readonly bidNtceNo: string; readonly bidNtceOrd: string };
  readonly header: {
    readonly noticeName: string;
    readonly bidType: BidTypeDto;
    readonly status: "NORMAL" | "MODIFIED" | "CANCELLED" | "REBID";
    readonly noticeChangedAt: string | null;
    readonly changeReason: string | null;
    readonly noticeUrl: string | null;
    readonly referenceNumber: string | null;
  };
  readonly amount: {
    readonly budgetAmount: number | null;
    readonly estimatedPrice: number | null;
    readonly vatAmount: number | null;
    readonly projectAmount: number | null;
    readonly projectAmountAvailability: AvailabilityDto;
    readonly priceDecisionMethod: string | null;
    readonly basePrice: number | null;
    readonly baseAmountCollectionState: CollectionStateDto;
    readonly lowerBoundRate: number | null;
    readonly pureConstructionCost: number | null;
  };
  readonly procedure: {
    readonly bidMethod: string | null;
    readonly contractMethod: ContractMethodDto | null;
    readonly successfulBidMethod: string | null;
    readonly successfulBidMethodStandard: string | null;
    readonly internationalBid: BooleanMetadataDto;
    readonly rebidAllowed: BooleanMetadataDto;
  };
  readonly agencies: {
    readonly noticeAgency: { readonly name: string | null; readonly officerName: string | null; readonly officerPhone: string | null; readonly officerEmail: string | null };
    readonly demandAgency: { readonly name: string | null; readonly officerEmail: string | null };
    readonly orderingRegionName: string | null;
  };
  readonly eligibility: {
    readonly isLocalRestricted: boolean;
    readonly isIndustryRestricted: boolean;
    readonly isSiteExplanationRequired: boolean;
    readonly isPqRequired: boolean;
    readonly performanceCompetition: BooleanMetadataDto;
    readonly mutualMarketEntry: BooleanMetadataDto;
    readonly isDetailedBid: boolean;
    readonly industries: readonly { readonly code: string | null; readonly name: string }[];
    readonly licenseLimitStatus: "UNKNOWN" | "HAS_ROWS" | "NO_ROWS" | "FETCH_FAILED";
    readonly licenseLimitCollectionState: CollectionStateDto;
    readonly participationRegionStatus: "UNKNOWN" | "HAS_ROWS" | "NO_ROWS" | "FETCH_FAILED";
    readonly participationRegionCollectionState: CollectionStateDto;
    readonly participationRegionDisplayName: string | null;
    readonly participationRegions: readonly { readonly name: string }[];
  };
  readonly jointSupply: {
    readonly methodName: string | null;
    readonly agreementReceiptMethod: string | null;
    readonly agreementDeadlineAt: string | null;
  };
  readonly schedule: {
    readonly noticePublishedAt: string | null;
    readonly bidQualificationRegistrationDeadlineAt: string | null;
    readonly bidBeginAt: string | null;
    readonly bidCloseAt: string | null;
    readonly openAt: string | null;
  };
  readonly originalNotice: { readonly available: boolean; readonly noticeUrl: string | null };
};

export type BidNoticeAttachmentListDto = {
  readonly bidNoticeId: number;
  readonly attachments: readonly {
    readonly attachmentId: number;
    readonly fileOrder: number;
    readonly fileName: string;
    readonly previewType: "PDF" | "IMAGE" | "HWPX" | "SPREADSHEET" | "NONE";
  }[];
};

export type RelatedBidNoticeDto = {
  readonly relationType: "INDUSTRY" | "DETAILED_ITEM" | "ITEM_CLASSIFICATION" | null;
  readonly items: readonly {
    readonly bidNoticeId: number;
    readonly bidClsfcNo: string | null;
    readonly noticeName: string;
    readonly bidType: BidTypeDto;
    readonly participationRegionDisplayName: string | null;
    readonly noticePublishedAt: string | null;
    readonly projectAmount: number | null;
  }[];
  readonly hasNext: boolean;
};

export type BidNoticePurchaseItemDto = {
  readonly bidNoticeId: number;
  readonly businessType: "GOODS" | "SERVICE";
  readonly status: string;
  readonly sectionCollectionState: CollectionStateDto;
  readonly summary: {
    readonly itemCount: number;
    readonly totalQuantity: number | null;
    readonly totalQuantityAvailability: AvailabilityDto;
    readonly totalAmount: number | null;
    readonly totalAmountAvailability: AvailabilityDto;
    readonly minUnitPrice: number | null;
    readonly maxUnitPrice: number | null;
    readonly unitPriceRangeAvailability: AvailabilityDto;
  };
  readonly items: readonly {
    readonly bidClsfcNo: string;
    readonly productSequenceNo: number;
    readonly itemClassificationName: string | null;
    readonly detailedItemName: string | null;
    readonly specification: string | null;
    readonly quantity: number | null;
    readonly unit: string | null;
    readonly unitPrice: number | null;
    readonly deliveryDeadline: string | null;
    readonly deliveryPlace: string | null;
  }[];
  readonly page: number;
  readonly totalPages: number;
};

export type BidNoticeResultsDto = {
  readonly bidNoticeId: number;
  readonly sectionCollectionState: CollectionStateDto;
  readonly completeness: "NOT_EVALUATED" | "NOT_PUBLISHED" | "RESULTS_AVAILABLE";
  readonly noticeLevelState: { readonly resultStatus: string; readonly plannedOpenAt: string | null } | null;
  readonly results: readonly {
    readonly bidResultId: number;
    readonly bidClsfcNo: string;
    readonly rbidNo: string;
    readonly resultStatus: string;
    readonly plannedOpenAt: string | null;
    readonly actualOpenAt: string | null;
    readonly participantCount: number | null;
    readonly openingResultMessage: string | null;
    readonly openingFirstPlace: BidParticipantDto | null;
    readonly winner: {
      readonly companyName: string;
      readonly ceoName: string | null;
      readonly successfulBidAmount: number | null;
      readonly successfulBidRate: number | null;
      readonly successfulBidDate: string | null;
    } | null;
    readonly failing: { readonly reason: string | null } | null;
    readonly rebid: { readonly reason: string | null; readonly bidDeadlineAt: string; readonly openAt: string } | null;
  }[];
};

export type BidParticipantDto = {
  readonly rank: string | null;
  readonly companyName: string | null;
  readonly ceoName: string | null;
  readonly bidAt: string | null;
  readonly bidRate: number | null;
  readonly bidAmount: number | null;
  readonly resultRemark: string | null;
};

export type BidParticipantPageDto = {
  readonly bidNoticeId: number;
  readonly bidResultId: number;
  readonly participants: readonly BidParticipantDto[];
  readonly page: number;
  readonly totalPages: number;
  readonly totalElements: number;
};
