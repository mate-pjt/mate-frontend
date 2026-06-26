'use client';

import Image from "next/image";
import { useId, useRef, useState } from "react";

export type TextInputStatus = "default" | "check" | "error" | "success";
export type TextInputHelperAlign = "left" | "right";

export type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "suffix"> & {
    status?: TextInputStatus;
    helperText?: string;
    helperAlign?: TextInputHelperAlign;
    suffix?: React.ReactNode;
    clearable?: boolean;
    onClear?: () => void;
    fieldClassName?: string;
};

const helperToneClasses = {
    default: "text-primary-400",
    check: "text-primary-400",
    error: "text-[#e65555]",
    success: "text-[#24c304]",
} as const;

const helperAlignClasses = {
    left: "justify-start pl-2",
    right: "justify-end pr-2",
} as const;

export function TextInput({
    className,
    clearable = true,
    defaultValue,
    disabled = false,
    fieldClassName,
    helperAlign = "left",
    helperText,
    id,
    onBlur,
    onChange,
    onClear,
    onFocus,
    placeholder = "텍스트",
    readOnly,
    status = "default",
    suffix,
    value,
    ...props
}: TextInputProps) {
    const helperId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() => defaultValue?.toString() ?? "");
    const inputValue = value === undefined ? internalValue : value?.toString() ?? "";
    const hasValue = inputValue.length > 0;
    const showClearButton = clearable && !disabled && !readOnly && hasValue && status !== "check";

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (value === undefined) {
            setInternalValue(event.target.value);
        }

        onChange?.(event);
    }

    function handleClear() {
        if (value === undefined) {
            setInternalValue("");
        }

        onClear?.();
        inputRef.current?.focus();
    }

    return (
        <div
            className={[
                "inline-flex w-[197px] flex-col gap-2",
                disabled ? "opacity-40" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div
                className={[
                    "flex h-12 w-full items-center rounded-[8px] border border-grayscale-200 bg-white px-3",
                    disabled ? "cursor-not-allowed bg-grayscale-50" : "",
                    fieldClassName,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <input
                    aria-describedby={helperText ? helperId : undefined}
                    aria-invalid={status === "error" ? true : undefined}
                    className={[
                        "min-w-0 flex-1 bg-transparent text-grayscale-700 outline-none caret-primary-400 placeholder:text-grayscale-500",
                        "type-body-3",
                        disabled ? "cursor-not-allowed" : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    defaultValue={undefined}
                    disabled={disabled}
                    id={id}
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
                {suffix && (
                    <span className="ml-2 shrink-0 text-grayscale-700 type-body-2">
                        {suffix}
                    </span>
                )}
                {status === "check" && (
                    <Image
                        aria-hidden
                        alt=""
                        className="ml-2 size-5 shrink-0"
                        height={20}
                        src="/icon/24dp/check_circle.svg"
                        width={20}
                    />
                )}
                {showClearButton && (
                    <button
                        aria-label="입력값 지우기"
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
            {helperText && (
                <div
                    className={[
                        "flex w-full items-center type-body-8",
                        helperAlignClasses[helperAlign],
                        helperToneClasses[status],
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    id={helperId}
                >
                    {helperText}
                </div>
            )}
        </div>
    );
}
