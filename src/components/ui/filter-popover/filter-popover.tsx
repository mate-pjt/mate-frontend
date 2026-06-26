'use client';

import Image from "next/image";

import {
    CalendarIcon,
    CheckIcon,
    CloseIcon,
    DownArrowIcon,
    InfoIcon,
    SearchIcon,
} from "@/components/icons";
import { CheckboxSquare } from "@/components/ui/checkbox";

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

function mergeClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function FilterPanel({
    children,
    className,
    height,
    width = "w-[380px]",
}: React.HTMLAttributes<HTMLDivElement> & {
    height?: string;
    width?: string;
}) {
    return (
        <section
            className={mergeClasses(
                "flex flex-col items-start rounded-[16px] border border-grayscale-200 bg-white p-6 shadow-[0_0_12px_#f1f3f5]",
                width,
                height,
                className,
            )}
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
            <button
                className={mergeClasses(
                    "flex flex-1 items-center justify-center rounded-[8px] bg-grayscale-50 px-3 py-1.5 text-grayscale-700 type-body-7",
                    resetDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-grayscale-100",
                )}
                disabled={resetDisabled}
                onClick={onReset}
                type="button"
            >
                {labels?.reset ?? "초기화"}
            </button>
            <button
                className={mergeClasses(
                    "flex flex-1 items-center justify-center rounded-[8px] bg-primary-400 px-3 py-1.5 text-white type-body-7",
                    saveDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-primary-500",
                )}
                disabled={saveDisabled}
                onClick={onSave}
                type="button"
            >
                {labels?.save ?? "저장"}
            </button>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-grayscale-700 type-body-1">{children}</h3>;
}

function StaticIcon({
    alt = "",
    className,
    size = 24,
    src,
}: {
    alt?: string;
    className?: string;
    size?: number;
    src: string;
}) {
    return (
        <Image
            alt={alt}
            aria-hidden={alt ? undefined : true}
            className={mergeClasses("shrink-0", className)}
            height={size}
            src={src}
            width={size}
        />
    );
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
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center hover:text-[#7C7F83]"
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
    selected,
}: {
    children: React.ReactNode;
    selected?: boolean;
}) {
    return (
        <button
            className={mergeClasses(
                "flex min-h-8 flex-1 items-center justify-center rounded-[8px] px-3 py-1.5 text-center type-body-7",
                selected
                    ? "bg-primary-100 text-primary-400"
                    : "border border-grayscale-200 bg-white text-grayscale-700 hover:bg-grayscale-50",
            )}
            type="button"
        >
            {children}
        </button>
    );
}

function SegmentedControl<TValue extends string>({
    options,
    value,
}: {
    options: Array<{ value: TValue; label: string }>;
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
                                ? "bg-white text-grayscale-700 shadow-[0_0_10px_rgba(0,0,0,0.08)]"
                                : "text-grayscale-600",
                        )}
                        key={option.value}
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
}: {
    placeholder?: string;
    showCaret?: boolean;
    value?: string;
}) {
    const hasValue = Boolean(value);

    return (
        <div className="flex h-9 w-full items-center rounded-[8px] border border-grayscale-200 bg-grayscale-50 px-3 text-grayscale-700">
            {!hasValue && !showCaret && (
                <SearchIcon
                    aria-hidden
                    className="mr-1 size-4 shrink-0 text-grayscale-500"
                    focusable="false"
                />
            )}
            {showCaret && !hasValue && (
                <span aria-hidden className="mr-1 h-3 w-px rounded-full bg-grayscale-700" />
            )}
            <span
                className={mergeClasses(
                    "min-w-0 flex-1 truncate type-body-7",
                    hasValue ? "text-grayscale-700" : "text-grayscale-500",
                    showCaret && !hasValue ? "opacity-0" : "",
                )}
            >
                {value || placeholder}
            </span>
            {hasValue && (
                <button
                    aria-label="검색어 삭제"
                    className="ml-2 inline-flex size-5 items-center justify-center text-grayscale-500"
                    type="button"
                >
                    <CloseIcon aria-hidden className="size-4" focusable="false" />
                </button>
            )}
        </div>
    );
}

