'use client';

import { useState } from "react";

import { CheckIcon } from "@/components/icons";

export type CheckboxCircleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    active?: boolean;
    defaultActive?: boolean;
    onActiveChange?: (active: boolean) => void;
    ariaLabel?: string;
};

export function CheckboxCircle({
    active,
    ariaLabel = "원형 체크박스",
    className,
    defaultActive = true,
    disabled = false,
    onActiveChange,
    onClick,
    type = "button",
    ...props
}: CheckboxCircleProps) {
    const [internalActive, setInternalActive] = useState(defaultActive);
    const selected = active ?? internalActive;

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        const nextActive = !selected;

        if (active === undefined) {
            setInternalActive(nextActive);
        }

        onActiveChange?.(nextActive);
    }

    return (
        <button
            aria-label={ariaLabel}
            aria-checked={selected}
            className={[
                "group inline-flex size-6 shrink-0 items-center justify-center p-0.5",
                disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
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
                    "inline-flex size-5 items-center justify-center rounded-full text-white transition-colors",
                    selected ? "bg-primary-400" : "bg-grayscale-300",
                    !selected && !disabled ? "group-hover:bg-grayscale-500" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <CheckIcon className="size-3.5" />
            </span>
        </button>
    );
}
