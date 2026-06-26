'use client';

import { useState } from "react";

import { CheckIcon } from "@/components/icons";

export type CheckboxSquareProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    ariaLabel?: string;
};

export function CheckboxSquare({
    ariaLabel = "체크박스",
    checked,
    className,
    defaultChecked = false,
    disabled = false,
    onCheckedChange,
    onClick,
    type = "button",
    ...props
}: CheckboxSquareProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const selected = checked ?? internalChecked;

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        const nextChecked = !selected;

        if (checked === undefined) {
            setInternalChecked(nextChecked);
        }

        onCheckedChange?.(nextChecked);
    }

    return (
        <button
            aria-checked={selected}
            aria-label={ariaLabel}
            className={[
                "group inline-flex size-6 shrink-0 items-center justify-center p-0.5",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            disabled={disabled}
            onClick={handleClick}
            role="checkbox"
            type={type}
            {...props}
        >
            <span
                aria-hidden
                className={[
                    "inline-flex size-5 items-center justify-center rounded-[6px] border transition-colors",
                    selected
                        ? "border-primary-400 bg-primary-400 text-white"
                        : "border-grayscale-200 bg-white text-transparent",
                    !selected && !disabled ? "group-hover:border-grayscale-600" : "",
                    disabled && selected ? "opacity-40" : "",
                    disabled && !selected ? "bg-grayscale-100" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {selected && <CheckIcon className="size-4" />}
            </span>
        </button>
    );
}
