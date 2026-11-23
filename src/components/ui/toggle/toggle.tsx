'use client';

import { useState } from "react";

export type ToggleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    ariaLabel?: string;
    unavailable?: boolean;
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
    unavailable = false,
    ...props
}: ToggleProps) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const selected = checked ?? internalChecked;
    const isDisabled = disabled || unavailable;
    const trackClass = unavailable
        ? "justify-center bg-grayscale-200"
        : selected ? "justify-end bg-primary-400" : "justify-start bg-grayscale-100";

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        onClick?.(event);

        if (event.defaultPrevented || isDisabled) {
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
            aria-checked={unavailable ? undefined : selected}
            aria-label={ariaLabel}
            className={[
                "inline-flex h-6 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors",
                trackClass,
                isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                disabled && !unavailable && "opacity-40",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            disabled={isDisabled}
            onClick={handleClick}
            role={unavailable ? undefined : "switch"}
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
