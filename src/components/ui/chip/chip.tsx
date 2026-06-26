'use client';

import { CloseIcon } from "@/components/icons";

export type ChipTextWeight = "medium" | "semibold";

export type ChipProps = React.HTMLAttributes<HTMLSpanElement> & {
    textWeight?: ChipTextWeight;
    removable?: boolean;
    removeLabel?: string;
    onRemove?: () => void;
};

const textWeightClasses = {
    medium: "type-body-7",
    semibold: "type-body-6",
} as const;

export function Chip({
    children,
    className,
    onRemove,
    removable = false,
    removeLabel = "삭제",
    textWeight = "medium",
    ...props
}: ChipProps) {
    return (
        <span
            className={[
                "inline-flex min-h-7 items-center justify-center gap-1 rounded-[6px] bg-primary-100 px-2 py-1 text-primary-400",
                textWeightClasses[textWeight],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...props}
        >
            <span className="whitespace-nowrap">{children}</span>
            {removable && onRemove && (
                <button
                    aria-label={removeLabel}
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center hover:text-[#7C7F83]"
                    onClick={onRemove}
                    type="button"
                >
                    <CloseIcon aria-hidden className="size-4" focusable="false" />
                </button>
            )}
        </span>
    );
}
