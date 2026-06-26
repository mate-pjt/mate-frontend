'use client';

import { useState } from "react";

export type ToggleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    ariaLabel?: string;
};

export function Toggle({
    ariaLabel = "토글",
    checked,
    className,
    defaultChecked = true,
    disabled = false,
    onCheckedChange,
    onClick,
    type = "button",
    ...props
}: ToggleProps) {
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
                "inline-flex h-6 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors",
                selected ? "justify-end bg-primary-400" : "justify-start bg-grayscale-100",
                disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            disabled={disabled}
            onClick={handleClick}
            role="switch"
            type={type}
            {...props}
        >
            <span
                aria-hidden
                className="size-5 rounded-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.16)]"
            />
        </button>
    );
}
