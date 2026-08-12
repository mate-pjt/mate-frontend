'use client';

import { useState } from "react";

import { CheckIcon } from "@/components/icons";

export type CheckboxCircleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    active?: boolean;
    defaultActive?: boolean;
    onActiveChange?: (active: boolean) => void;
    ariaLabel?: string;
    size?: "sm" | "lg";
};

const sizeClasses = {
    sm: {
        button: "size-6 p-0.5",
        indicator: "size-5",
        icon: "size-3.5",
    },
    lg: {
        button: "size-10 p-1",
        indicator: "size-8",
        icon: "size-5",
    },
} as const;

export function CheckboxCircle({
    active,
    ariaLabel = "원형 체크박스",
    className,
    defaultActive = true,
    disabled = false,
    onActiveChange,
    onClick,
    size = "sm",
    type = "button",
    ...props
}: CheckboxCircleProps) {
    const [internalActive, setInternalActive] = useState(defaultActive);
    const selected = active ?? internalActive;
    const classes = sizeClasses[size];

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
                "group inline-flex shrink-0 items-center justify-center",
                classes.button,
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
                    "inline-flex items-center justify-center rounded-full text-white transition-colors",
                    classes.indicator,
                    selected ? "bg-primary-400" : "bg-grayscale-300",
                    !selected && !disabled ? "group-hover:bg-grayscale-500" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <CheckIcon className={classes.icon} />
            </span>
        </button>
    );
}
