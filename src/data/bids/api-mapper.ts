import type { BidKind } from "@/types/bid";
import type { BidListItem } from "@/types/bid-list";

import type { BidFilterOptions, BidListResult } from "./contracts";
import type {
  BidNoticeListDto,
  BidNoticeSummaryDto,
  BidTypeDto,
  ContractMethodDto,
  IndustryDto,
  IndustrySearchDto,
  RegionMetadataDto,
  RegionMetadataListDto,
} from "./api-types";

const bidKinds: Record<BidTypeDto, BidKind> = {
  CONSTRUCTION: "construction",
  SERVICE: "service",
  GOODS: "purchase",
};

const contractMethodLabels: Record<ContractMethodDto, string> = {
  GENERAL: "일반경쟁",
  LIMITED: "제한경쟁",
  NOMINATION: "지명경쟁",
  PRIVATE: "수의계약",
};

const contractMethodCodes = Object.fromEntries(
  Object.entries(contractMethodLabels).map(([code, label]) => [label, code]),
) as Record<string, ContractMethodDto>;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function mapBidListResult(data: BidNoticeListDto): BidListResult {
  if (
    !Array.isArray(data.items) ||
    !Number.isSafeInteger(data.page) || data.page < 0 ||
    !Number.isSafeInteger(data.size) || data.size < 1 ||
    !Number.isSafeInteger(data.totalElements) || data.totalElements < 0 ||
    !Number.isSafeInteger(data.totalPages) || data.totalPages < 0
  ) {
    throw new Error("입찰공고 목록 응답 형식이 올바르지 않습니다.");
  }

  return {
    items: data.items.map(mapBidListItem),
    totalCount: data.totalElements,
    page: data.page + 1,
    size: data.size,
  };
}

export function mapBidFilterOptions(
  regions: RegionMetadataListDto,
  industries: IndustrySearchDto,
): BidFilterOptions {
  if (!Array.isArray(regions.items) || !Array.isArray(industries.items)) {
    throw new Error("입찰공고 필터 응답 형식이 올바르지 않습니다.");
  }

  return {
    regions: topLevelRegions(regions.items).map((region) => region.fullName),
    industries: labeledIndustries(industries.items).map((option) => option.label),
    contractMethods: Object.values(contractMethodLabels),
    regionOptions: regions.items.map((region) => ({ code: region.code, label: region.fullName })),
    industryOptions: labeledIndustries(industries.items),
  };
}

export function findRegionCode(label: string, regions: RegionMetadataListDto): string {
  const selected = topLevelRegions(regions.items).find(
    (region) => region.fullName === label || region.code === label,
  );
  if (!selected) throw new Error("선택한 지역을 확인할 수 없습니다.");
  return selected.code;
}

export function findIndustryCode(label: string, industries: IndustrySearchDto): string {
  const selected = labeledIndustries(industries.items).find(
    (option) => option.label === label || option.code === label,
  );
  if (!selected) throw new Error("선택한 업종을 확인할 수 없습니다.");
  return selected.code;
}

export function findContractMethodCode(label: string): ContractMethodDto {
  const selected = contractMethodCodes[label];
  if (!selected) throw new Error("선택한 계약방법을 확인할 수 없습니다.");
  return selected;
}

function mapBidListItem(item: BidNoticeSummaryDto): BidListItem {
  if (!Number.isSafeInteger(item.id) || item.id < 1 || !item.bidNtceNo || !item.noticeName) {
    throw new Error("입찰공고 항목 응답 형식이 올바르지 않습니다.");
  }

  const kind = bidKinds[item.bidType];
  if (!kind) throw new Error("입찰공고 종류 응답 형식이 올바르지 않습니다.");

  const result = item.resultSummary;
  const baseAmount = item.row?.kind === "CLASSIFICATION"
    ? item.row.baseAmount
    : item.row?.baseAmount ?? item.basePrice;

  return {
    id: String(item.id),
    classificationNo: item.row?.bidClsfcNo ?? null,
    noticeNumber: item.bidNtceOrd ? `${item.bidNtceNo}-${item.bidNtceOrd}` : item.bidNtceNo,
    title: item.noticeName,
    kind,
    demandAgencyName: nonBlankOrNull(item.demandAgencyName),
    noticeAgencyName: nonBlankOrNull(item.noticeAgencyName),
    industry: item.representativeIndustry?.name ?? null,
    contractMethod: item.contractMethod ? contractMethodLabels[item.contractMethod] ?? null : null,
    region: item.participationRegionDisplayName,
    baseAmount: finiteOrNull(baseAmount),
    estimatedPrice: finiteOrNull(item.estimatedPrice),
    publishedAt: formatKst(item.noticePublishedAt, false),
    closesAt: formatKst(item.bidCloseAt, true),
    openedAt: formatKst(result?.actualOpenAt ?? result?.plannedOpenAt ?? item.openAt, true),
    winningCompany: result?.winnerName ?? null,
    bidRate: finiteOrNull(result?.successfulBidRate),
    successfulBidAmount: finiteOrNull(result?.successfulBidAmount),
  };
}

function topLevelRegions(regions: readonly RegionMetadataDto[]) {
  return regions.filter((region) => region.parentCode === null);
}

function labeledIndustries(industries: readonly IndustryDto[]) {
  const counts = new Map<string, number>();
  industries.forEach((industry) => counts.set(industry.name, (counts.get(industry.name) ?? 0) + 1));
  return industries.map((industry) => ({
    code: industry.code,
    label: (counts.get(industry.name) ?? 0) > 1
      ? `${industry.name} (${industry.code})`
      : industry.name,
  }));
}

function finiteOrNull(value: number | null | undefined): number | null {
  if (value == null) return null;
  if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    throw new Error("입찰공고 금액 응답 형식이 올바르지 않습니다.");
  }
  return value;
}

function nonBlankOrNull(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function formatKst(value: string | null | undefined, includeTime: boolean): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = Object.fromEntries(dateFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  const day = `${parts.year}.${parts.month}.${parts.day}`;
  return includeTime ? `${day} ${parts.hour}:${parts.minute}` : day;
}
