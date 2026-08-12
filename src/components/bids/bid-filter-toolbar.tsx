'use client';

import { useEffect, useRef, useState } from "react";

import { DownArrowIcon } from "@/components/icons";
import {
  CalendarCategoryPopover,
  ContractCategoryPopover,
  IndustryCategoryPopover,
  PlaceCategoryPopover,
  PriceCategoryPopover,
  PublicCategoryPopover,
} from "@/components/ui/filter-popover";
import type { BidFilterOptions } from "@/data/bids/contracts";

import { categoryLabels, type BidFilters } from "./bid-list-model";

type FilterKey = "category" | "region" | "industry" | "contract" | "period" | "amount";

type BidFilterToolbarProps = {
  readonly filterOptions: BidFilterOptions;
  readonly filters: BidFilters;
  readonly onFilterChange: (key: keyof BidFilters, value?: string) => void;
};

export function BidFilterToolbar({ filterOptions, filters, onFilterChange }: BidFilterToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFilter, setOpenFilter] = useState<FilterKey>();
  const [draftFilters, setDraftFilters] = useState<BidFilters>(filters);
  const [industryQuery, setIndustryQuery] = useState("");

  useEffect(() => {
    if (!openFilter) return;

    function closeOnPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpenFilter(undefined);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenFilter(undefined);
    }

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openFilter]);

  const close = () => setOpenFilter(undefined);
  const open = (name?: FilterKey) => {
    setDraftFilters(filters);
    setIndustryQuery("");
    setOpenFilter(name);
  };
  const changeDraft = (key: keyof BidFilters, value?: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };
  const save = (key: keyof BidFilters) => {
    onFilterChange(key, draftFilters[key]);
    close();
  };
  const reset = (key: keyof BidFilters) => {
    onFilterChange(key, key === "category" ? "construction" : undefined);
    close();
  };

  return (
    <div className="flex flex-wrap gap-2" ref={rootRef}>
      <FilterSlot active label={categoryLabels[filters.category ?? "construction"]} name="category" onOpen={open} open={openFilter}>
        <PublicCategoryPopover
          onCategorySelect={(value) => changeDraft("category", value)}
          onReset={() => reset("category")}
          onSave={() => save("category")}
          resetDisabled={filters.category === "construction"}
          saveDisabled={draftFilters.category === filters.category}
          selectedValue={draftFilters.category}
        />
      </FilterSlot>
      <FilterSlot active={Boolean(filters.region)} label={filters.region ?? "지역"} name="region" onOpen={open} open={openFilter}>
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
      <FilterSlot active={Boolean(filters.industry)} label={filters.industry ?? "업종"} name="industry" onOpen={open} open={openFilter}>
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
      <FilterSlot active={Boolean(filters.contract)} label={filters.contract ?? "계약방법"} name="contract" onOpen={open} open={openFilter}>
        <ContractCategoryPopover
          methods={filterOptions.contractMethods}
          onMethodSelect={(value) => changeDraft("contract", value)}
          onReset={() => reset("contract")}
          onSave={() => save("contract")}
          selectedMethod={draftFilters.contract}
        />
      </FilterSlot>
      <FilterSlot active={Boolean(filters.period)} label={filters.period ?? "기간"} name="period" onOpen={open} open={openFilter}>
        <CalendarCategoryPopover
          advancedDisabled
          onQuickRangeSelect={(value) => changeDraft("period", value)}
          onReset={() => reset("period")}
          onSave={() => save("period")}
          selectedQuickRange={draftFilters.period}
        />
      </FilterSlot>
      <FilterSlot active={Boolean(filters.amount)} label={filters.amount ?? "금액"} name="amount" onOpen={open} open={openFilter}>
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
    <div className="relative">
      <button
        aria-expanded={expanded}
        className={`flex h-9 ${name === "contract" ? "min-w-24" : "min-w-[72px]"} items-center justify-center gap-1 rounded-[8px] border px-[10px] outline-none type-body-2 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${expanded ? "border-transparent bg-primary-100 text-primary-400" : active ? "border-transparent bg-primary-100 text-primary-400" : "border-transparent bg-grayscale-50 text-grayscale-700 hover:bg-grayscale-100"}`}
        onClick={() => onOpen(expanded ? undefined : name)}
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
