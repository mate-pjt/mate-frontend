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
import type { BidDateFilter, BidFilterOptions } from "@/data/bids/contracts";
import { bidDateFilterError, bidDatePresets, bidDateUrlKeys, emptyBidDateFilter, normalizeBidDateFilter, presetBidDateFilter } from "@/features/bid-notice-filters/date-filter";

import { categoryLabels, type BidFilters, type BidView } from "./bid-list-model";

type FilterKey = "category" | "region" | "industry" | "contract" | "period" | "amount";

type BidFilterToolbarProps = {
  readonly filterOptions: BidFilterOptions;
  readonly dateFilter: BidDateFilter;
  readonly dateQueryError?: string;
  readonly filters: BidFilters;
  readonly filterLabels?: Partial<Record<FilterKey, string>>;
  readonly renderLeadingAction?: (closeFilters: () => void) => ReactNode;
  readonly onFilterChange: (key: keyof BidFilters, value?: string) => void;
  readonly onDateFilterChange: (filter: BidDateFilter) => void;
  readonly personalMode?: boolean;
  readonly view: BidView;
};

export function BidFilterToolbar({ dateFilter, dateQueryError, filterOptions, filters, filterLabels, renderLeadingAction, onDateFilterChange, onFilterChange, personalMode = false, view }: BidFilterToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFilter, setOpenFilter] = useState<FilterKey>();
  const [draftFilters, setDraftFilters] = useState<BidFilters>(filters);
  const [industryQuery, setIndustryQuery] = useState("");
  const [draftDateFilter, setDraftDateFilter] = useState(dateFilter);
  const [dateQuickRange, setDateQuickRange] = useState<string>();
  const dateError = bidDateFilterError(draftDateFilter, view);
  const normalizedDate = normalizeBidDateFilter(draftDateFilter);
  const sameDates = bidDateUrlKeys.every(key => normalizedDate[key] === dateFilter[key]);
  const hasDateSelection = Boolean(dateFilter.dateFrom || dateFilter.dateTo || draftDateFilter.dateFrom || draftDateFilter.dateTo || dateQueryError);

  useEffect(() => {
    if (!openFilter) return;

    function closeOnPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpenFilter(undefined);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenFilter(undefined);
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

  const close = () => setOpenFilter(undefined);
  const closeDate = () => {
    close();
    rootRef.current?.querySelector<HTMLButtonElement>('[data-filter-trigger="period"]')?.focus();
  };
  const open = (name?: FilterKey) => {
    setDraftFilters(filters);
    setIndustryQuery("");
    setDraftDateFilter(dateFilter);
    setDateQuickRange(filters.period ?? Object.keys(bidDatePresets).find(range => {
      const preset = presetBidDateFilter(range, view, dateFilter.dateType);
      return bidDateUrlKeys.every(key => preset[key] === dateFilter[key]);
    }));
    setOpenFilter(name);
  };
  const changeDraft = (key: keyof BidFilters, value?: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };
  const save = (key: keyof BidFilters) => {
    if (draftFilters[key] !== filters[key]) onFilterChange(key, draftFilters[key]);
    close();
  };
  const reset = (key: keyof BidFilters) => {
    onFilterChange(key, key === "category" && !personalMode ? "construction" : undefined);
    close();
  };
  const changeDate = (key: "dateFrom" | "dateTo", value: string) => {
    setDraftDateFilter(current => ({ ...current, [key]: value || null, dateType: view === "result" ? null : current.dateType ?? "BID_BEGIN" }));
    setDateQuickRange(undefined);
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
      <FilterSlot active={Boolean(filters.region || (personalMode && filterLabels?.region !== "지역"))} label={filterLabels?.region ?? filters.region ?? "지역"} name="region" onOpen={open} open={openFilter}>
        <PlaceCategoryPopover
          advancedDisabled
          city={draftFilters.region}
          cityOptions={filterOptions.regions}
          onCityChange={(value) => changeDraft("region", value)}
          onReset={() => reset("region")}
          onSave={() => save("region")}
          onTagRemove={() => reset("region")}
          tag={draftFilters.region}
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
        active={Boolean(filters.amount || (personalMode && filterLabels?.amount !== "금액"))}
        disabled={view === "result"}
        label={view === "result" ? "낙찰금액 · 준비 중" : filterLabels?.amount ?? filters.amount ?? "금액"}
        name="amount"
        onOpen={open}
        open={openFilter}
      >
        <PriceCategoryPopover
          advancedDisabled
          maxLabel={draftFilters.amount ?? undefined}
          onPresetSelect={(value) => changeDraft("amount", value)}
          onReset={() => reset("amount")}
          onSave={() => save("amount")}
          selectedPreset={toPricePreset(draftFilters.amount)}
        />
      </FilterSlot>
    </div>
  );
}

function FilterSlot({ active = false, children, disabled = false, label, name, onOpen, open }: {
  readonly active?: boolean;
  readonly children: React.ReactNode;
  readonly disabled?: boolean;
  readonly label: string;
  readonly name: FilterKey;
  readonly onOpen: (name?: FilterKey) => void;
  readonly open?: FilterKey;
}) {
  const expanded = !disabled && open === name;

  return (
    <div className="relative">
      <button
        aria-expanded={expanded}
        data-filter-trigger={name}
        className={`flex h-9 ${name === "contract" ? "min-w-24" : "min-w-[72px]"} items-center justify-center gap-1 rounded-[8px] border px-[10px] outline-none type-body-2 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${disabled ? "cursor-not-allowed border-transparent bg-grayscale-50 text-grayscale-500" : expanded || active ? "border-transparent bg-primary-100 text-primary-400" : "border-transparent bg-grayscale-50 text-grayscale-700 hover:bg-grayscale-100"}`}
        disabled={disabled}
        onClick={() => onOpen(expanded ? undefined : name)}
        title={disabled ? "낙찰금액 필터는 백엔드 API 준비 중입니다." : undefined}
        type="button"
      >
        <span className="whitespace-nowrap">{label}</span>
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

function toPricePreset(value?: string) {
  if (value === "1억 원 이하" || value === "1억 ~ 10억 원 이하" || value === "10억 ~ 50억 원 이하" || value === "50억 ~ 100억 원 이하" || value === "100억 원+") return value;
  return undefined;
}
