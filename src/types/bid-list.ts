import type { BidKind } from "@/types/bid";

export type BidListItem = {
  readonly id: string;
  readonly classificationNo?: string | null;
  readonly noticeNumber: string;
  readonly title: string;
  readonly kind: BidKind;
  readonly demandAgencyName: string | null;
  readonly noticeAgencyName: string | null;
  /** 역할을 구분할 수 없는 기존 mock 목록 전용. */
  readonly organization?: string | null;
  readonly industry: string | null;
  readonly contractMethod: string | null;
  readonly region: string | null;
  readonly baseAmount: number | null;
  readonly estimatedPrice: number | null;
  readonly publishedAt: string | null;
  readonly closesAt: string | null;
  readonly openedAt: string | null;
  readonly winningCompany: string | null;
  readonly bidRate: number | null;
  readonly successfulBidAmount?: number | null;
};
