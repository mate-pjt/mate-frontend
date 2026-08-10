'use client';

import Image from "next/image";

import { CheckIcon, LimitIcon } from "@/components/icons";

const selectMenuIcons = {
    limit: LimitIcon,
} as const;

type SelectMenuIconName = keyof typeof selectMenuIcons;
type SelectMenuIconValue = SelectMenuIconName | string;

const variantClasses = {
    default: {
        root: "w-[212px] rounded-[16px] border border-grayscale-200 bg-white p-2",
        item: "flex min-h-9 w-full items-center justify-between rounded-[8px] px-2 py-2 type-body-5",
        selected: "bg-primary-100 text-primary-400",
        highlighted: "text-grayscale-700 hover:bg-grayscale-50",
        normal: "text-grayscale-700 hover:bg-grayscale-50",
        showLeadingIcon: false,
        showSelectedIcon: true,
    },
    search: {
        root: "w-[300px] rounded-[8px] bg-white p-2",
        item: "flex min-h-9 w-full items-center gap-2 rounded-[8px] px-2 py-2 type-body-7",
        selected: "text-grayscale-700 hover:bg-grayscale-50 hover:text-grayscale-dark-hover",
        highlighted: "text-grayscale-700 hover:bg-grayscale-50 hover:text-grayscale-dark-hover",
        normal: "text-grayscale-700 hover:bg-grayscale-50 hover:text-grayscale-dark-hover",
        showLeadingIcon: false,
        showSelectedIcon: false,
    },
    publicFilter: {
        root: "rounded-[16px] bg-transparent p-0",
        item: "flex min-h-9 w-full items-center justify-between rounded-[8px] px-2 py-2 type-body-5",
        selected: "bg-primary-100 text-primary-400",
        highlighted: "bg-grayscale-50 text-grayscale-700",
        normal: "text-grayscale-700 hover:bg-grayscale-50",
        showLeadingIcon: true,
        showSelectedIcon: true,
    },
} as const;

export type SelectMenuOption = {
    value: string;
    label: string;
    icon?: SelectMenuIconValue;
    disabled?: boolean;
};

export type SelectMenuVariant = keyof typeof variantClasses;

type SelectMenuRootProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
    options: readonly SelectMenuOption[];
    selectedValue?: string;
    highlightedValue?: string;
    onSelect?: (option: SelectMenuOption) => void;
    variant?: SelectMenuVariant;
};

export type SelectMenuProps = SelectMenuRootProps;

function mergeClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function isNamedIcon(icon: SelectMenuIconValue): icon is SelectMenuIconName {
    return icon in selectMenuIcons;
}

export function SelectMenu({
    className,
    onSelect,
    options,
    highlightedValue,
    selectedValue,
    variant = "default",
    ...props
}: SelectMenuProps) {
    const classes = variantClasses[variant];

    function getItemClassName(selected: boolean, highlighted: boolean) {
        return mergeClasses(
            classes.item,
            selected
                ? classes.selected
                : highlighted
                  ? classes.highlighted
                  : classes.normal,
        );
    }

    return (
        <div
            className={mergeClasses(classes.root, className)}
            role="listbox"
            {...props}
        >
            {options.map((option) => {
                const selected = option.value === selectedValue;
                const highlighted = option.value === highlightedValue;

                return (
                    <button
                        aria-selected={selected}
                        className={getItemClassName(selected, highlighted)}
                        disabled={option.disabled}
                        key={option.value}
                        onClick={() => onSelect?.(option)}
                        role="option"
                        type="button"
                    >
                        <span className="flex items-center gap-[7px]">
                            {classes.showLeadingIcon && option.icon && <SelectMenuIcon icon={option.icon} />}
                            <span className="truncate">{option.label}</span>
                        </span>
                        {classes.showSelectedIcon && (
                            <CheckIcon
                                aria-hidden
                                className={mergeClasses("size-5", selected ? "opacity-100" : "opacity-0")}
                                focusable="false"
                                height={20}
                                width={20}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function SelectMenuIcon({ icon }: { icon: SelectMenuIconValue }) {
    if (isNamedIcon(icon)) {
        const Icon = selectMenuIcons[icon];
        return <Icon aria-hidden className="size-6 shrink-0" focusable="false" />;
    }

    return <Image alt="" aria-hidden className="size-6 shrink-0" height={24} src={icon} width={24} />;
}
