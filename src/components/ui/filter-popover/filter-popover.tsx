'use client';

import {
    CalendarIcon,
    DownArrowIcon,
    CloseIcon,
    InfoIcon,
} from "@/components/icons";
import { CheckboxSquare } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { Select, SelectMenu } from "@/components/ui/select";

type FilterActionLabels = {
    reset?: string;
    save?: string;
};

type FilterActionHandlers = {
    onReset?: () => void;
    onSave?: () => void;
};

export type FilterActionsProps = FilterActionHandlers & {
    labels?: FilterActionLabels;
    resetDisabled?: boolean;
    saveDisabled?: boolean;
};

type PublicCategoryValue = "construction" | "service" | "purchase";
type CooperativeValue = "all" | "required" | "available";
type DateFilterType = "open" | "participation" | "deadline";
type AmountFilterType = "base" | "estimated";

const publicCategoryOptions: Array<{
    value: PublicCategoryValue;
    label: string;
    icon: string;
}> = [
    { value: "construction", label: "공사", icon: "/icon/24dp/crane.svg" },
    { value: "service", label: "용역", icon: "/icon/24dp/service.svg" },
    { value: "purchase", label: "물품", icon: "/icon/24dp/purchase.svg" },
];

const cooperativeOptions: Array<{ value: CooperativeValue; label: string }> = [
    { value: "all", label: "전체" },
    { value: "required", label: "의무" },
    { value: "available", label: "가능" },
];

const dateTypeOptions: Array<{ value: DateFilterType; label: string }> = [
    { value: "open", label: "입찰개시일" },
    { value: "participation", label: "참가마감" },
    { value: "deadline", label: "입찰마감" },
];

const amountTypeOptions: Array<{ value: AmountFilterType; label: string }> = [
    { value: "base", label: "기초금액" },
    { value: "estimated", label: "추정가격" },
];

const pricePresetLabels = [
    "1억 원 이하",
    "1억 ~ 10억 원 이하",
    "10억 ~ 50억 원 이하",
    "50억 ~ 100억 원 이하",
    "100억 원+",
] as const;

const DEFAULT_MIN_PRICE_LABEL = "0 만 원" as const;
const DEFAULT_MAX_PRICE_LABEL = "0 만 원" as const;

function mergeClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function FilterPanel({
    children,
    className,
    height,
    scrollable = true,
    width = "w-[min(380px,calc(100vw-32px))]",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    height?: string;
    scrollable?: boolean;
    width?: string;
}) {
    return (
        <section
            className={mergeClasses(
                "flex flex-col items-start rounded-[16px] border border-grayscale-200 bg-white p-6 shadow-[var(--shadow-popover)]",
                scrollable && "max-h-[calc(100dvh-112px)] overflow-y-auto",
                width,
                height,
                className,
            )}
            {...props}
        >
            {children}
        </section>
    );
}

function FilterBody({ children }: { children: React.ReactNode }) {
    return <div className="flex min-h-0 w-full flex-1 flex-col items-end justify-between">{children}</div>;
}

