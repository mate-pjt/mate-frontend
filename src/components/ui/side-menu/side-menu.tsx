'use client';

import { useState } from "react";

import { SideMenuIcon, type SideMenuIconName } from "./side-menu-icon";

export type SideMenuItem = {
    value: string;
    label: string;
    icon: SideMenuIconName;
    disabled?: boolean;
};

export type SideMenuProps = Omit<React.HTMLAttributes<HTMLElement>, "onSelect" | "defaultValue"> & {
    items: SideMenuItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, item: SideMenuItem) => void;
    ariaLabel?: string;
};

export function SideMenu({
    ariaLabel = "사이드 메뉴",
    className,
    defaultValue,
    items,
    onValueChange,
    value,
    ...props
}: SideMenuProps) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value);
    const selectedValue = value ?? internalValue;

    return (
        <nav
            aria-label={ariaLabel}
            className={["w-[220px]", className].filter(Boolean).join(" ")}
            {...props}
        >
            <ul className="flex w-full flex-col items-start">
                {items.map((item) => {
                    const selected = item.value === selectedValue;

                    return (
                        <li className="w-full" key={item.value}>
                            <button
                                aria-current={selected ? "page" : undefined}
                                className={[
                                    "flex min-h-[46px] w-full items-center gap-2 rounded-[8px] p-3 text-left type-body-2 transition-colors",
                                    selected
                                        ? "bg-grayscale-50 text-grayscale-700"
                                        : "text-grayscale-500 enabled:hover:bg-grayscale-50 enabled:hover:text-[#7C7F83]",
                                    item.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                disabled={item.disabled}
                                onClick={() => {
                                    if (value === undefined) {
                                        setInternalValue(item.value);
                                    }

                                    onValueChange?.(item.value, item);
                                }}
                                type="button"
                            >
                                <span className="flex size-5 shrink-0 items-center justify-center">
                                    <SideMenuIcon icon={item.icon} />
                                </span>
                                <span className="truncate">{item.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
