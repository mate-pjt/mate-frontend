import type { BidKind } from "@/types/bid";
import type { BidListItem } from "@/types/bid-list";
import type { BidDetailPageData } from "@/types/bid-detail";
import type { PersonalFilterValues } from "@/features/bid-notice-filters/model";

export type BidView = "all" | "closing" | "result" | "recommended";

export type BidDateFilter = Pick<PersonalFilterValues, "dateType" | "dateFrom" | "dateTo">;
export type BidRegionFilter = Pick<PersonalFilterValues, "regionCodes" | "regionOnly" | "jointContract">;
export type BidAmountFilter = Pick<PersonalFilterValues, "amountType" | "amountMin" | "amountMax">;
export type BidResultAmountFilter = Pick<BidAmountFilter, "amountMin" | "amountMax">;
export type BidAmountDraft = Pick<BidAmountFilter, "amountType"> & { amountMin: string; amountMax: string };

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
  readonly regionFilter?: BidRegionFilter;
  readonly regionError?: string;
  readonly dateFilter?: BidDateFilter;
  readonly dateError?: string;
  readonly amountFilter?: BidAmountFilter;
  readonly resultAmountFilter?: BidResultAmountFilter;
  readonly amountDraft?: BidAmountDraft;
  readonly amountError?: string;
};

export type BidListResult = {
  readonly items: readonly BidListItem[];
  readonly totalCount: number;
  readonly page: number;
  readonly size: number;
};

export type BidRegionOption = {
  readonly code: string;
  readonly label: string;
  readonly name: string;
  readonly parentCode: string | null;
  readonly depth: number;
};

export type BidFilterOptions = {
  readonly industries: readonly string[];
  readonly contractMethods: readonly string[];
  readonly regionOptions: readonly BidRegionOption[];
  readonly industryOptions: readonly { readonly code: string; readonly label: string }[];
};

export interface BidListRepository {
  getBidList(query: BidListQuery, signal?: AbortSignal): Promise<BidListResult>;
  getFilterOptions(): Promise<BidFilterOptions>;
}

export type BidDetailQuery = {
  readonly id: string;
  readonly classificationNo: string | null;
  readonly itemPage: number;
  readonly resultId: string | null;
  readonly participantsPage: number;
};

export interface BidDetailRepository {
  getBidDetail(query: BidDetailQuery): Promise<BidDetailPageData | null>;
}
