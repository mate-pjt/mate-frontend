'use client';

import Image from "next/image";
import { useRef, useState } from "react";

import { SearchIcon } from "@/components/icons";

import { dispatchInputValueChange } from "./input-value-event";

export type SearchInputVariant = "default" | "popup";

export type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
    variant?: SearchInputVariant;
    clearable?: boolean;
    onClear?: () => void;
    onValueChange?: (value: string) => void;
};

const variantClasses = {
    default: {
        root: "h-10",
        text: "type-body-3",
    },
    popup: {
        root: "h-9",
        text: "type-body-7",
    },
} as const;

export function SearchInput({
    "aria-label": ariaLabel = "검색",
    className,
    clearable = true,
    defaultValue,
    disabled = false,
    onBlur,
    onChange,
    onClear,
    onFocus,
    onValueChange,
    placeholder = "텍스트",
    readOnly,
    value,
    variant = "popup",
    ...props
}: SearchInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() => defaultValue?.toString() ?? "");
    const inputValue = value === undefined ? internalValue : value?.toString() ?? "";
    const hasValue = inputValue.length > 0;
    const classes = variantClasses[variant];
    const showSearchIcon = !focused && !hasValue;
    const canClearValue = value === undefined || Boolean(onChange || onClear || onValueChange);
    const showClearButton = clearable && !disabled && !readOnly && hasValue && canClearValue;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (value === undefined) {
            setInternalValue(event.target.value);
        }

        onValueChange?.(event.target.value);
        onChange?.(event);
    }

    function handleClear() {
        if (inputRef.current) {
            dispatchInputValueChange(inputRef.current, "");
        }
        onClear?.();
        inputRef.current?.focus();
    }

    return (
        <div
            className={[
                "inline-flex w-[300px] items-center rounded-[8px] border border-grayscale-200 bg-grayscale-50 px-3 text-grayscale-700",
                classes.root,
                disabled ? "cursor-not-allowed opacity-40" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {showSearchIcon && (
                <SearchIcon
                    aria-hidden
                    className="mr-1 size-4 shrink-0 text-grayscale-500"
                    focusable="false"
                />
            )}
            <input
                aria-label={ariaLabel}
                className={[
                    "min-w-0 flex-1 bg-transparent outline-none caret-grayscale-700 placeholder:text-grayscale-500",
                    classes.text,
                    disabled ? "cursor-not-allowed" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                defaultValue={undefined}
                disabled={disabled}
                onBlur={(event) => {
                    setFocused(false);
                    onBlur?.(event);
                }}
                onChange={handleChange}
                onFocus={(event) => {
                    setFocused(true);
                    onFocus?.(event);
                }}
                placeholder={focused ? "" : placeholder}
                readOnly={readOnly}
                ref={inputRef}
                value={inputValue}
                {...props}
            />
            {showClearButton && (
                <button
                    aria-label="검색어 지우기"
                    className="ml-2 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center"
                    onClick={handleClear}
                    type="button"
                >
                    <Image
                        aria-hidden
                        alt=""
                        className="size-5"
                        height={20}
                        src="/icon/24dp/close_circle.svg"
                        width={20}
                    />
                </button>
            )}
        </div>
    );
}
