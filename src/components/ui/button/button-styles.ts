import type { ButtonIconName } from "./button-icon";

const variantClasses = {
    primary: {
        base: "bg-primary text-white",
        button: "enabled:hover:bg-primary-hover enabled:active:bg-primary-active",
        link: "hover:bg-primary-hover active:bg-primary-active",
    },
    secondary: {
        base: "bg-primary-100 text-primary",
        button: "enabled:hover:bg-primary-200 enabled:active:bg-primary-300",
        link: "hover:bg-primary-200 active:bg-primary-300",
    },
    tertiary: {
        base: "bg-grayscale-50 text-grayscale-700",
        button: "enabled:hover:bg-grayscale-100 enabled:active:bg-grayscale-200",
        link: "hover:bg-grayscale-100 active:bg-grayscale-200",
    },
    gray: {
        base: "bg-grayscale-50 text-grayscale-600",
        button: "enabled:hover:bg-grayscale-100 enabled:active:bg-grayscale-200",
        link: "hover:bg-grayscale-100 active:bg-grayscale-200",
    },
    outline: {
        base: "bg-grayscale-50 text-grayscale-700 outline-1 outline-grayscale-200",
        button: "enabled:hover:bg-grayscale-100 enabled:active:bg-grayscale-200",
        link: "hover:bg-grayscale-100 active:bg-grayscale-200",
    },
    danger: {
        base: "bg-danger-surface text-danger-emphasis",
        button: "enabled:hover:brightness-[0.98] enabled:active:brightness-95",
        link: "hover:brightness-[0.98] active:brightness-95",
    },
    text_lightblue: {
        base: "text-primary-300",
        button: "enabled:hover:text-primary-300 enabled:active:text-primary-300",
        link: "hover:text-primary-300 active:text-primary-300",
    },
    text_darkblue: {
        base: "text-primary-700",
        button: "enabled:hover:text-primary-700 enabled:active:text-primary-700",
        link: "hover:text-primary-700 active:text-primary-700",
    },
    text_gray: {
        base: "text-grayscale-600",
        button: "enabled:hover:text-grayscale-600 enabled:active:text-grayscale-600",
        link: "hover:text-grayscale-600 active:text-grayscale-600",
    },
    text_white: {
        base: "text-white",
        button: "enabled:hover:text-white enabled:active:text-white",
        link: "hover:text-white active:text-white",
    },
} as const;

const sizeClasses = {
    xs: "py-[6px] px-[12px] type-body-7 rounded-[8px]",
    sm: "py-[8px] px-[16px] type-body-2 rounded-[8px]",
    lg: "py-[10px] px-[18px] type-heading-7 rounded-[12px]",
    xxl: "py-[20px] px-[20px] type-heading-9 rounded-[16px] w-[340px]",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;
export type ButtonIconPosition = "left" | "right";

export type ButtonStyleProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ButtonIconName;
    iconPosition?: ButtonIconPosition;
};

type ButtonClassNameOptions = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    hasIcon?: boolean;
    className?: string;
    interaction?: "button" | "link";
};

export function getButtonClassName({
    variant = "primary",
    size = "sm",
    disabled = false,
    hasIcon = false,
    className,
    interaction = "button",
}: ButtonClassNameOptions) {
    const variantClass = variantClasses[variant];

    return [
        "inline-flex items-center justify-center",
        variantClass.base,
        variantClass[interaction],
        sizeClasses[size],
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
        hasIcon ? "gap-1" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
}
