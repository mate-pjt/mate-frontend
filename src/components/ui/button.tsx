import ArrowRightIcon from "@/assets/icons/rightarrow.svg";

type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "tertiary" | "outline";
    size?: "xs" | "sm" | "lg";
    icon?: string;
    iconPosition?: "left" | "right";
    onClick?: () => void;
    disabled?: boolean;
}

const variantClasses = {
    primary: `
        bg-primary text-white 
        enabled:hover:bg-primary-hover enabled:active:bg-primary-active
    `,
    secondary: `
        bg-primary-100 text-primary 
        enabled:hover:bg-primary-100 enabled:active:bg-primary-300
    `,
    tertiary: `
        bg-grayscale-50 text-grayscale-700 
        enabled:hover:bg-grayscale-100 enabled:active:bg-grayscale-200
    `,
    outline: `
        bg-grayscale-50 text-grayscale-700 
        enabled:hover:bg-grayscale-100 enabled:active:bg-grayscale-200 
        outline-1 outline-grayscale-200
    `,
};

const sizeClasses = {
    xs: "py-[6px] px-[12px] type-body-7 rounded-[8px]",
    sm: "py-[8px] px-[16px] type-body-2 rounded-[8px]",
    lg: "py-[10px] px-[18px] type-heading-7 rounded-[12px]",
};

export function Button({
    children,
    variant = "primary",
    size = "sm",
    icon,
    iconPosition = "left",
    onClick,
    disabled
}: ButtonProps) {
    return (
        <button
            className={`
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                ${icon ? "flex items-center gap-1" : ""}
                `}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && iconPosition === "left" && <ArrowRightIcon width={16} height={16} />}
            {children}
            {icon && iconPosition === "right" && <ArrowRightIcon width={16} height={16} />}
        </button>
    );
}