export function FilterActions({
    labels,
    onReset,
    onSave,
    resetDisabled = false,
    saveDisabled = false,
}: FilterActionsProps) {
    return (
        <div className="flex h-8 w-[160px] shrink-0 items-center gap-2">
            <Button
                className={mergeClasses("flex-1", resetDisabled && "cursor-not-allowed opacity-40")}
                disabled={resetDisabled}
                onClick={onReset}
                size="xs"
                type="button"
                variant="gray"
            >
                {labels?.reset ?? "초기화"}
            </Button>
            <Button
                className={mergeClasses("flex-1", saveDisabled && "cursor-not-allowed opacity-40")}
                disabled={saveDisabled}
                onClick={onSave}
                size="xs"
                type="button"
                variant="primary"
            >
                {labels?.save ?? "저장"}
            </Button>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-grayscale-700 type-body-1">{children}</h3>;
}

function SelectLikeField({
    children,
    disabled,
    label,
}: {
    children: React.ReactNode;
    disabled?: boolean;
    label?: string;
}) {
    return (
        <button
            aria-label={label}
            className={mergeClasses(
                "flex h-9 w-full items-center justify-between rounded-[8px] border border-grayscale-200 px-2.5 py-2 text-left type-body-7",
                disabled
                    ? "cursor-not-allowed bg-grayscale-100 text-grayscale-600"
                    : "cursor-pointer bg-white text-grayscale-700 hover:bg-grayscale-50",
            )}
            disabled={disabled}
            type="button"
        >
            <span className="truncate">{children}</span>
            <DownArrowIcon aria-hidden className="size-4 shrink-0" focusable="false" />
        </button>
    );
}

function FilterTag({
    children,
    className,
    onRemove,
}: {
    children: React.ReactNode;
    className?: string;
    onRemove?: () => void;
}) {
    return (
        <span
            className={mergeClasses(
                "inline-flex min-h-7 items-center justify-center gap-1 rounded-[6px] bg-primary-100 px-2 py-1 text-primary-400 type-body-7",
                className,
            )}
        >
            <span className="min-w-0 break-words">{children}</span>
            {onRemove && (
                <button
                    aria-label="선택값 삭제"
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center hover:text-grayscale-dark-hover"
                    onClick={onRemove}
                    type="button"
                >
                    <CloseIcon aria-hidden className="size-4" focusable="false" />
                </button>
            )}
        </span>
    );
}

function ChoiceButton({
    children,
    disabled = false,
    onClick,
    selected,
}: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    selected?: boolean;
}) {
    return (
        <button
            className={mergeClasses(
                "flex min-h-8 flex-1 items-center justify-center rounded-[8px] px-3 py-1.5 text-center type-body-7",
                selected
                    ? "bg-primary-100 text-primary-400"
                    : "border border-grayscale-200 bg-white text-grayscale-700 hover:bg-grayscale-50",
                disabled && "cursor-not-allowed opacity-40",
            )}
            disabled={disabled}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );
}

