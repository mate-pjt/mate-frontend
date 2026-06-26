'use client';

import { useState } from "react";

const sizeClasses = {
    s: {
        root: "h-9 w-[267px] rounded-[8px] p-0.5",
        item: "min-w-0 flex-1 rounded-[8px] px-3 py-1",
        selected: "shadow-[0_0_10px_rgba(0,0,0,0.08)]",
    },
    xs: {
        root: "h-6 rounded-[4px] p-0.5",
        item: "min-w-[57px] rounded-[4px] px-4 py-1",
        selected: "shadow-[0_0_4px_rgba(0,0,0,0.06)]",
    },
} as const;

const tabNavigationKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"] as const;

export type TabMenuSize = keyof typeof sizeClasses;

export type TabMenuItem = {
    value: string;
    label: string;
    disabled?: boolean;
};

export type TabMenuProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
    items: TabMenuItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, item: TabMenuItem) => void;
    size?: TabMenuSize;
    ariaLabel?: string;
};

export function TabMenu({
    ariaLabel = "탭 메뉴",
    className,
    defaultValue,
    items,
    onKeyDown,
    onValueChange,
    size = "s",
    value,
    ...props
}: TabMenuProps) {
    const [internalValue, setInternalValue] = useState(
        defaultValue ?? items.find((item) => !item.disabled)?.value ?? items[0]?.value,
    );
    const selectedValue = value ?? internalValue;
    const classes = sizeClasses[size];

    function selectItem(item: TabMenuItem) {
        if (value === undefined) {
            setInternalValue(item.value);
        }

        onValueChange?.(item.value, item);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        onKeyDown?.(event);

        if (event.defaultPrevented || !tabNavigationKeys.includes(event.key as (typeof tabNavigationKeys)[number])) {
            return;
        }

        const enabledIndexes = items
            .map((item, index) => (item.disabled ? -1 : index))
            .filter((index) => index >= 0);

        if (enabledIndexes.length === 0) {
            return;
        }

        event.preventDefault();

        const currentEnabledIndex = enabledIndexes.findIndex(
            (index) => items[index]?.value === selectedValue,
        );
        const nextEnabledIndex = getNextEnabledIndex(event.key, currentEnabledIndex, enabledIndexes.length);
        const nextItemIndex = enabledIndexes[nextEnabledIndex];
        const nextItem = items[nextItemIndex];

        if (!nextItem) {
            return;
        }

        selectItem(nextItem);

        const tabButtons = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        tabButtons[nextItemIndex]?.focus();
    }

    return (
        <div
            aria-label={ariaLabel}
            className={[
                "inline-flex items-stretch bg-grayscale-100",
                classes.root,
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            onKeyDown={handleKeyDown}
            role="tablist"
            {...props}
        >
            {items.map((item) => {
                const selected = item.value === selectedValue;

                return (
                    <button
                        aria-selected={selected}
                        className={[
                            "inline-flex h-full items-center justify-center whitespace-nowrap type-body-7 transition-colors",
                            classes.item,
                            selected
                                ? ["bg-white text-grayscale-700", classes.selected].join(" ")
                                : "text-grayscale-600 enabled:hover:text-grayscale-700",
                            item.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        disabled={item.disabled}
                        key={item.value}
                        onClick={() => selectItem(item)}
                        role="tab"
                        tabIndex={selected ? 0 : -1}
                        type="button"
                    >
                        <span className="truncate">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

function getNextEnabledIndex(key: string, currentIndex: number, enabledCount: number) {
    if (key === "Home" || currentIndex === -1) {
        return 0;
    }

    if (key === "End") {
        return enabledCount - 1;
    }

    const offset = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;

    return (currentIndex + offset + enabledCount) % enabledCount;
}
