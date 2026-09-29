export type BidDetail = {
  readonly id: string;
  readonly classificationNo: string | null;
  readonly classifications: readonly string[];
  readonly noticeNumber: string;
  readonly title: string;
  readonly referenceNumber: string | null;
  readonly bidType: "construction" | "service" | "goods";
  readonly status: "NORMAL" | "MODIFIED" | "CANCELLED" | "REBID";
  readonly changedAt: string | null;
  readonly changeReason: string | null;
  readonly sourceUrl: string | null;
  readonly amount: {
    readonly basePrice: number | null;
    readonly estimatedPrice: number | null;
    readonly budget: number | null;
    readonly projectAmount: number | null;
    readonly lowerBoundRate: number | null;
    readonly priceDecisionMethod: string | null;
    readonly pureConstructionCost: number | null;
  };
  readonly schedule: {
    readonly publishedAt: string | null;
    readonly qualificationDeadlineAt: string | null;
    readonly bidBeginAt: string | null;
    readonly bidCloseAt: string | null;
    readonly openAt: string | null;
  };
  readonly procedure: {
    readonly bidMethod: string | null;
    readonly contractMethod: string | null;
    readonly awardMethod: string | null;
    readonly internationalBid: boolean | null;
    readonly rebidAllowed: boolean | null;
  };
  readonly agencies: {
    readonly noticeName: string | null;
    readonly demandName: string | null;
    readonly orderingRegionName: string | null;
    readonly noticeOfficerName: string | null;
    readonly noticeOfficerPhone: string | null;
    readonly noticeOfficerEmail: string | null;
    readonly demandOfficerEmail: string | null;
  };
  readonly eligibility: {
    readonly industries: readonly string[];
    readonly industryState: "known" | "unrestricted" | "pending" | "failed";
    readonly regions: readonly string[];
    readonly regionState: "known" | "unrestricted" | "pending" | "failed";
    readonly siteExplanationRequired: boolean;
    readonly pqRequired: boolean;
    readonly detailedBid: boolean;
    readonly performanceCompetition: boolean | null;
    readonly mutualMarketEntry: boolean | null;
  };
  readonly jointSupply: {
    readonly method: string | null;
    readonly receiptMethod: string | null;
    readonly deadlineAt: string | null;
  };
};

export type DetailSection<T> =
  | { readonly status: "ready"; readonly data: T }
  | { readonly status: "error"; readonly data: null };

export type BidAttachment = {
  readonly id: string;
  readonly name: string;
  readonly previewable: boolean;
  readonly previewUrl: string | null;
  readonly downloadUrl: string;
};

export type RelatedBid = {
  readonly id: string;
  readonly classificationNo: string | null;
  readonly title: string;
  readonly bidType: BidDetail["bidType"];
  readonly region: string | null;
  readonly publishedAt: string | null;
  readonly projectAmount: number | null;
};

export type BidPurchaseSection = {
  readonly itemCount: number;
  readonly totalQuantity: number | null;
  readonly totalAmount: number | null;
  readonly minUnitPrice: number | null;
  readonly maxUnitPrice: number | null;
  readonly items: readonly {
    readonly key: string;
    readonly name: string | null;
    readonly specification: string | null;
    readonly quantity: number | null;
    readonly unit: string | null;
    readonly unitPrice: number | null;
    readonly deliveryDeadline: string | null;
    readonly deliveryPlace: string | null;
  }[];
  readonly totalPages: number;
  readonly page: number;
};

export type BidResult = {
  readonly id: string;
  readonly classificationNo: string;
  readonly round: string;
  readonly status: string;
  readonly openedAt: string | null;
  readonly plannedOpenAt: string | null;
  readonly participantCount: number | null;
  readonly openingMessage: string | null;
  readonly openingFirstPlaceName: string | null;
  readonly openingFirstPlaceAmount: number | null;
  readonly openingFirstPlaceRate: number | null;
  readonly winnerName: string | null;
  readonly winningAmount: number | null;
  readonly winningRate: number | null;
  readonly failingReason: string | null;
  readonly rebidReason: string | null;
};

export type BidParticipant = {
  readonly rank: string | null;
  readonly companyName: string | null;
  readonly bidAt: string | null;
  readonly bidRate: number | null;
  readonly bidAmount: number | null;
  readonly remark: string | null;
};

export type BidParticipantPage = {
  readonly items: readonly BidParticipant[];
  readonly page: number;
  readonly totalPages: number;
  readonly totalCount: number;
};

export type BidDetailPageData = {
  readonly bid: BidDetail;
  readonly attachments: DetailSection<readonly BidAttachment[]>;
  readonly related: DetailSection<readonly RelatedBid[]>;
  readonly purchases: DetailSection<BidPurchaseSection> | null;
  readonly results: DetailSection<readonly BidResult[]>;
  readonly selectedResultId: string | null;
  readonly participants: DetailSection<BidParticipantPage> | null;
  readonly podium: DetailSection<readonly BidParticipant[]> | null;
};