function SegmentedControl<TValue extends string>({
    disabled = false,
    onValueChange,
    options,
    value,
}: {
    disabled?: boolean;
    onValueChange?: (value: TValue) => void;
    options: readonly { readonly value: TValue; readonly label: string }[];
    value: TValue;
}) {
    return (
        <div className="flex h-9 w-full rounded-[8px] bg-grayscale-100 p-0.5">
            {options.map((option) => {
                const selected = option.value === value;

                return (
                    <button
                        className={mergeClasses(
                            "flex flex-1 items-center justify-center rounded-[8px] px-3 py-1 text-center type-body-7",
                            selected
                                ? "bg-white text-grayscale-700 shadow-[var(--shadow-control)]"
                                : "text-grayscale-600",
                            disabled && "cursor-not-allowed opacity-40",
                        )}
                        disabled={disabled}
                        key={option.value}
                        onClick={() => onValueChange?.(option.value)}
                        type="button"
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

function PopupSearchField({
    placeholder = "업종검색...",
    showCaret = false,
    value,
    onClear,
    onValueChange,
}: {
    placeholder?: string;
    showCaret?: boolean;
    value?: string;
    onClear?: () => void;
    onValueChange?: (value: string) => void;
}) {
    return (
        <SearchInput
            className="w-full"
            leftAdornment={
                showCaret ? <span aria-hidden className="mr-1 h-3 w-px rounded-full bg-grayscale-700" /> : undefined
            }
            onClear={onClear}
            onValueChange={onValueChange}
            placeholder={placeholder}
            showSearchIcon={!showCaret}
            value={value}
            variant="popup"
        />
    );
}

export type PublicCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        resetDisabled?: boolean;
        saveDisabled?: boolean;
        onCategorySelect?: (value: PublicCategoryValue) => void;
        highlightedValue?: PublicCategoryValue;
        selectedValue?: PublicCategoryValue;
    };

export function PublicCategoryPopover({
    className,
    highlightedValue,
    onReset,
    onCategorySelect,
    onSave,
    resetDisabled = true,
    saveDisabled = true,
    selectedValue,
    ...props
}: PublicCategoryPopoverProps) {
    const currentSelectedValue = selectedValue ?? (highlightedValue ? undefined : "construction");

    return (
        <FilterPanel className={className} height="h-[260px]" scrollable={false} width="w-[min(307px,calc(100vw-32px))]" {...props}>
            <div className="flex w-full flex-col items-end gap-6">
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full flex-col">
                        <SelectMenu
                            highlightedValue={highlightedValue}
                            options={publicCategoryOptions}
                            onSelect={(option) => {
                                if (isPublicCategoryValue(option.value)) onCategorySelect?.(option.value);
                            }}
                            selectedValue={currentSelectedValue}
                            variant="publicFilter"
                        />
                    </div>
                    <div className="flex w-full items-center gap-1 whitespace-nowrap text-grayscale-500 type-body-7">
                        <InfoIcon aria-hidden className="size-4 shrink-0" focusable="false" />
                        <span>유형을 변경하면 필터가 초기화될 수 있어요!</span>
                    </div>
                </div>
                <FilterActions
                    onReset={onReset}
                    onSave={onSave}
                    resetDisabled={resetDisabled}
                    saveDisabled={saveDisabled}
                />
            </div>
        </FilterPanel>
    );
}

function isPublicCategoryValue(value: string): value is PublicCategoryValue {
    return value === "construction" || value === "service" || value === "purchase";
}

export type IndustryCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        onTagRemove?: (tag: string) => void;
        onSearchClear?: () => void;
        onSearchValueChange?: (value: string) => void;
        inputValue?: string;
        searchPlaceholder?: string;
        showCaret?: boolean;
        suggestions?: readonly string[];
        tags?: readonly string[];
        onSuggestionSelect?: (suggestion: string) => void;
    };

export function IndustryCategoryPopover({
    className,
    inputValue,
    onReset,
    onSave,
    onSearchClear,
    onSearchValueChange,
    searchPlaceholder,
    showCaret = false,
    suggestions = [],
    tags = [],
    onTagRemove,
    onSuggestionSelect,
    ...props
}: IndustryCategoryPopoverProps) {
    const hasTags = tags.length > 0;

    return (
        <FilterPanel className={className} height="h-[320px]" {...props}>
            <FilterBody>
                <div className="flex w-full flex-col gap-4">
                    <SectionTitle>업종</SectionTitle>
                    <div className="flex w-full flex-col gap-4">
                        <PopupSearchField
                            onClear={onSearchClear}
                            placeholder={searchPlaceholder}
                            onValueChange={onSearchValueChange}
                            showCaret={showCaret}
                            value={inputValue}
                        />
                        {hasTags && (
                            <div className="flex w-full flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <FilterTag
                                        className={tag.length > 28 ? "w-full justify-between" : undefined}
                                        key={tag}
                                        onRemove={() => onTagRemove?.(tag)}
                                    >
                                        {tag}
                                    </FilterTag>
                                ))}
                            </div>
                        )}
                        {suggestions.length > 0 && (
                            <SelectMenu
                                className="max-h-28 w-full overflow-y-auto rounded-[8px]"
                                onSelect={(option) => onSuggestionSelect?.(option.value)}
                                options={suggestions.map((suggestion) => ({
                                    label: suggestion,
                                    value: suggestion,
                                }))}
                                variant="search"
                            />
                        )}
                    </div>
                </div>
                <FilterActions
                    onReset={onReset}
                    onSave={onSave}
                    resetDisabled={!hasTags}
                    saveDisabled={!hasTags}
                />
            </FilterBody>
        </FilterPanel>
    );
}

export type PlaceCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        onTagRemove?: () => void;
        city?: string;
        district?: string;
        localOnly?: boolean;
        advancedDisabled?: boolean;
        selectedCooperative?: CooperativeValue;
        tag?: string;
        cityOptions?: readonly string[];
        districtOptions?: readonly string[];
        onCityChange?: (city: string) => void;
        onCooperativeChange?: (value: CooperativeValue) => void;
        onDistrictChange?: (district: string) => void;
        onLocalOnlyChange?: (checked: boolean) => void;
    };

