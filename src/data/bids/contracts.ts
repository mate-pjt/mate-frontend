import type { Bid, BidKind } from "@/types/bid";
import type { BidListItem } from "@/types/bid-list";
import type { BidDetailPageData } from "@/types/bid-detail";
import type { PersonalFilterValues } from "@/features/bid-notice-filters/model";

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
  readonly personalFilter?: PersonalFilterValues;
};

export type BidListResult = {
  readonly items: readonly BidListItem[];
  readonly totalCount: number;
  readonly page: number;
  readonly size: number;
};

export type BidFilterOptions = {
  readonly regions: readonly string[];
  readonly industries: readonly string[];
  readonly contractMethods: readonly string[];
  readonly regionOptions: readonly { readonly code: string; readonly label: string }[];
  readonly industryOptions: readonly { readonly code: string; readonly label: string }[];
};

export interface BidReader {
  getHomeBids(): Promise<readonly Bid[]>;
  getBidList(query: BidListQuery): Promise<BidListResult>;
  getFilterOptions(): Promise<BidFilterOptions>;
}

export type BidDetailQuery = {
  readonly id: string;
  readonly classificationNo: string | null;
  readonly itemPage: number;
  readonly resultId: string | null;
  readonly participantsPage: number;
};

export interface BidDetailReader {
  getBidDetail(query: BidDetailQuery): Promise<BidDetailPageData | null>;
}
