import type { Bid, BidKind } from "@/types/bid";

export type BidView = "all" | "closing" | "result" | "recommended";

export type BidFilters = {
  readonly category?: BidKind;
  readonly region?: string;
  readonly industry?: string;
  readonly contract?: string;
  readonly agency?: string;
  readonly period?: string;
  readonly amount?: string;
};

export type BidListQuery = BidFilters & {
  readonly view: BidView;
  readonly query: string;
  readonly page: number;
  readonly size: number;
};

export type BidListResult = {
  readonly items: readonly Bid[];
  readonly totalCount: number;
  readonly page: number;
  readonly size: number;
};

export type BidFilterOptions = {
  readonly regions: readonly string[];
  readonly industries: readonly string[];
  readonly contractMethods: readonly string[];
};

export interface BidReader {
  getHomeBids(): Promise<readonly Bid[]>;
  getBidList(query: BidListQuery): Promise<BidListResult>;
  getBidDetail(bidId: string): Promise<Bid | null>;
  getFilterOptions(): Promise<BidFilterOptions>;
}
