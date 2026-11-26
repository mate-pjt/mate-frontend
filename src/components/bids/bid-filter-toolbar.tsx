'use client';

import { useEffect, useRef, useState, type ReactNode } from "react";

import { DownArrowIcon } from "@/components/icons";
import {
  CalendarCategoryPopover,
  ContractCategoryPopover,
  IndustryCategoryPopover,
  PlaceCategoryPopover,
  PriceCategoryPopover,
  PublicCategoryPopover,
} from "@/components/ui/filter-popover";
import type { BidAmountDraft, BidAmountFilter, BidDateFilter, BidFilterOptions, BidRegionFilter } from "@/data/bids/contracts";
import { bidDateFilterError, bidDatePresets, bidDateUrlKeys, emptyBidDateFilter, normalizeBidDateFilter, presetBidDateFilter } from "@/features/bid-notice-filters/date-filter";
import { bidAmountDraft as toAmountDraft, bidAmountPresets, bidAmountUrlKeys, emptyBidAmountFilter, formatBidAmount, parseBidAmountDraft, presetBidAmountFilter, resultBidAmountPresets } from "@/features/bid-notice-filters/amount-filter";
import { bidRegionCodeLimit, bidRegionFilterError, emptyBidRegionFilter, sameBidRegionFilter } from "@/features/bid-notice-filters/region-filter";

import { categoryLabels, type BidFilters, type BidView } from "./bid-list-model";

type FilterKey = "category" | "region" | "industry" | "contract" | "period" | "amount";
type SingleFilterKey = "category" | "industry" | "contract";
type OpenFilter = { readonly name: FilterKey; readonly locationSearch: string };

type BidFilterToolbarProps = {
  readonly amountDraft?: BidAmountDraft;
  readonly amountFilter: BidAmountFilter;
  readonly amountQueryError?: string;
  readonly filterOptions: BidFilterOptions;
  readonly dateFilter: BidDateFilter;
  readonly dateQueryError?: string;
  readonly filters: BidFilters;
  readonly filterLabels?: Partial<Record<FilterKey, string>>;
  readonly locationSearch: string;
  readonly renderLeadingAction?: (closeFilters: () => void) => ReactNode;
  readonly onFilterChange: (key: SingleFilterKey, value?: string) => void;
  readonly onDateFilterChange: (filter: BidDateFilter) => void;
  readonly onAmountFilterChange: (filter: BidAmountFilter) => void;
  readonly onRegionFilterChange: (filter: BidRegionFilter) => void;
  readonly personalMode?: boolean;
  readonly regionFilter: BidRegionFilter;
  readonly regionQueryError?: string;
  readonly view: BidView;
};