export function PlaceCategoryPopover({
    advancedDisabled = false,
    city,
    cityOptions = [],
    className,
    district,
    districtOptions = [],
    localOnly = false,
    onCityChange,
    onCooperativeChange,
    onDistrictChange,
    onLocalOnlyChange,
    onReset,
    onSave,
    onTagRemove,
    selectedCooperative,
    tag,
    ...props
}: PlaceCategoryPopoverProps) {
    const hasSelection = Boolean(tag);

    return (
        <FilterPanel className={className} height="h-[400px]" {...props}>
            <FilterBody>
                <div className="flex w-full flex-1 flex-col gap-6">
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex w-full items-start justify-between">
                            <SectionTitle>지역</SectionTitle>
                            <label className="flex items-center gap-1 text-grayscale-600 type-body-7">
                                지역 업체만
                                <CheckboxSquare
                                    ariaLabel="지역 업체만"
                                    checked={localOnly}
                                    className="size-6"
                                    disabled={!city || advancedDisabled}
                                    onCheckedChange={onLocalOnlyChange}
                                />
                            </label>
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <Select
                                ariaLabel="시도 선택"
                                boxClassName="w-full justify-between"
                                className="w-full"
                                menuClassName="w-full"
                                onValueChange={onCityChange}
                                options={cityOptions.map((option) => ({ label: option, value: option }))}
                                placeholder="시 · 도 · 전체 선택"
                                size="xs"
                                value={city}
                            />
                            <Select
                                ariaLabel="시군구 선택"
                                boxClassName="w-full justify-between"
                                className="w-full"
                                disabled={!city || advancedDisabled}
                                menuClassName="w-full"
                                onValueChange={onDistrictChange}
                                options={districtOptions.map((option) => ({ label: option, value: option }))}
                                placeholder="시 · 군 · 구 선택"
                                size="xs"
                                value={district}
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-4">
                        <SectionTitle>공동도급여부</SectionTitle>
                        <div className="flex w-full gap-2">
                            {cooperativeOptions.map((option) => (
                                <ChoiceButton
                                    disabled={advancedDisabled}
                                    key={option.value}
                                    onClick={() => onCooperativeChange?.(option.value)}
                                    selected={option.value === selectedCooperative}
                                >
                                    {option.label}
                                </ChoiceButton>
                            ))}
                        </div>
                    </div>
                    {tag && (
                        <FilterTag className="max-w-full" onRemove={onTagRemove}>
                            {tag}
                        </FilterTag>
                    )}
                </div>
                <FilterActions
                    onReset={onReset}
                    onSave={onSave}
                    resetDisabled={!hasSelection}
                    saveDisabled={!hasSelection}
                />
            </FilterBody>
        </FilterPanel>
    );
}

export type CalendarCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        activeType?: DateFilterType;
        endDate?: string;
        heading?: string;
        selectedQuickRange?: string;
        showTypeSelector?: boolean;
        startDate?: string;
        advancedDisabled?: boolean;
        onQuickRangeSelect?: (range: string) => void;
        onTypeSelect?: (type: DateFilterType) => void;
    };

export function CalendarCategoryPopover({
    activeType = "open",
    advancedDisabled = false,
    className,
    endDate,
    heading = "기간",
    onReset,
    onSave,
    onQuickRangeSelect,
    onTypeSelect,
    selectedQuickRange,
    showTypeSelector = true,
    startDate,
    ...props
}: CalendarCategoryPopoverProps) {
    const hasSelection = Boolean(selectedQuickRange) || (Boolean(startDate) && Boolean(endDate));
    const quickRanges = ["1개월", "3개월", "6개월", "1년"];

    return (
        <FilterPanel className={className} height="h-[320px]" {...props}>
            <FilterBody>
                <div className="flex w-full flex-col gap-6">
                    <div className="flex w-full flex-col gap-4">
                        <SectionTitle>{heading}</SectionTitle>
                        {showTypeSelector && <SegmentedControl disabled={advancedDisabled} onValueChange={onTypeSelect} options={dateTypeOptions} value={activeType} />}
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center gap-1">
                            <DateField disabled={advancedDisabled} value={startDate} />
                            <span className="text-grayscale-600 type-body-7">~</span>
                            <DateField disabled={advancedDisabled} value={endDate} />
                        </div>
                        <div className="flex w-full gap-2">
                            {quickRanges.map((range) => (
                                <ChoiceButton
                                    key={range}
                                    onClick={() => onQuickRangeSelect?.(range)}
                                    selected={range === selectedQuickRange}
                                >
                                    {range}
                                </ChoiceButton>
                            ))}
                        </div>
                    </div>
                </div>
                <FilterActions
                    onReset={onReset}
                    onSave={onSave}
                    resetDisabled={!hasSelection}
                    saveDisabled={!hasSelection}
                />
            </FilterBody>
        </FilterPanel>
    );
}

