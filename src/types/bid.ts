export type BidStatus = "open" | "closing-soon" | "closed";

export type BidKind = "construction" | "service" | "purchase";

export type Bid = {
  readonly id: string;
  readonly noticeNumber: string;
  readonly title: string;
  readonly organization: string;
  readonly category: string;
  readonly kind: BidKind;
  readonly industry: string;
  readonly contractMethod: string;
  readonly region: string;
  readonly budget: number;
  readonly baseAmount: number;
  readonly estimatedPrice: number;
  readonly publishedAt: string;
  readonly bidStartedAt: string;
  readonly closesAt: string;
  readonly openedAt: string;
  readonly winningCompany: string;
  readonly bidRate: number;
  readonly status: BidStatus;
  readonly recommended: boolean;
  readonly summary: string;
  readonly tags: readonly string[];
};