export type PublicCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        actionsDisabled?: boolean;
        highlightedValue?: PublicCategoryValue;
        selectedValue?: PublicCategoryValue;
    };

export function PublicCategoryPopover({
    actionsDisabled = true,
    className,
    highlightedValue,
    onReset,
    onSave,
    selectedValue,
    ...props
}: PublicCategoryPopoverProps) {
    const currentSelectedValue = selectedValue ?? (highlightedValue ? undefined : "construction");

    return (
        <FilterPanel className={className} width="w-[307px]" {...props}>
            <div className="flex w-full flex-col items-end gap-6">
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full flex-col">
                        {publicCategoryOptions.map((option) => {
                            const selected = option.value === currentSelectedValue;
                            const highlighted = option.value === highlightedValue;

                            return (
                                <button
                                    aria-pressed={selected}
                                    className={mergeClasses(
                                        "flex w-full items-center justify-between rounded-[8px] p-2 type-body-5",
                                        selected
                                            ? "bg-primary-100 text-primary-400"
                                            : highlighted
                                              ? "bg-grayscale-50 text-grayscale-700"
                                              : "text-grayscale-700 hover:bg-grayscale-50",
                                    )}
                                    key={option.value}
                                    type="button"
                                >
                                    <span className="flex items-center gap-[7px]">
                                        <StaticIcon size={24} src={option.icon} />
                                        {option.label}
                                    </span>
                                    <CheckIcon
                                        aria-hidden
                                        className={mergeClasses("size-5", selected ? "opacity-100" : "opacity-0")}
                                        focusable="false"
                                    />
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex w-full items-center gap-1 text-grayscale-500 type-body-7">
                        <InfoIcon aria-hidden className="size-4 shrink-0" focusable="false" />
                        <span>유형을 변경하면 필터가 초기화될 수 있어요!</span>
                    </div>
                </div>
                <FilterActions
                    onReset={onReset}
                    onSave={onSave}
                    resetDisabled={actionsDisabled}
                    saveDisabled={actionsDisabled}
                />
            </div>
        </FilterPanel>
    );
}

export type IndustryCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        inputValue?: string;
        searchPlaceholder?: string;
        showCaret?: boolean;
        tags?: string[];
    };

export function IndustryCategoryPopover({
    className,
    inputValue,
    onReset,
    onSave,
    searchPlaceholder,
    showCaret = false,
    tags = [],
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
                            placeholder={searchPlaceholder}
                            showCaret={showCaret}
                            value={inputValue}
                        />
                        {hasTags && (
                            <div className="flex w-full flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <FilterTag
                                        className={tag.length > 28 ? "w-full justify-between" : undefined}
                                        key={tag}
                                        onRemove={() => undefined}
                                    >
                                        {tag}
                                    </FilterTag>
                                ))}
                            </div>
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
        city?: string;
        district?: string;
        localOnly?: boolean;
        selectedCooperative?: CooperativeValue;
        tag?: string;
    };

export function PlaceCategoryPopover({
    city,
    className,
    district,
    localOnly = false,
    onReset,
    onSave,
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
                                    disabled={!city}
                                />
                            </label>
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <SelectLikeField label="시도 선택">
                                {city ?? "시 · 도 · 전체 선택"}
                            </SelectLikeField>
                            <SelectLikeField disabled={!city} label="시군구 선택">
                                {district ?? "시 · 군 · 구 선택"}
                            </SelectLikeField>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-4">
                        <SectionTitle>공동도급여부</SectionTitle>
                        <div className="flex w-full gap-2">
                            {cooperativeOptions.map((option) => (
                                <ChoiceButton
                                    key={option.value}
                                    selected={option.value === selectedCooperative}
                                >
                                    {option.label}
                                </ChoiceButton>
                            ))}
                        </div>
                    </div>
                    {tag && (
                        <FilterTag className="max-w-full" onRemove={() => undefined}>
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
        selectedQuickRange?: string;
        startDate?: string;
    };

export function CalendarCategoryPopover({
    activeType = "open",
    className,
    endDate = "2026.05.01",
    onReset,
    onSave,
    selectedQuickRange,
    startDate = "2026.05.01",
    ...props
}: CalendarCategoryPopoverProps) {
    const hasSelection = Boolean(selectedQuickRange);
    const quickRanges = ["1개월", "3개월", "6개월", "1년"];

    return (
        <FilterPanel className={className} height="h-[320px]" {...props}>
            <FilterBody>
                <div className="flex w-full flex-col gap-6">
                    <div className="flex w-full flex-col gap-4">
                        <SectionTitle>기간</SectionTitle>
                        <SegmentedControl options={dateTypeOptions} value={activeType} />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center gap-1">
                            <DateField value={startDate} />
                            <span className="text-grayscale-600 type-body-7">~</span>
                            <DateField value={endDate} />
                        </div>
                        <div className="flex w-full gap-2">
                            {quickRanges.map((range) => (
                                <ChoiceButton key={range} selected={range === selectedQuickRange}>
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

function DateField({ value }: { value: string }) {
    return (
        <button
            className="flex h-8 flex-1 items-center justify-between rounded-[8px] border border-grayscale-200 bg-white px-3 py-1.5 text-grayscale-700 type-body-7"
            type="button"
        >
            {value}
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
    };

export function PriceCategoryPopover({
    activeType = "base",
    className,
    maxLabel = "0 만 원",
    minLabel = "0 만 원",
    onReset,
    onSave,
    selectedPreset,
    ...props
}: PriceCategoryPopoverProps) {
    const hasSelection = Boolean(selectedPreset);

    return (
        <FilterPanel className={className} height="h-[460px]" {...props}>
            <div className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-4">
                    <SectionTitle>금액</SectionTitle>
                    <SegmentedControl options={amountTypeOptions} value={activeType} />
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
                            <PriceInputField label="최대금액" />
                            <span className="text-grayscale-500">~</span>
                            <PriceInputField label="최대금액" />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex gap-2">
                            {pricePresetLabels.slice(0, 2).map((label) => (
                                <ChoiceButton key={label} selected={label === selectedPreset}>
                                    {label}
                                </ChoiceButton>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {pricePresetLabels.slice(2, 4).map((label) => (
                                <ChoiceButton key={label} selected={label === selectedPreset}>
                                    {label}
                                </ChoiceButton>
                            ))}
                        </div>
                        <ChoiceButton selected={pricePresetLabels[4] === selectedPreset}>
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

function PriceInputField({ label }: { label: string }) {
    return (
        <button
            className="flex h-8 flex-1 items-center justify-between rounded-[8px] border border-grayscale-200 bg-white px-3 py-1.5"
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
    };

export function ContractCategoryPopover({
    className,
    onReset,
    onSave,
    selectedMethod,
    ...props
}: ContractCategoryPopoverProps) {
    return (
        <SelectCategoryPopover
            className={className}
            label="계약방법"
            onReset={onReset}
            onSave={onSave}
            placeholder="계약방법 선택"
            selectedLabel={selectedMethod}
            {...props}
        />
    );
}

export type AgencyCategoryPopoverProps = React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        selectedAgency?: string;
    };

export function AgencyCategoryPopover({
    className,
    onReset,
    onSave,
    selectedAgency,
    ...props
}: AgencyCategoryPopoverProps) {
    return (
        <SelectCategoryPopover
            className={className}
            label="발주기관"
            onReset={onReset}
            onSave={onSave}
            placeholder="발주기관 선택"
            selectedLabel={selectedAgency}
            {...props}
        />
    );
}

function SelectCategoryPopover({
    className,
    label,
    onReset,
    onSave,
    placeholder,
    selectedLabel,
    ...props
}: React.HTMLAttributes<HTMLDivElement> &
    FilterActionHandlers & {
        label: string;
        placeholder: string;
        selectedLabel?: string;
    }) {
    const hasSelection = Boolean(selectedLabel);

    return (
        <FilterPanel className={className} height="h-[320px]" {...props}>
            <FilterBody>
                <div className="flex w-full flex-col gap-4">
                    <SectionTitle>{label}</SectionTitle>
                    <SelectLikeField label={label}>{placeholder}</SelectLikeField>
                    {selectedLabel && (
                        <FilterTag onRemove={() => undefined}>{selectedLabel}</FilterTag>
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
