'use client';

/**
 * TODO: 이 select-box를 래핑한 "DatePicker" 컴포넌트 만들기 (02_end_bidlist_defualt_05 참고)
 * */

import { DownArrowIcon } from "@/components/icons";

const variantClasses = {
    secondary: "border-transparent bg-primary-100 text-primary enabled:hover:bg-primary-200 enabled:active:bg-primary-300",
    white: "border-grayscale-200 bg-white text-grayscale-700 enabled:hover:bg-grayscale-50 enabled:active:bg-grayscale-100",
    gray: "border-grayscale-200 bg-grayscale-50 text-grayscale-700 enabled:hover:bg-grayscale-100 enabled:active:bg-grayscale-200",
} as const;

const sizeClasses = {
    s: "h-9 min-w-[72px] px-[10px] type-body-2",
    xs: "h-9 px-2 type-body-7",
} as const;

export type SelectBoxVariant = keyof typeof variantClasses;
export type SelectBoxSize = keyof typeof sizeClasses;

type SelectBoxProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
    variant?: SelectBoxVariant;
    size?: SelectBoxSize;
    open?: boolean;
    disabled?: boolean;
    placeholder?: string;
};

export function SelectBox({
    children,
    className,
    disabled = false,
    open,
    placeholder = "옵션",
    size = "s",
    type = "button",
    variant = "white",
    ...props
}: SelectBoxProps) {
    return (
        <button
            aria-expanded={open}
            aria-haspopup="listbox"
            className={[
                "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-[8px] border transition-colors",
                disabled
                    ? "cursor-not-allowed border-grayscale-200 bg-grayscale-100 text-grayscale-600"
                    : ["cursor-pointer", variantClasses[variant]].join(" "),
                sizeClasses[size],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            disabled={disabled}
            type={type}
            {...props}
        >
            <span className="truncate">{children ?? placeholder}</span>
            <DownArrowIcon aria-hidden focusable="false" height={16} width={16} />
        </button>
    );
}