function DateField({ disabled = false, value }: { disabled?: boolean; value?: string }) {
    return (
        <button
            className={mergeClasses("flex h-8 flex-1 items-center justify-between rounded-[8px] border border-grayscale-200 bg-white px-3 py-1.5 text-grayscale-700 type-body-7", disabled && "cursor-not-allowed opacity-40")}
            disabled={disabled}
            type="button"
        >
            <span className={mergeClasses("truncate", value ? "text-grayscale-700" : "text-grayscale-500")}>
                {value || "날짜 선택"}
            </span>
            <CalendarIcon aria-hidden className="size-4 shrink-0 text-grayscale-600" focusable="false" />
        </button>
    );
}

export type PriceCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        activeType?: AmountFilterType;
        maxLabel?: string;
        minLabel?: string;
        selectedPreset?: (typeof pricePresetLabels)[number];
        advancedDisabled?: boolean;
        onPresetSelect?: (preset: (typeof pricePresetLabels)[number]) => void;
        onTypeSelect?: (type: AmountFilterType) => void;
    };

export function PriceCategoryPopover({
    activeType = "base",
    advancedDisabled = false,
    className,
    maxLabel = DEFAULT_MAX_PRICE_LABEL,
    minLabel = DEFAULT_MIN_PRICE_LABEL,
    onReset,
    onSave,
    onPresetSelect,
    onTypeSelect,
    selectedPreset,
    ...props
}: PriceCategoryPopoverProps) {
    const hasSelection =
        Boolean(selectedPreset) || minLabel !== DEFAULT_MIN_PRICE_LABEL || maxLabel !== DEFAULT_MAX_PRICE_LABEL;

    return (
        <FilterPanel className={className} height="h-[460px]" {...props}>
            <div className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-4">
                    <SectionTitle>금액</SectionTitle>
                    <SegmentedControl disabled={advancedDisabled} onValueChange={onTypeSelect} options={amountTypeOptions} value={activeType} />
                </div>
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full flex-col items-center gap-5">
                        <div className="flex items-center gap-2 text-grayscale-800 type-body-5">
                            <span>{minLabel}</span>
                            <span>~</span>
                            <span>{maxLabel}</span>
                        </div>
                        <RangePreview selected={hasSelection} />
                    </div>
                    <div className="rounded-[16px] bg-grayscale-50 p-4">
                        <div className="flex w-full items-center gap-1 text-grayscale-700 type-body-7">
                            <PriceInputField disabled={advancedDisabled} label="최소금액" />
                            <span className="text-grayscale-500">~</span>
                            <PriceInputField disabled={advancedDisabled} label="최대금액" />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex gap-2">
                            {pricePresetLabels.slice(0, 2).map((label) => (
                                <ChoiceButton
                                    key={label}
                                    onClick={() => onPresetSelect?.(label)}
                                    selected={label === selectedPreset}
                                >
                                    {label}
                                </ChoiceButton>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {pricePresetLabels.slice(2, 4).map((label) => (
                                <ChoiceButton
                                    key={label}
                                    onClick={() => onPresetSelect?.(label)}
                                    selected={label === selectedPreset}
                                >
                                    {label}
                                </ChoiceButton>
                            ))}
                        </div>
                        <ChoiceButton
                            onClick={() => onPresetSelect?.(pricePresetLabels[4])}
                            selected={pricePresetLabels[4] === selectedPreset}
                        >
                            {pricePresetLabels[4]}
                        </ChoiceButton>
                    </div>
                </div>
                <div className="flex justify-end">
                    <FilterActions
                        onReset={onReset}
                        onSave={onSave}
                        resetDisabled={!hasSelection}
                        saveDisabled={!hasSelection}
                    />
                </div>
            </div>
        </FilterPanel>
    );
}

function RangePreview({ selected }: { selected?: boolean }) {
    return (
        <div className="relative h-4 w-full">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-grayscale-200" />
            <div
                className={mergeClasses(
                    "absolute top-1/2 h-1 -translate-y-1/2 rounded-full",
                    selected ? "left-[28%] right-0 bg-primary-400" : "left-0 right-0 bg-grayscale-200",
                )}
            />
            <span className="absolute left-0 top-1/2 size-4 -translate-y-1/2 rounded-full border border-grayscale-200 bg-white" />
            <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 rounded-full border border-grayscale-200 bg-white" />
            {selected && (
                <span className="absolute left-[28%] top-1/2 size-4 -translate-y-1/2 rounded-full border border-grayscale-200 bg-white" />
            )}
        </div>
    );
}

function PriceInputField({ disabled = false, label }: { disabled?: boolean; label: string }) {
    return (
        <button
            className={mergeClasses("flex h-8 flex-1 items-center justify-between rounded-[8px] border border-grayscale-200 bg-white px-3 py-1.5", disabled && "cursor-not-allowed opacity-40")}
            disabled={disabled}
            type="button"
        >
            <span>{label}</span>
            <span>원</span>
        </button>
    );
}

export type ContractCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        selectedMethod?: string;
        methods?: readonly string[];
        onMethodSelect?: (method: string) => void;
    };

export function ContractCategoryPopover({
    className,
    methods,
    onMethodSelect,
    onReset,
    onSave,
    selectedMethod,
    ...props
}: ContractCategoryPopoverProps) {
    return (
        <SelectCategoryPopover
            className={className}
            label="계약방법"
            onOptionSelect={onMethodSelect}
            onReset={onReset}
            onSave={onSave}
            placeholder="계약방법 선택"
            selectedLabel={selectedMethod}
            options={methods}
            {...props}
        />
    );
}

export type AgencyCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        selectedAgency?: string;
        agencies?: readonly string[];
        onAgencySelect?: (agency: string) => void;
    };

export function AgencyCategoryPopover({
    agencies,
    className,
    onAgencySelect,
    onReset,
    onSave,
    selectedAgency,
    ...props
}: AgencyCategoryPopoverProps) {
    return (
        <SelectCategoryPopover
            className={className}
            label="발주기관"
            onOptionSelect={onAgencySelect}
            onReset={onReset}
            onSave={onSave}
            placeholder="발주기관 선택"
            selectedLabel={selectedAgency}
            options={agencies}
            {...props}
        />
    );
}

function SelectCategoryPopover({
    className,
    label,
    onOptionSelect,
    onTagRemove,
    onReset,
    onSave,
    placeholder,
    options = [],
    selectedLabel,
    ...props
}: React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        label: string;
        onOptionSelect?: (value: string) => void;
        options?: readonly string[];
        placeholder: string;
        selectedLabel?: string;
        onTagRemove?: () => void;
    }) {
    const hasSelection = Boolean(selectedLabel);

    return (
        <FilterPanel className={className} height="h-[320px]" {...props}>
            <FilterBody>
                <div className="flex w-full flex-col gap-4">
                    <SectionTitle>{label}</SectionTitle>
                    {options.length > 0 ? (
                        <Select
                            ariaLabel={label}
                            boxClassName="w-full justify-between"
                            className="w-full"
                            menuClassName="w-full"
                            onValueChange={onOptionSelect}
                            options={options.map((option) => ({ label: option, value: option }))}
                            placeholder={placeholder}
                            size="xs"
                            value={selectedLabel}
                        />
                    ) : (
                        <SelectLikeField label={label}>{placeholder}</SelectLikeField>
                    )}
                    {selectedLabel && (
                        <FilterTag onRemove={onTagRemove}>{selectedLabel}</FilterTag>
                    )}
                </div>
                <FilterActions
                    onReset={onReset}
                    onSave={onSave}
                    resetDisabled={!hasSelection}
                    saveDisabled={!hasSelection}
                />
            </FilterBody>
        </FilterPanel>
    );
}