export function BidFilterToolbar({ amountDraft, amountFilter, amountQueryError, dateFilter, dateQueryError, filterOptions, filters, filterLabels, locationSearch, renderLeadingAction, onAmountFilterChange, onDateFilterChange, onFilterChange, onRegionFilterChange, personalMode = false, regionFilter, regionQueryError, view }: BidFilterToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openedFilter, setOpenedFilter] = useState<OpenFilter>();
  const openFilter = openedFilter?.name;
  if (openedFilter?.name === "region" && openedFilter.locationSearch !== locationSearch) setOpenedFilter(undefined);
  const [draftFilters, setDraftFilters] = useState<BidFilters>(filters);
  const [industryQuery, setIndustryQuery] = useState("");
  const [draftDateFilter, setDraftDateFilter] = useState(dateFilter);
  const [dateQuickRange, setDateQuickRange] = useState<string>();
  const [draftAmount, setDraftAmount] = useState(amountDraft ?? toAmountDraft(amountFilter));
  const [draftRegion, setDraftRegion] = useState(regionFilter);
  const [regionCity, setRegionCity] = useState<string>();
  const regionOptions = filterOptions.regionOptions;
  const findRegion = (code: string) => regionOptions.find(option => option.code === code);
  const cities = regionOptions.filter(option => option.parentCode === null);
  const city = cities.find(option => option.code === regionCity);
  const districts = city ? [
    { value: city.code, label: "전체" },
    ...regionOptions.filter(option => option.parentCode === city.code && option.depth === city.depth + 1)
      .map(option => ({ value: option.code, label: option.name })),
  ] : [];
  const atRegionLimit = draftRegion.regionCodes.length >= bidRegionCodeLimit;
  const draftDistrict = draftRegion.regionCodes.findLast(code => districts.some(option => option.value === code));
  const draftRegionError = bidRegionFilterError(draftRegion);
  const regionCount = regionFilter.regionCodes.length;
  const regionLabel = [
    regionCount > 1 ? `지역 ${regionCount}개` : regionFilter.regionCodes.map(code => findRegion(code)?.label ?? code)[0],
    regionFilter.regionOnly ? "지역 업체만" : undefined,
    { ALL: undefined, REQUIRED: "공동도급 의무", AVAILABLE: "공동도급 가능" }[regionFilter.jointContract],
  ].filter(Boolean).join(" · ");
  const resultView = view === "result";
  const amountHeading = resultView ? "낙찰금액" : "금액";
  const amountPresetLabels = Object.keys(resultView ? resultBidAmountPresets : bidAmountPresets);
  const parsedAmount = parseBidAmountDraft(draftAmount, view);
  const amountPreset = amountPresetLabels.find(preset => {
    const filter = presetBidAmountFilter(preset, draftAmount.amountType, view);
    return !parsedAmount.amountError && bidAmountUrlKeys.every(key => filter[key] === parsedAmount.amountFilter[key]);
  });
  const sameAmounts = bidAmountUrlKeys.every(key => parsedAmount.amountFilter[key] === amountFilter[key]);
  const hasAppliedAmount = amountFilter.amountMin !== null || amountFilter.amountMax !== null;
  const hasAmountSelection = Boolean(draftAmount.amountMin || draftAmount.amountMax || hasAppliedAmount || amountQueryError);
  const dateError = bidDateFilterError(draftDateFilter, view);
  const normalizedDate = normalizeBidDateFilter(draftDateFilter);
  const sameDates = bidDateUrlKeys.every(key => normalizedDate[key] === dateFilter[key]);
  const hasDateSelection = Boolean(dateFilter.dateFrom || dateFilter.dateTo || draftDateFilter.dateFrom || draftDateFilter.dateTo || dateQueryError);

  useEffect(() => {
    if (!openFilter) return;

    function closeOnPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpenedFilter(undefined);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) {
        setOpenedFilter(undefined);
        rootRef.current?.querySelector<HTMLButtonElement>(`[data-filter-trigger="${openFilter}"]`)?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openFilter]);

  const close = () => setOpenedFilter(undefined);
  const closeDate = () => {
    close();
    rootRef.current?.querySelector<HTMLButtonElement>('[data-filter-trigger="period"]')?.focus();
  };
  const closeAmount = () => {
    close();
    rootRef.current?.querySelector<HTMLButtonElement>('[data-filter-trigger="amount"]')?.focus();
  };
  const applyRegion = (filter: BidRegionFilter) => {
    onRegionFilterChange(filter);
    close();
    rootRef.current?.querySelector<HTMLButtonElement>('[data-filter-trigger="region"]')?.focus();
  };
  const open = (name?: FilterKey) => {
    setDraftFilters(filters);
    setIndustryQuery("");
    setDraftDateFilter(dateFilter);
    setDraftAmount(amountDraft ?? toAmountDraft(amountFilter));
    if (name === "region") {
      setDraftRegion(regionFilter);
      const selection = regionFilter.regionCodes.map(findRegion).find(Boolean);
      setRegionCity(selection?.parentCode ?? selection?.code);
    }
    setDateQuickRange(filters.period ?? Object.keys(bidDatePresets).find(range => {
      const preset = presetBidDateFilter(range, view, dateFilter.dateType);
      return bidDateUrlKeys.every(key => preset[key] === dateFilter[key]);
    }));
    setOpenedFilter(name ? { name, locationSearch } : undefined);
  };
  const changeDraft = (key: SingleFilterKey, value?: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };
  const save = (key: SingleFilterKey) => {
    if (draftFilters[key] !== filters[key]) onFilterChange(key, draftFilters[key]);
    close();
  };
  const reset = (key: SingleFilterKey) => {
    onFilterChange(key, key === "category" && !personalMode ? "construction" : undefined);
    close();
  };
  const changeDate = (key: "dateFrom" | "dateTo", value: string) => {
    setDraftDateFilter(current => ({ ...current, [key]: value || null, dateType: view === "result" ? null : current.dateType ?? "BID_BEGIN" }));
    setDateQuickRange(undefined);
  };
  const changeAmount = (key: "amountMin" | "amountMax", value: string) => {
    setDraftAmount(current => ({ ...current, [key]: value, amountType: resultView ? null : current.amountType ?? "BASE_PRICE" }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2" ref={rootRef}>
      {renderLeadingAction?.(close)}
      <FilterSlot active label={filterLabels?.category ?? categoryLabels[filters.category ?? "construction"]} name="category" onOpen={open} open={openFilter}>
        <PublicCategoryPopover
          highlightedValue={personalMode && !filters.category ? "construction" : undefined}
          onCategorySelect={(value) => changeDraft("category", value)}
          onReset={() => reset("category")}
          onSave={() => save("category")}
          resetDisabled={personalMode ? !filters.category : filters.category === "construction"}
          saveDisabled={draftFilters.category === filters.category}
          selectedValue={draftFilters.category}
        />
      </FilterSlot>
      <FilterSlot active={Boolean(regionLabel || regionQueryError)} label={regionQueryError ? "지역 조건 오류" : regionLabel || "지역"} name="region" onOpen={open} open={openFilter}>
        <PlaceCategoryPopover
          city={regionCity}
          cityOptions={cities.map(option => ({ value: option.code, label: option.label }))}
          district={draftDistrict}
          districtOptions={districts.map(option => ({ ...option, disabled: atRegionLimit && !draftRegion.regionCodes.includes(option.value) }))}
          errorMessage={draftRegionError}
          localOnly={draftRegion.regionOnly}
          onCityChange={setRegionCity}
          onCooperativeChange={jointContract => setDraftRegion(current => ({ ...current, jointContract }))}
          onDistrictChange={code => setDraftRegion(current => {
            if (current.regionCodes.includes(code) || current.regionCodes.length >= bidRegionCodeLimit) return current;
            return { ...current, regionCodes: [...current.regionCodes, code] };
          })}
          onLocalOnlyChange={regionOnly => setDraftRegion(current => ({ ...current, regionOnly }))}
          onReset={() => applyRegion(emptyBidRegionFilter())}
          onSave={() => { if (!draftRegionError) applyRegion(draftRegion); }}
          onTagRemove={code => setDraftRegion(current => {
            const regionCodes = current.regionCodes.filter(selected => selected !== code);
            return { ...current, regionCodes, regionOnly: regionCodes.length > 0 && current.regionOnly };
          })}
          resetDisabled={!regionLabel && !regionQueryError && sameBidRegionFilter(draftRegion, emptyBidRegionFilter())}
          saveDisabled={Boolean(draftRegionError) || (!regionQueryError && sameBidRegionFilter(draftRegion, regionFilter))}
          selectedCooperative={draftRegion.jointContract === "ALL" && !draftRegion.regionOnly ? undefined : draftRegion.jointContract}
          statusMessage={atRegionLimit ? `지역은 최대 ${bidRegionCodeLimit}개까지 선택할 수 있어요.` : undefined}
          tags={draftRegion.regionCodes.map(code => {
            const option = findRegion(code);
            return { value: code, label: option?.parentCode === null ? `${option.label} 전체` : option?.label ?? code };
          })}
        />
      </FilterSlot>
      <FilterSlot active={Boolean(filters.industry || (personalMode && filterLabels?.industry !== "업종"))} label={filterLabels?.industry ?? filters.industry ?? "업종"} name="industry" onOpen={open} open={openFilter}>
        <IndustryCategoryPopover
          inputValue={industryQuery}
          onSearchClear={() => setIndustryQuery("")}
          onSearchValueChange={setIndustryQuery}
          onReset={() => reset("industry")}
          onSave={() => save("industry")}
          onSuggestionSelect={(value) => changeDraft("industry", value)}
          onTagRemove={() => reset("industry")}
          suggestions={filterOptions.industries.filter((industry) => industry.includes(industryQuery))}
          tags={draftFilters.industry ? [draftFilters.industry] : []}
        />
      </FilterSlot>
      <FilterSlot active={Boolean(filters.contract || (personalMode && filterLabels?.contract !== "계약방법"))} label={filterLabels?.contract ?? filters.contract ?? "계약방법"} name="contract" onOpen={open} open={openFilter}>
        <ContractCategoryPopover
          methods={filterOptions.contractMethods}
          onMethodSelect={(value) => changeDraft("contract", value)}
          onReset={() => reset("contract")}
          onSave={() => save("contract")}
          selectedMethod={draftFilters.contract}
        />
      </FilterSlot>
      {view !== "closing" && (
        <FilterSlot active={Boolean(dateFilter.dateFrom || dateFilter.dateTo || filters.period || dateQueryError)} label={dateFilter.dateFrom || dateFilter.dateTo ? (view === "result" ? "개찰기간 설정됨" : "기간 설정됨") : filters.period ?? (view === "result" ? "개찰일" : "기간")} name="period" onOpen={open} open={openFilter}>
          <CalendarCategoryPopover
            activeType={draftDateFilter.dateType === "PARTICIPATION_DEADLINE" ? "participation" : draftDateFilter.dateType === "BID_CLOSE" ? "deadline" : "open"}
            endDate={draftDateFilter.dateTo ?? ""}
            errorMessage={dateError}
            heading={view === "result" ? "개찰일" : "기간"}
            onEndDateChange={value => changeDate("dateTo", value)}
            onStartDateChange={value => changeDate("dateFrom", value)}
            onTypeSelect={value => setDraftDateFilter(current => ({ ...current, dateType: { open: "BID_BEGIN", participation: "PARTICIPATION_DEADLINE", deadline: "BID_CLOSE" }[value] as BidDateFilter["dateType"] }))}
            onQuickRangeSelect={value => {
              setDraftDateFilter(presetBidDateFilter(value, view, draftDateFilter.dateType));
              setDateQuickRange(value);
            }}
            onReset={() => { onDateFilterChange(emptyBidDateFilter()); closeDate(); }}
            onSave={() => { if (!dateError) { onDateFilterChange(normalizedDate); closeDate(); } }}
            resetDisabled={!hasDateSelection}
            saveDisabled={Boolean(dateError) || (sameDates && !dateQueryError)}
            selectedQuickRange={dateQuickRange}
            showTypeSelector={view !== "result"}
            startDate={draftDateFilter.dateFrom ?? ""}
          />
        </FilterSlot>
      )}
      <FilterSlot
        active={hasAppliedAmount || Boolean(amountQueryError)}
        label={hasAppliedAmount ? `${amountHeading} 설정됨` : amountHeading}
        name="amount"
        onOpen={open}
        open={openFilter}
      >
        <PriceCategoryPopover
          activeType={draftAmount.amountType === "ESTIMATED_PRICE" ? "estimated" : "base"}
          errorMessage={parsedAmount.amountError}
          heading={amountHeading}
          maxLabel={parsedAmount.amountError ? `${draftAmount.amountMax || "제한 없음"}` : formatBidAmount(parsedAmount.amountFilter.amountMax)}
          minLabel={parsedAmount.amountError ? `${draftAmount.amountMin || "제한 없음"}` : formatBidAmount(parsedAmount.amountFilter.amountMin)}
          maxValue={draftAmount.amountMax}
          minValue={draftAmount.amountMin}
          onMaxValueChange={value => changeAmount("amountMax", value)}
          onMinValueChange={value => changeAmount("amountMin", value)}
          onTypeSelect={value => setDraftAmount(current => ({ ...current, amountType: value === "estimated" ? "ESTIMATED_PRICE" : "BASE_PRICE" }))}
          onPresetSelect={value => setDraftAmount(toAmountDraft(presetBidAmountFilter(value, draftAmount.amountType, view)))}
          onReset={() => { onAmountFilterChange(emptyBidAmountFilter()); closeAmount(); }}
          onSave={() => { if (!parsedAmount.amountError) { onAmountFilterChange(parsedAmount.amountFilter); closeAmount(); } }}
          presetLabels={amountPresetLabels}
          resetDisabled={!hasAmountSelection}
          saveDisabled={Boolean(parsedAmount.amountError) || (sameAmounts && !amountQueryError)}
          selectedPreset={amountPreset}
          showTypeSelector={!resultView}
        />
      </FilterSlot>
    </div>
  );
}

function FilterSlot({ active = false, children, label, name, onOpen, open }: {
  readonly active?: boolean;
  readonly children: React.ReactNode;
  readonly label: string;
  readonly name: FilterKey;
  readonly onOpen: (name?: FilterKey) => void;
  readonly open?: FilterKey;
}) {
  const expanded = open === name;

  return (
    <div className={name === "region" ? "relative min-w-0 max-w-full" : "relative"}>
      <button
        aria-expanded={expanded}
        data-filter-trigger={name}
        className={`flex h-9 max-w-full ${name === "contract" ? "min-w-24" : "min-w-[72px]"} items-center justify-center gap-1 rounded-[8px] border px-[10px] outline-none type-body-2 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${expanded || active ? "border-transparent bg-primary-100 text-primary-400" : "border-transparent bg-grayscale-50 text-grayscale-700 hover:bg-grayscale-100"}`}
        onClick={() => onOpen(expanded ? undefined : name)}
        type="button"
      >
        <span className={name === "region" ? "truncate" : "whitespace-nowrap"}>{label}</span>
        <DownArrowIcon aria-hidden className="size-4 shrink-0" focusable="false" />
      </button>
      {expanded && (
        <div className="absolute left-0 top-[calc(100%+12px)] z-30 max-lg:fixed max-lg:left-4 max-lg:right-4 max-lg:top-24 max-lg:flex max-lg:justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
