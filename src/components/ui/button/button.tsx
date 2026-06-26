'use client';

import { ButtonIcon } from "./button-icon";
import { getButtonClassName, type ButtonStyleProps } from "./button-styles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps;

export function Button({
    children,
    className,
    type = "button",
    variant = "primary",
    size = "sm",
    icon,
    iconPosition = "left",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={getButtonClassName({
                variant,
                size,
                disabled,
                hasIcon: Boolean(icon),
                className,
                interaction: "button",
            })}
            disabled={disabled}
            {...props}
        >
            {icon && iconPosition === "left" && <ButtonIcon icon={icon} />}
            {children}
            {icon && iconPosition === "right" && <ButtonIcon icon={icon} />}
        </button>
    );
}
